const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Auth Routes

// In-memory fallback for offline usage
const memoryUsers = [];

// Register User
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Try DB first
    try {
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ message: 'User already exists' });
      
      const user = await User.create({ name, email, password });
      
      if (user) {
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET || 'ripis-secret-key',
          { expiresIn: '24h' }
        );
        return res.status(201).json({
          success: true,
          token,
          user: { id: user._id, name: user.name, email: user.email }
        });
      }
    } catch (dbError) {
      // Fallback if DB error (e.g. disconnected)
      console.log("DB unavailable, falling back to memory for register:", dbError.message);
      
      const existingMemoryUser = memoryUsers.find(u => u.email === email);
      if (existingMemoryUser) return res.status(400).json({ message: 'User already exists (offline)' });
      
      const newUser = { _id: Date.now().toString(), name, email, password }; 
      // Note: passwords should be hashed, but for offline mock this is fine
      memoryUsers.push(newUser);
      
      const token = jwt.sign(
        { id: newUser._id, email: newUser.email },
        process.env.JWT_SECRET || 'ripis-secret-key',
        { expiresIn: '24h' }
      );
      
      return res.status(201).json({
        success: true,
        token,
        user: { id: newUser._id, name: newUser.name, email: newUser.email }
      });
    }

    res.status(400).json({ message: 'Invalid user data' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login User
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (user && (await user.matchPassword(password))) {
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET || 'ripis-secret-key',
          { expiresIn: '24h' }
        );

        return res.json({
          success: true, token,
          user: { id: user._id, name: user.name, email: user.email }
        });
      } else if (user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (dbError) {
       console.log("DB unavailable, falling back to memory for login:", dbError.message);
       // continue to memory auth
    }

    // Check memory fallback
    const memUser = memoryUsers.find(u => u.email === email && u.password === password);
    if (memUser) {
      const token = jwt.sign(
        { id: memUser._id, email: memUser.email },
        process.env.JWT_SECRET || 'ripis-secret-key',
        { expiresIn: '24h' }
      );
      return res.json({
        success: true, token,
        user: { id: memUser._id, name: memUser.name, email: memUser.email }
      });
    }

    res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get User Profile
router.get('/user/profile', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Get Session Stats
router.get('/sessions/stats', authenticateToken, (req, res) => {
  res.json({
    totalSessions: 12,
    averageScore: 87,
    totalTime: '24h 36m',
    improvement: '+15%'
  });
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'ripis-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

module.exports = router;