const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { authenticateUser } = require('./middleware/authenticate');
const { initializeFirebase, getDb } = require('./config/firebase');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandlers');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

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

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;