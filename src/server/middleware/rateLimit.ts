/**
 * Rate Limiting Middleware
 * Tier-based rate limiting for API endpoints
 */

import rateLimit from 'express-rate-limit';
import { Request } from 'express';
import { config } from '../config';
import { AuthRequest } from './auth';

/**
 * Dynamic rate limiter based on user's subscription tier
 */
export const tierBasedRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: async (req: Request) => {
    const authReq = req as AuthRequest;

    // If user is authenticated, use tier-based limit
    if (authReq.user && authReq.user.tier) {
      const tier = authReq.user.tier as keyof typeof config.rateLimit;
      return config.rateLimit[tier] || config.rateLimit.free;
    }

    // Unauthenticated requests get free tier limit
    return config.rateLimit.free;
  },
  message: async (req: Request) => {
    const authReq = req as AuthRequest;
    const tier = authReq.user?.tier || 'free';
    const limit = config.rateLimit[tier as keyof typeof config.rateLimit] || config.rateLimit.free;

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
  skip: (req: Request) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  },
});

/**
 * Strict rate limiter for sensitive operations (auth, password reset)
 */
export const strictRateLimit = rateLimit({
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
