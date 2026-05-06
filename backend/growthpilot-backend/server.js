const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// CORS - Allow all origins for Render
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'GrowthPilot API is running!',
        status: 'online',
        port: process.env.PORT,
        endpoints: {
            health: '/api/health',
            register: '/api/auth/register',
            login: '/api/auth/login'
        }
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'GrowthPilot API is running!',
        timestamp: new Date().toISOString(),
        port: process.env.PORT
    });
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        res.json({
            success: true,
            message: 'Registration successful!',
            user: { name, email }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }
        
        res.json({
            success: true,
            message: 'Login successful!',
            user: { email, name: 'Demo User' }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Google login
app.post('/api/auth/google', async (req, res) => {
    try {
        const { name, email } = req.body;
        res.json({
            success: true,
            message: 'Google login successful!',
            user: { name, email }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Use PORT from Render, default to 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`========================================`);
    console.log(`🚀 GrowthPilot Backend Server Running!`);
    console.log(`========================================`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`✅ Health: http://0.0.0.0:${PORT}/api/health`);
    console.log(`========================================`);
});