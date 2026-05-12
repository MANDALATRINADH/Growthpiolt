// api/create-order.js
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_Sli38TkEX0wcaC',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'I2BisKMMi4CB9je5lGsRhHOo'
});

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { amount, currency = 'INR', receipt } = req.body;
        
        if (!amount || amount < 100) {
            return res.status(400).json({ error: 'Amount must be at least ₹1 (100 paise)' });
        }
        
        const options = {
            amount: amount,
            currency: currency,
            receipt: receipt || `receipt_${Date.now()}`,
            payment_capture: 1
        };
        
        const order = await razorpay.orders.create(options);
        
        res.status(200).json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        console.error('Razorpay order error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message || 'Failed to create order'
        });
    }
}