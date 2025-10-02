import 'dotenv/config';

const numberFromEnv = (key: string, fallback: number): number => {
  const raw = process.env[key];
  if (!raw) return fallback;
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
};

const stringFromEnv = (key: string, fallback: string): string => {
  const raw = process.env[key];
  return raw && raw.length > 0 ? raw : fallback;
};

export const config = {
  env: stringFromEnv('NODE_ENV', 'development'),
  port: numberFromEnv('PORT', 4000),
  apiVersion: stringFromEnv('API_VERSION', 'v1'),
  jwtSecret: stringFromEnv('JWT_SECRET', 'dev-secret-change-me'),
  jwtExpiresIn: stringFromEnv('JWT_EXPIRES_IN', '15m'),
  refreshTokenExpiresInDays: numberFromEnv('REFRESH_TOKEN_EXPIRES', 30),
  corsOrigin: stringFromEnv('CORS_ORIGIN', 'http://localhost:5173'),
  frontendUrl: stringFromEnv('FRONTEND_URL', 'http://localhost:5173'),
  emailFrom: stringFromEnv('EMAIL_FROM', 'noreply@owncent.demo'),
  smtpHost: stringFromEnv('SMTP_HOST', 'smtp.ethereal.email'),
  smtpPort: numberFromEnv('SMTP_PORT', 587),
  smtpSecure: stringFromEnv('SMTP_SECURE', 'false') === 'true',
  smtpUser: stringFromEnv('SMTP_USER', 'ethereal.user@ethereal.email'),
  smtpPassword: stringFromEnv('SMTP_PASSWORD', 'ethereal.pass'),
  maxTenantsPerInstance: numberFromEnv('MAX_TENANTS', 10),
  tenantIdMinLength: numberFromEnv('TENANT_ID_MIN_LENGTH', 3),
  tenantIdMaxLength: numberFromEnv('TENANT_ID_MAX_LENGTH', 50),
};
