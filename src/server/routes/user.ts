/**
 * User Routes
 * GET /api/v1/user - Get user profile
 */

const express = require('express');
const { authenticate } = require('../middleware/auth');
const { tierBasedRateLimit } = require('../middleware/rateLimit');
const db = require('../db');

const router = express.Router();

// All routes require authentication
router.use(authenticate);
router.use(tierBasedRateLimit);

/**
 * GET /api/v1/user
 * Get authenticated user's profile
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user!.id;

    const [rows] = await db.query(
      `SELECT
        u.id,
        u.email,
        u.first_name as firstName,
        u.last_name as lastName,
        u.phone,
        u.role,
        u.timezone,
        u.locale,
        u.currency,
        u.email_verified as emailVerified,
        u.mfa_enabled as mfaEnabled,
        u.profile_picture_url as profilePictureUrl,
        u.preferences,
        u.created_at as createdAt,
        u.updated_at as updatedAt,
        l.tier,
        l.status as licenseStatus,
        l.expires_at as licenseExpiresAt,
        l.features
      FROM users u
      LEFT JOIN licenses l ON u.license_id = l.license_id
      WHERE u.id = ? AND u.deleted_at IS NULL`,
      [userId]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(404).json({
        error: 'User not found',
      });
      return;
    }

    const user = rows[0] as any;

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      timezone: user.timezone,
      locale: user.locale,
      currency: user.currency,
      emailVerified: Boolean(user.emailVerified),
      mfaEnabled: Boolean(user.mfaEnabled),
      profilePictureUrl: user.profilePictureUrl,
      preferences: user.preferences ? JSON.parse(user.preferences) : {},
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      license: {
        tier: user.tier || 'free',
        status: user.licenseStatus || 'valid',
        expiresAt: user.licenseExpiresAt,
        features: user.features ? JSON.parse(user.features) : {},
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to fetch user profile',
    });
  }
});

module.exports = router;
