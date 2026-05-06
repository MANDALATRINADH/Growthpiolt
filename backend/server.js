const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

const app = express();

// CORS configuration
const allowedOrigins = [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:10000',
    'https://growthpiolt.onrender.com',
    'https://growthpiolt-a24j.vercel.app'
];

app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

console.log('🔧 Starting GrowthPilot Backend...');
console.log('📡 CORS enabled for:', allowedOrigins);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://growthpilot_user:Trinadh%401349@clusrer1.zsrhawy.mongodb.net/growthpilot_db?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully!'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err.message));

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_Sli38TkEX0wcaC',
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

console.log('💳 Razorpay initialized with Key ID:', process.env.RAZORPAY_KEY_ID || 'rzp_test_Sli38TkEX0wcaC');

// ============ USER SCHEMA ============
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    googleId: { type: String },
    picture: { type: String },
    isPremium: { type: Boolean, default: false },
    premiumPlan: { type: String },
    premiumExpiry: { type: Date },
    premiumPaymentId: { type: String },
    streak: { type: Number, default: 0 },
    xp: { type: Number, default: 0 }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// ============ AUTH MIDDLEWARE ============
const authenticateToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'my_super_secret_key_2026');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

// ============ AUTH ROUTES ============

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'my_super_secret_key_2026',
            { expiresIn: '30d' }
        );
        
        res.json({
            success: true,
            token,
            user: { id: user._id, name, email, isPremium: false, streak: 0, xp: 0 }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'my_super_secret_key_2026',
            { expiresIn: '30d' }
        );
        
        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email, isPremium: user.isPremium, streak: user.streak, xp: user.xp }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Google Login
app.post('/api/auth/google', async (req, res) => {
    try {
        const { name, email, picture, googleId } = req.body;
        
        let user = await User.findOne({ email });
        
        if (!user) {
            user = new User({ name, email, picture: picture || '', googleId });
            await user.save();
        }
        
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'my_super_secret_key_2026',
            { expiresIn: '30d' }
        );
        
        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email, isPremium: user.isPremium, streak: user.streak, xp: user.xp }
        });
    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============ PAYMENT ROUTES ============

// Create Order - Monthly (₹99)
app.post('/api/create-order/monthly', authenticateToken, async (req, res) => {
    try {
        console.log('📦 Creating monthly order for user:', req.user.email);
        
        const options = {
            amount: 99 * 100,
            currency: 'INR',
            receipt: `receipt_monthly_${Date.now()}`,
            notes: {
                planType: 'monthly',
                userId: req.user.userId,
                userEmail: req.user.email,
                amount: '99'
            }
        };
        
        const order = await razorpay.orders.create(options);
        console.log('✅ Order created:', order.id);
        
        res.json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_Sli38TkEX0wcaC'
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create Order - Yearly (₹999)
app.post('/api/create-order/yearly', authenticateToken, async (req, res) => {
    try {
        console.log('📦 Creating yearly order for user:', req.user.email);
        
        const options = {
            amount: 999 * 100,
            currency: 'INR',
            receipt: `receipt_yearly_${Date.now()}`,
            notes: {
                planType: 'yearly',
                userId: req.user.userId,
                userEmail: req.user.email,
                amount: '999'
            }
        };
        
        const order = await razorpay.orders.create(options);
        console.log('✅ Order created:', order.id);
        
        res.json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_Sli38TkEX0wcaC'
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Verify Payment
app.post('/api/verify-payment', authenticateToken, async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            planType
        } = req.body;
        
        console.log('🔐 Verifying payment for order:', razorpay_order_id);
        
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');
        
        if (expectedSignature !== razorpay_signature) {
            console.error('❌ Invalid signature');
            return res.status(400).json({ success: false, error: 'Invalid payment signature' });
        }
        
        const premiumExpiry = new Date();
        if (planType === 'monthly') {
            premiumExpiry.setMonth(premiumExpiry.getMonth() + 1);
        } else {
            premiumExpiry.setFullYear(premiumExpiry.getFullYear() + 1);
        }
        
        await User.findByIdAndUpdate(req.user.userId, {
            isPremium: true,
            premiumPlan: planType,
            premiumExpiry: premiumExpiry,
            premiumPaymentId: razorpay_payment_id
        });
        
        console.log('✅ Payment verified successfully for user:', req.user.email);
        
        res.json({
            success: true,
            message: 'Payment verified successfully!',
            premiumExpiry: premiumExpiry.toISOString(),
            planType: planType
        });
        
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get User Premium Status
app.get('/api/premium/status', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('isPremium premiumPlan premiumExpiry premiumPaymentId');
        
        let isActive = user.isPremium;
        if (user.premiumExpiry && new Date(user.premiumExpiry) < new Date()) {
            isActive = false;
            await User.findByIdAndUpdate(req.user.userId, { isPremium: false });
        }
        
        res.json({
            success: true,
            premium: {
                isActive: isActive,
                plan: user.premiumPlan,
                expiry: user.premiumExpiry,
                paymentId: user.premiumPaymentId
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get User Profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ HEALTH CHECK ============
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'GrowthPilot API is running!',
        mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        razorpay: process.env.RAZORPAY_KEY_ID ? 'Configured' : 'Missing',
        port: process.env.PORT || 5000,
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to GrowthPilot API!',
        endpoints: {
            health: '/api/health',
            register: '/api/auth/register',
            login: '/api/auth/login',
            google: '/api/auth/google',
            monthlyOrder: '/api/create-order/monthly',
            yearlyOrder: '/api/create-order/yearly',
            verifyPayment: '/api/verify-payment',
            premiumStatus: '/api/premium/status'
        }
    });
});

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 ========================================`);
    console.log(`   GrowthPilot Backend Server Running!`);
    console.log(`   ========================================`);
    console.log(`   📍 URL: http://localhost:${PORT}`);
    console.log(`   ✅ Health: http://localhost:${PORT}/api/health`);
    console.log(`   💳 Razorpay: ${process.env.RAZORPAY_KEY_ID ? 'Configured ✓' : 'Missing ✗'}`);
    console.log(`   🗄️  MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected ✓' : 'Disconnected ✗'}`);
    console.log(`   ========================================\n`);
});