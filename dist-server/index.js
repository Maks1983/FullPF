"use strict";
/**
 * OwnCent Unified Server
 * Serves both the React frontend and API endpoints
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { config } = require('./config');
const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/logger');
// Import routes
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/accounts');
const transactionRoutes = require('./routes/transactions');
const userRoutes = require('./routes/user');
const syncRoutes = require('./routes/sync');
const app = express();
// Security middleware with CSP for serving frontend
app.use(helmet({
    contentSecurityPolicy: false, // Allow inline scripts for Vite
}));
app.use(cors({
    origin: config.corsOrigins,
    credentials: true,
}));
// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Request logging
app.use(requestLogger);
// Global rate limiting (fallback)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(globalLimiter);
// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.nodeEnv,
    });
});
// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/accounts', accountRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/sync', syncRoutes);
// Serve static files from the React frontend build
const distPath = path.join(__dirname, '../../dist');
app.use(express.static(distPath));
// Serve index.html for all non-API routes (SPA fallback)
app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({
            error: 'Not Found',
            message: `Route ${req.method} ${req.path} not found`,
            timestamp: new Date().toISOString(),
        });
    }
    res.sendFile(path.join(distPath, 'index.html'));
});
// Error handling middleware (must be last)
app.use(errorHandler);
// Start server
const PORT = config.port;
app.listen(PORT, () => {
    console.log(`🚀 OwnCent Server running on port ${PORT}`);
    console.log(`📝 Environment: ${config.nodeEnv}`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
    console.log(`🔌 API: http://localhost:${PORT}/api/v1`);
    console.log(`🔒 CORS origins: ${config.corsOrigins.join(', ')}`);
    console.log(`📊 Database: ${config.db.host}:${config.db.port}/${config.db.database}`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    process.exit(0);
});
