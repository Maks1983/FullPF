/**
 * API Types for Offline Expense App
 *
 * Type-safe interfaces for all API requests and responses.
 * These types ensure consistency between the mobile app and backend.
 */

import type { Database } from '../lib/supabase';

type UserRole = Database['public']['Tables']['users']['Row']['role'];
type UserTier = Database['public']['Tables']['users']['Row']['tier'];
type AccountType = Database['public']['Tables']['accounts']['Row']['type'];
type TransactionType = Database['public']['Tables']['transactions']['Row']['type'];

/**
 * Authentication Types
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: ApiUser;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  accessToken: string;
  expiresIn: number;
}

/**
 * User Types
 */
export interface ApiUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: UserRole;
  tier: UserTier;
  isPremium: boolean;
}

export interface UserInfoResponse {
  success: boolean;
  user: ApiUser;
  rateLimit: RateLimitInfo;
}

/**
 * Account Types
 */
export interface ApiAccount {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  institution: string;
  isActive: boolean;
}

export interface AccountsRequest {
  includeInactive?: boolean;
  excludeBankLinked?: boolean;
}

export interface AccountsResponse {
  success: boolean;
  accounts: ApiAccount[];
  timestamp: string;
}

/**
 * Transaction Types
 */
export interface ApiTransaction {
  accountId: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: TransactionType;
  notes?: string;
  clientId?: string;
}

export interface BatchTransactionsRequest {
  transactions: ApiTransaction[];
}

export interface TransactionResult {
  clientId?: string;
  id?: string;
  success: boolean;
  error?: string;
}

export interface BatchTransactionsResponse {
  success: boolean;
  results: TransactionResult[];
  processed: number;
  failed: number;
  timestamp: string;
}

/**
 * Sync Status Types
 */
export interface SyncStatusRequest {
  lastSyncTimestamp?: string;
}

export interface SyncStatusResponse {
  success: boolean;
  lastSyncTimestamp: string;
  pendingCount: number;
  serverTime: string;
  needsFullSync: boolean;
}

/**
 * Rate Limit Types
 */
export interface RateLimitInfo {
  tier: UserTier;
  requestsPerMinute: number;
  requestsRemaining: number;
  resetAt: string;
}

/**
 * Error Types
 */
export interface ApiError {
  success: false;
  error: string;
  code: string;
  details?: Record<string, unknown>;
}

export type ApiResponse<T> = T | ApiError;

/**
 * JWT Payload
 */
export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  tier: UserTier;
  iat: number;
  exp: number;
}

/**
 * Rate Limit Configuration per Tier
 */
export const RATE_LIMITS: Record<UserTier, number> = {
  free: 30,
  advanced: 60,
  premium: 120,
  family: 180,
};

/**
 * API Configuration
 */
export interface ApiConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  refreshTokenExpiresIn: string;
  maxBatchSize: number;
  enableRateLimiting: boolean;
}

/**
 * Type guards
 */
export function isApiError(response: unknown): response is ApiError {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    response.success === false &&
    'error' in response
  );
}

export function isLoginResponse(response: unknown): response is LoginResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    response.success === true &&
    'accessToken' in response
  );
}
