/**
 * JWT Utilities for API Authentication
 *
 * Handles JWT token generation and verification for the mobile API.
 * Uses Supabase Auth tokens when possible, provides custom JWT for offline sync.
 */

import type { JwtPayload } from '../types';
import type { AuthUser } from '../../services/authService';

/**
 * Generate a JWT token for API access
 *
 * Note: In Supabase Edge Functions, we use Supabase's built-in JWT.
 * This is a placeholder for the structure. Actual implementation
 * will use Supabase's auth.getSession() tokens.
 */
export function generateAccessToken(user: AuthUser): string {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    tier: user.tier,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 15 * 60,
  };

  return btoa(JSON.stringify(payload));
}

/**
 * Verify and decode a JWT token
 *
 * Note: In Supabase Edge Functions, use supabase.auth.getUser(jwt)
 * This is a placeholder for the structure.
 */
export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    const payload = JSON.parse(atob(token));

    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = verifyAccessToken(token);
  if (!payload) return true;

  return payload.exp < Math.floor(Date.now() / 1000);
}

/**
 * Get token expiration time in seconds
 */
export function getTokenExpiration(token: string): number | null {
  const payload = verifyAccessToken(token);
  if (!payload) return null;

  return payload.exp - Math.floor(Date.now() / 1000);
}
