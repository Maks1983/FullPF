"use strict";
/**
 * Global Error Handler
 * Centralized error handling middleware
 */
const { config } = require('../config');
function errorHandler(err, req, res, _next) {
    // Log error
    console.error('Error:', {
        message: err.message,
        stack: config.nodeEnv === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method,
    });
    // Default to 500 Internal Server Error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    // Send error response
    res.status(statusCode).json({
        error: err.name || 'Error',
        message,
        code: err.code,
        timestamp: new Date().toISOString(),
        path: req.path,
        ...(config.nodeEnv === 'development' && { stack: err.stack }),
    });
}
/**
 * Create an API error with status code
 */
function createError(message, statusCode = 500, code) {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.code = code;
    return error;
}
module.exports = {
    errorHandler,
    createError,
};
