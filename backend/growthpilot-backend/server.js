const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Get PORT from environment - Render sets this to 10000
const PORT = process.env.PORT || 5000;

console.log(`📡 Attempting to bind to PORT: ${PORT}`);

// Routes
app.get('/', (req, res) => {
    res.json({ 
        message: 'GrowthPilot API is running!',
        port: PORT,
        status: 'online'
    });
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'GrowthPilot API is running!',
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    res.json({
        success: true,
        message: 'Registration successful!',
        user: { name, email }
    });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }
    
    res.json({
        success: true,
        message: 'Login successful!',
        user: { email, name: 'Demo User' }
    });
});

app.post('/api/auth/google', (req, res) => {
    const { name, email } = req.body;
    res.json({
        success: true,
        message: 'Google login successful!',
        user: { name, email }
    });
});

// Start server - Bind to 0.0.0.0 for Render
app.listen(PORT, '0.0.0.0', () => {
    console.log(`========================================`);
    console.log(`🚀 GrowthPilot Backend Server Running!`);
    console.log(`========================================`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`✅ Health: http://0.0.0.0:${PORT}/api/health`);
    console.log(`========================================`);
});