"use strict";
/**
 * Authentication Middleware
 * JWT verification and user authentication
 */
const jwt = require('jsonwebtoken');
const { config } = require('../config');
const db = require('../db');
/**
 * Verify JWT access token and attach user to request
 */
async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Missing or invalid authorization header',
            });
            return;
        }
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        // Verify access token
        const decoded = jwt.verify(token, config.jwt.accessSecret);
        if (decoded.type !== 'access') {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid token type',
            });
            return;
        }
        // Fetch user and license info
        const [rows] = await db.query(`SELECT u.id, u.email, u.role, l.tier
       FROM users u
       LEFT JOIN licenses l ON u.license_id = l.license_id
       WHERE u.id = ? AND u.deleted_at IS NULL`, [decoded.userId]);
        if (!Array.isArray(rows) || rows.length === 0) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'User not found or deleted',
            });
            return;
        }
        const user = rows[0];
        // Attach user to request
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            tier: user.tier || 'free',
        };
        next();
    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid token',
            });
            return;
        }
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Token expired',
            });
            return;
        }
        console.error('Authentication error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Authentication failed',
        });
    }
}
/**
 * Require specific role(s)
 */
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Authentication required',
            });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                error: 'Forbidden',
                message: 'Insufficient permissions',
            });
            return;
        }
        next();
    };
}
/**
 * Require specific license tier(s)
 */
function requireTier(...allowedTiers) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Authentication required',
            });
            return;
        }
        if (!allowedTiers.includes(req.user.tier)) {
            res.status(403).json({
                error: 'Forbidden',
                message: 'This feature requires a higher subscription tier',
                requiredTier: allowedTiers,
                currentTier: req.user.tier,
            });
            return;
        }
        next();
    };
}
module.exports = {
    authenticate,
    requireRole,
    requireTier,
};
