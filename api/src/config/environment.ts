import dotenv from 'dotenv';

dotenv.config();

const getEnvVar = (name: string, defaultValue?: string): string => {
  const value = process.env[name];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value || defaultValue!;
};

const getEnvNumber = (name: string, defaultValue: number): number => {
  const value = process.env[name];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be a number`);
  }
  return parsed;
};

const getEnvBoolean = (name: string, defaultValue: boolean): boolean => {
  const value = process.env[name];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
};

export const config = {
  env: getEnvVar('NODE_ENV', 'development'),
  
  server: {
    port: getEnvNumber('PORT', 3001),
  },

  database: {
    url: getEnvVar('DATABASE_URL', 'postgresql://localhost:5432/personal_finance'),
    poolMin: getEnvNumber('DATABASE_POOL_MIN', 2),
    poolMax: getEnvNumber('DATABASE_POOL_MAX', 10),
  },

  jwt: {
    secret: getEnvVar('JWT_SECRET', 'supersecretjwtkey-dev-only-change-in-production'),
    expiresIn: getEnvVar('JWT_EXPIRES_IN', '15m'),
    refreshExpiresIn: getEnvVar('REFRESH_TOKEN_EXPIRES_IN', '7d'),
  },

  cors: {
    allowedOrigins: getEnvVar('ALLOWED_ORIGINS', 'http://localhost:5173').split(','),
  },

  rateLimit: {
    windowMs: getEnvNumber('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000), // 15 minutes
    maxRequests: getEnvNumber('RATE_LIMIT_MAX_REQUESTS', 100),
  },

  security: {
    bcryptRounds: getEnvNumber('BCRYPT_ROUNDS', 12),
    sessionSecret: getEnvVar('SESSION_SECRET', 'dev-session-secret-change-in-production'),
  },

  email: {
    host: getEnvVar('SMTP_HOST', ''),
    port: getEnvNumber('SMTP_PORT', 587),
    secure: getEnvBoolean('SMTP_SECURE', false),
    user: getEnvVar('SMTP_USER', ''),
    password: getEnvVar('SMTP_PASS', ''),
  },

  logging: {
    level: getEnvVar('LOG_LEVEL', 'info'),
    format: getEnvVar('LOG_FORMAT', 'combined'),
  },

  features: {
    bankIntegration: getEnvBoolean('ENABLE_BANK_INTEGRATION', false),
    premiumFeatures: getEnvBoolean('ENABLE_PREMIUM_FEATURES', true),
    analytics: getEnvBoolean('ENABLE_ANALYTICS', false),
  },
};