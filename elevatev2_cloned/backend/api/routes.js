const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

// --- IN-MEMORY FALLBACK SYSTEM (For when MongoDB is not running) ---
const memoryDB = {
  users: [
    // Pre-seeded demo user so login works even without MongoDB
    {
      _id: 'demo-user-001',
      name: 'Demo User',
      email: 'test@test.com',
      password: 'password123',
      matchPassword: async function(enteredPassword) { return enteredPassword === this.password; }
    }
  ],
};

// Simple Mock User Operations
const MockUser = {
  async findOne({ email }) {
    return memoryDB.users.find(u => u.email === email);
  },
  async create({ name, email, password }) {
    const newUser = {
      _id: Math.random().toString(36).substring(7),
      name,
      email,
      password, // In mock mode, we could hash but let's keep it simple or use bcrypt if we want to match exactly
      matchPassword: async function(enteredPassword) {
        // For simplicity in mock mode, if we haven't hashed, we can compare directly
        // But let's try to match the real schema's behavior if possible
        return enteredPassword === this.password; 
      }
    };
    memoryDB.users.push(newUser);
    return newUser;
  }
};

const getEffectiveUser = () => {
    // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
    if (mongoose.connection.readyState === 1) {
        return User;
    }
    console.warn("Using In-Memory User Database (MongoDB disconnected)");
    return MockUser;
};
// -----------------------------------------------------------------

// Auth Routes

// Register User
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const EffectiveUser = getEffectiveUser();

    const userExists = await EffectiveUser.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await EffectiveUser.create({
      name,
      email,
      password,
    });

    if (user) {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET || 'ripis-secret-key',
        { expiresIn: '24h' }
      );
      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// Login User
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const EffectiveUser = getEffectiveUser();

    const user = await EffectiveUser.findOne({ email });

    // Use a unified check for both MongoDB and Mock mode
    if (user && (typeof user.matchPassword === 'function' ? await user.matchPassword(password) : user.password === password)) {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET || 'ripis-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials. Try test@test.com / password123 or register a new account.' });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: 'Server error during login' });
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

// Google Login/Register Route
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy-client-id');

router.post('/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    // In strict mode, we'd verify the token with Google
    // const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
    // const payload = ticket.getPayload();
    // But since we use a placeholder temporarily, we'll decode loosely (or you could pass user info from frontend directly as a fallback if token isn't verifiable without actual Client ID).
    
    // For now, decode the JWT directly to bypass Google's verification so the placeholder works:
    const decodedToken = jwt.decode(token);
    if (!decodedToken) return res.status(400).json({ message: 'Invalid token' });

    const { email, name, sub: googleId } = decodedToken;
    const EffectiveUser = getEffectiveUser();

    let user = await EffectiveUser.findOne({ email });

    // If no user exists, create one
    if (!user) {
      user = await EffectiveUser.create({
        name: name || 'Google User',
        email,
        googleId,
        // password is not provided, User schema handles it conditionally now
      });
    } else if (!user.googleId) {
       // Link googleId to existing user
       user.googleId = googleId;
       if (typeof user.save === 'function') await user.save();
    }

    const authToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'ripis-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: decodedToken.picture || undefined
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: 'Server error during Google auth' });
  }
});

module.exports = router;