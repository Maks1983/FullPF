"use strict";
/**
 * Authentication Routes
 * POST /api/v1/auth/login - User login
 * POST /api/v1/auth/refresh - Refresh access token
 * POST /api/v1/auth/logout - User logout
 */
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { config } = require('../config');
const db = require('../db');
const { authenticate } = require('../middleware/auth');
const { strictRateLimit } = require('../middleware/rateLimit');
const { createError } = require('../middleware/errorHandler');
const router = express.Router();
/**
 * POST /api/v1/auth/login
 * Authenticate user and return tokens
 */
router.post('/login', strictRateLimit, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw createError('Email and password are required', 400);
        }
        // Fetch user with license info
        const [userRows] = await db.query(`SELECT u.*, l.tier, l.status as license_status
       FROM users u
       LEFT JOIN licenses l ON u.license_id = l.license_id
       WHERE u.email = ? AND u.deleted_at IS NULL`, [email]);
        if (!Array.isArray(userRows) || userRows.length === 0) {
            throw createError('Invalid email or password', 401);
        }
        const user = userRows[0];
        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            // Log failed attempt
            await db.query(`INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, changes, ip_address)
         VALUES (?, ?, 'login_failed', 'user', ?, ?, ?)`, [uuidv4(), user.id, user.id, JSON.stringify({ reason: 'invalid_password' }), req.ip]);
            throw createError('Invalid email or password', 401);
        }
        // Check if email is verified (optional, based on your requirements)
        if (!user.email_verified) {
            throw createError('Please verify your email before logging in', 403);
        }
        // Generate tokens
        const accessToken = jwt.sign({
            userId: user.id,
            email: user.email,
            role: user.role,
            type: 'access',
        }, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpiresIn });
        const refreshToken = jwt.sign({
            userId: user.id,
            email: user.email,
            type: 'refresh',
        }, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn });
        // Calculate refresh token expiry
        const refreshExpiresAt = new Date();
        refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 30); // 30 days
        // Store refresh token in database
        await db.query(`INSERT INTO sessions (id, user_id, refresh_token, expires_at, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?)`, [uuidv4(), user.id, refreshToken, refreshExpiresAt, req.ip, req.get('user-agent') || null]);
        // Log successful login
        await db.query(`INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, changes, ip_address, user_agent)
       VALUES (?, ?, 'login', 'user', ?, ?, ?, ?)`, [uuidv4(), user.id, user.id, JSON.stringify({ success: true }), req.ip, req.get('user-agent') || null]);
        // Update last login
        await db.query('UPDATE users SET updated_at = NOW() WHERE id = ?', [user.id]);
        res.json({
            accessToken,
            refreshToken,
            expiresIn: 900, // 15 minutes in seconds
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
                tier: user.tier || 'free',
            },
        });
    }
    catch (error) {
        if (error.statusCode) {
            res.status(error.statusCode).json({
                error: error.message,
            });
        }
        else {
            console.error('Login error:', error);
            res.status(500).json({
                error: 'Login failed',
            });
        }
    }
});
/**
 * POST /api/v1/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw createError('Refresh token is required', 400);
        }
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
        if (decoded.type !== 'refresh') {
            throw createError('Invalid token type', 401);
        }
        // Verify refresh token exists in database and is not expired
        const [sessionRows] = await db.query(`SELECT * FROM sessions
       WHERE refresh_token = ? AND expires_at > NOW()`, [refreshToken]);
        if (!Array.isArray(sessionRows) || sessionRows.length === 0) {
            throw createError('Invalid or expired refresh token', 401);
        }
        // Fetch user with license info
        const [userRows] = await db.query(`SELECT u.id, u.email, u.role, l.tier
       FROM users u
       LEFT JOIN licenses l ON u.license_id = l.license_id
       WHERE u.id = ? AND u.deleted_at IS NULL`, [decoded.userId]);
        if (!Array.isArray(userRows) || userRows.length === 0) {
            throw createError('User not found', 401);
        }
        const user = userRows[0];
        // Generate new access token
        const accessToken = jwt.sign({
            userId: user.id,
            email: user.email,
            role: user.role,
            type: 'access',
        }, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpiresIn });
        res.json({
            accessToken,
            expiresIn: 900, // 15 minutes in seconds
        });
    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                error: 'Invalid or expired refresh token',
            });
        }
        else if (error.statusCode) {
            res.status(error.statusCode).json({
                error: error.message,
            });
        }
        else {
            console.error('Token refresh error:', error);
            res.status(500).json({
                error: 'Token refresh failed',
            });
        }
    }
});
/**
 * POST /api/v1/auth/logout
 * Invalidate refresh token
 */
router.post('/logout', authenticate, async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            // Delete refresh token from database
            await db.query('DELETE FROM sessions WHERE refresh_token = ?', [refreshToken]);
        }
        // Log logout
        if (req.user) {
            await db.query(`INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, changes, ip_address)
         VALUES (?, ?, 'logout', 'user', ?, ?, ?)`, [uuidv4(), req.user.id, req.user.id, JSON.stringify({ success: true }), req.ip]);
        }
        res.json({
            message: 'Logged out successfully',
        });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            error: 'Logout failed',
        });
    }
});
module.exports = router;
