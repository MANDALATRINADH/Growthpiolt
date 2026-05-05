const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5001;
const JWT_SECRET = 'your_secret_key_here';

// Simple in-memory database
const users = new Map();

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running!', success: true });
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    console.log('Register attempt:', email);
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields required' });
    }
    
    if (users.has(email)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: Date.now().toString(),
      email,
      name,
      password: hashedPassword,
      appData: {
        notes: [],
        journals: [],
        habits: [],
        schedule: [],
        streak: 0
      }
    };
    
    users.set(email, user);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    
    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email);
    
    const user = users.get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    
    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save data endpoint
app.post('/api/user/save-data', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { appData } = req.body;
    
    for (let [email, user] of users) {
      if (user.id === decoded.userId) {
        user.appData = appData;
        users.set(email, user);
        break;
      }
    }
    res.json({ success: true });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Load data endpoint
app.get('/api/user/load-data', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    for (let [email, user] of users) {
      if (user.id === decoded.userId) {
        return res.json({ appData: user.appData });
      }
    }
    res.status(404).json({ error: 'User not found' });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 Test: http://localhost:${PORT}/api/test\n`);
});