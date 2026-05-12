// v3.0 - Email Fix - May 2026
// GrowthPilot Backend Server
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 10000;
const JWT_SECRET = process.env.JWT_SECRET || 'growthpilot_secret_2025';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory user storage
let users = [];

// Email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER || 'mandalatrinadh2005@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

// ============================================================
// ROUTES
// ============================================================

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'GrowthPilot API is running!', port: PORT, status: 'online' });
});

// API Health
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        users: users.length,
        emailConfigured: !!process.env.GMAIL_APP_PASSWORD
    });
});

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const existing = users.find(u => u.email === email);
        if (existing) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = {
            id: Date.now().toString(),
            name,
            email,
            password: hash,
            createdAt: new Date().toISOString()
        };
        users.push(user);

        const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ message: 'Registration successful', token, name: user.name });
    } catch (e) {
        console.error('Register error:', e);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ message: 'Login successful', token, name: user.name });
    } catch (e) {
        console.error('Login error:', e);
        res.status(500).json({ message: 'Server error' });
    }
});

// Google Login
app.post('/api/auth/google', async (req, res) => {
    try {
        const { email, name } = req.body;
        let user = users.find(u => u.email === email);
        if (!user) {
            user = {
                id: Date.now().toString(),
                name,
                email,
                password: 'google-oauth',
                createdAt: new Date().toISOString()
            };
            users.push(user);
        }
        const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ message: 'Google login successful', token, name: user.name });
    } catch (e) {
        console.error('Google login error:', e);
        res.status(500).json({ message: 'Server error' });
    }
});

// Forgot Password - SENDS REAL EMAIL
app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(404).json({ message: 'No account found with this email' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour

    const resetUrl = `https://growthpiolt-a24j.vercel.app/?resetToken=${resetToken}`;

    // Send email
    try {
        await transporter.sendMail({
            from: '"GrowthPilot" <mandalatrinadh2005@gmail.com>',
            to: email,
            subject: '🔑 Password Reset - GrowthPilot',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 30px; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">🚀 GrowthPilot</h1>
                    </div>
                    <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #1f2937;">Reset Your Password</h2>
                        <p style="color: #6b7280;">You requested a password reset for your GrowthPilot account.</p>
                        <p style="color: #6b7280;">Click the button below to reset your password:</p>
                        <a href="${resetUrl}" 
                           style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; 
                                  text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold;">
                            Reset Password
                        </a>
                        <p style="color: #9ca3af; font-size: 12px;">
                            This link expires in 1 hour.<br>
                            If you didn't request this, you can safely ignore this email.
                        </p>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                        <p style="color: #9ca3af; font-size: 11px;">
                            If the button doesn't work, copy and paste this link:<br>
                            ${resetUrl}
                        </p>
                    </div>
                </div>
            `
        });

        console.log(`✅ Reset email sent to ${email}`);
        res.json({ message: 'Reset link sent to your email' });
    } catch (emailError) {
        console.error('❌ Email send failed:', emailError.message);
        // Fallback: return the token so the user can still reset
        res.json({ 
            message: 'Reset link generated (email service unavailable)',
            resetToken: resetToken 
        });
    }
});

// Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const user = users.find(u =>
            u.resetToken === token &&
            u.resetTokenExpiry > Date.now()
        );

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        res.json({ message: 'Password reset successful' });
    } catch (e) {
        console.error('Reset password error:', e);
        res.status(500).json({ message: 'Server error' });
    }
});

// Save user data
app.post('/api/user/data', (req, res) => {
    res.json({ message: 'Data saved' });
});

// Get user data
app.get('/api/user/data', (req, res) => {
    res.json({ message: 'Use localStorage for app data' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(40));
    console.log('🚀 GrowthPilot Backend Server Running!');
    console.log('='.repeat(40));
    console.log(`📍 Port: ${PORT}`);
    console.log(`✅ Health: http://0.0.0.0:${PORT}/api/health`);
    console.log(`📧 Email: ${process.env.GMAIL_APP_PASSWORD ? 'CONFIGURED ✅' : 'NOT CONFIGURED ❌'}`);
    console.log('='.repeat(40));
});