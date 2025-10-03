/**
 * Rate Limiting Middleware
 * Tier-based rate limiting for API endpoints
 */

const rateLimit = require('express-rate-limit');
const { config } = require('../config');

/**
 * Dynamic rate limiter based on user's subscription tier
 */
const tierBasedRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: async (req) => {
    const authReq = req;

    // If user is authenticated, use tier-based limit
    if (authReq.user && authReq.user.tier) {
      const tier = authReq.user.tier;
      return config.rateLimit[tier] || config.rateLimit.free;
    }

    // Unauthenticated requests get free tier limit
    return config.rateLimit.free;
  },
  message: async (req) => {
    const authReq = req;
    const tier = authReq.user?.tier || 'free';
    const limit = config.rateLimit[tier] || config.rateLimit.free;

    return {
      error: 'Rate Limit Exceeded',
      message: `Too many requests. Your ${tier} tier allows ${limit} requests per minute.`,
      tier,
      limit,
      retryAfter: 60,
    };
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  },
});

/**
 * Strict rate limiter for sensitive operations (auth, password reset)
 */
const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: {
    error: 'Rate Limit Exceeded',
    message: 'Too many attempts. Please try again later.',
    retryAfter: 900, // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  tierBasedRateLimit,
  strictRateLimit,
};
