/**
 * Server Configuration
 * Centralized configuration loaded from environment variables
 */

import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173').split(','),

  // Database
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'owncent_app',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'owncent',
    connectionLimit: parseInt(process.env.DB_POOL_MAX || '10', 10),
  },

  // JWT
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'change-this-in-production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'change-this-refresh-secret',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  // Rate Limiting (requests per minute by tier)
  rateLimit: {
    free: parseInt(process.env.RATE_LIMIT_FREE || '30', 10),
    advanced: parseInt(process.env.RATE_LIMIT_ADVANCED || '90', 10),
    premium: parseInt(process.env.RATE_LIMIT_PREMIUM || '180', 10),
    family: parseInt(process.env.RATE_LIMIT_FAMILY || '180', 10),
  },

  // Security
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
  lockoutDuration: parseInt(process.env.LOCKOUT_DURATION || '900', 10), // 15 minutes in seconds

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
} as const;

// Validate critical configuration
if (config.nodeEnv === 'production') {
  if (config.jwt.accessSecret === 'change-this-in-production') {
    throw new Error('JWT_ACCESS_SECRET must be set in production');
  }
  if (config.jwt.refreshSecret === 'change-this-refresh-secret') {
    throw new Error('JWT_REFRESH_SECRET must be set in production');
  }
  if (!config.db.password) {
    throw new Error('DB_PASSWORD must be set in production');
  }
}
