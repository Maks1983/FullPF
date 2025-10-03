"use strict";
/**
 * Request Logger Middleware
 * Logs incoming requests for monitoring and debugging
 */
const { config } = require('../config');
function requestLogger(req, res, next) {
    const start = Date.now();
    // Log request
    if (config.logLevel === 'debug') {
        console.log(`→ ${req.method} ${req.path}`, {
            query: req.query,
            ip: req.ip,
        });
    }
    // Log response on finish
    res.on('finish', () => {
        const duration = Date.now() - start;
        const level = res.statusCode >= 400 ? 'error' : 'info';
        if (config.logLevel === 'debug' || level === 'error') {
            console.log(`← ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
        }
    });
    next();
}
module.exports = {
    requestLogger,
};
