/**
 * Rate Limiting Utilities
 *
 * Implements rate limiting per user tier with in-memory tracking.
 * For production, consider using Supabase Edge Functions rate limiting
 * or a distributed cache like Redis.
 */

import type { UserTier } from '../types';
import { RATE_LIMITS } from '../types';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 1000;

/**
 * Clean up expired rate limit entries
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}

setInterval(cleanupExpiredEntries, 60 * 1000);

/**
 * Check if user has exceeded rate limit
 */
export function checkRateLimit(userId: string, tier: UserTier): {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: Date;
} {
  const now = Date.now();
  const key = `ratelimit:${userId}`;
  const limit = RATE_LIMITS[tier];

  let entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: now + WINDOW_MS,
    };
    rateLimitStore.set(key, entry);
  }

  entry.count++;

  const allowed = entry.count <= limit;
  const remaining = Math.max(0, limit - entry.count);

  return {
    allowed,
    limit,
    remaining,
    resetAt: new Date(entry.resetAt),
  };
}

/**
 * Get current rate limit status without incrementing
 */
export function getRateLimitStatus(userId: string, tier: UserTier): {
  limit: number;
  remaining: number;
  resetAt: Date;
} {
  const now = Date.now();
  const key = `ratelimit:${userId}`;
  const limit = RATE_LIMITS[tier];

  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt < now) {
    return {
      limit,
      remaining: limit,
      resetAt: new Date(now + WINDOW_MS),
    };
  }

  return {
    limit,
    remaining: Math.max(0, limit - entry.count),
    resetAt: new Date(entry.resetAt),
  };
}

/**
 * Reset rate limit for a user (admin function)
 */
export function resetRateLimit(userId: string): void {
  const key = `ratelimit:${userId}`;
  rateLimitStore.delete(key);
}

/**
 * Get all rate limit entries (for monitoring)
 */
export function getAllRateLimits(): Map<string, RateLimitEntry> {
  return new Map(rateLimitStore);
}
