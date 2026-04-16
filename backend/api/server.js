const { setServers } = require('node:dns/promises');
try {
  setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.warn('DNS server override failed, continuing with defaults:', e.message);
}

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');
const practiceRoutes = require('./practiceRoutes');
const connectDB = require('../config/db');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);
app.use('/', practiceRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'RIPIS Backend is running' });
});

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  socket.on('start-session', () => {
    console.log('🎯 Session started for:', socket.id);
    // Initialize screen capture and audio capture
    require('../services/screenCapture').startCapture(socket);
    require('../services/audioCapture').startCapture(socket);
  });

  socket.on('stop-session', () => {
    console.log('⏹️ Session stopped for:', socket.id);
    require('../services/screenCapture').stopCapture();
    require('../services/audioCapture').stopCapture();
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 RIPIS Backend running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready`);
});

module.exports = { app, io };