const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const { initializeFirebase } = require('./config/firebase');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandlers');
const logger = require('./utils/logger');

const app = express();
const server = http.createServer(app);

// Socket.io mit CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Initialize Firebase
initializeFirebase();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(logger.requestLogger);

// Routes
app.use('/api', routes);

// Socket.io Events für Aktivitäten
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  // User betritt Aktivitäts-Raum
  socket.on('join-activity', (activityId) => {
    socket.join(`activity:${activityId}`);
    console.log(`📍 User ${socket.id} joined activity:${activityId}`);
    
    // Sende Info an alle anderen im Raum
    socket.to(`activity:${activityId}`).emit('user-joined', {
      userId: socket.id,
      timestamp: new Date().toISOString()
    });

    // Sende aktuelle User-Anzahl zurück
    const room = io.sockets.adapter.rooms.get(`activity:${activityId}`);
    const userCount = room ? room.size : 0;
    io.to(`activity:${activityId}`).emit('user-count', userCount);
  });

  // Feld-Update
  socket.on('activity-field-update', (data) => {
    const { activityId, field, value, section } = data;
    
    // Sende an alle ANDEREN im Raum (nicht an Sender selbst)
    socket.to(`activity:${activityId}`).emit('activity-field-changed', {
      field,
      value,
      section, // für programSections/materials
      userId: socket.id,
      timestamp: new Date().toISOString()
    });
    
    console.log(`🔄 Field update in activity:${activityId} - ${field}`);
  });

  // User verlässt Aktivität
  socket.on('leave-activity', (activityId) => {
    socket.leave(`activity:${activityId}`);
    socket.to(`activity:${activityId}`).emit('user-left', {
      userId: socket.id
    });
    
    // Update User-Count
    const room = io.sockets.adapter.rooms.get(`activity:${activityId}`);
    const userCount = room ? room.size : 0;
    io.to(`activity:${activityId}`).emit('user-count', userCount);
    
    console.log(`👋 User ${socket.id} left activity:${activityId}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server mit Socket.io
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔌 Socket.io ready`);
});

module.exports = app;
