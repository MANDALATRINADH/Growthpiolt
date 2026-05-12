// api/verify-payment.js
const crypto = require('crypto');

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
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ 
                success: false,
                error: 'Missing required fields' 
            });
        }
        
        const secret = process.env.RAZORPAY_KEY_SECRET || 'I2BisKMMi4CB9je5lGsRhHOo';
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body)
            .digest('hex');
        
        const isValid = expectedSignature === razorpay_signature;
        
        if (isValid) {
            res.status(200).json({ 
                success: true, 
                message: 'Payment verified successfully',
                payment_id: razorpay_payment_id,
                order_id: razorpay_order_id
            });
        } else {
            res.status(400).json({ 
                success: false, 
                error: 'Invalid payment signature' 
            });
        }
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
}