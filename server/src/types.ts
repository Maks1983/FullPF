export type UserRole = 'owner' | 'manager' | 'user' | 'family' | 'readonly';
export type LicenseTier = 'free' | 'advanced' | 'premium' | 'family';

export interface UserRecord {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: UserRole;
  tier: LicenseTier;
  isPremium: boolean;
  phone: string;
  passwordHash: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  failedLoginAttempts: number;
  lockedUntil?: string;
  lastLoginAt?: string;
  loginNotifications?: boolean;
  passwordResetTokens?: string[];
  emailVerificationTokens?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FeatureFlagRecord {
  key: FeatureFlagKey;
  description: string;
  value: boolean;
  overridableBy: UserRole[];
  lastChangedAt: string;
  overriddenByUserId?: string;
  notes?: string;
}

export type FeatureFlagKey =
  | 'debt_optimizer_enabled'
  | 'strategy_simulator_enabled'
  | 'bank_api_enabled'
  | 'family_features_enabled'
  | 'reports_enabled';

export interface LicenseState {
  licenseId: string;
  tier: LicenseTier;
  status: 'valid' | 'expiring' | 'expired';
  expiresAt: string;
  lastValidatedAt: string;
  overrideActive: boolean;
  overrideTier?: LicenseTier;
  features: Record<string, boolean>;
}

export interface ConfigItem {
  key: string;
  value: string;
  encrypted: boolean;
  masked: boolean;
  description: string;
  lastUpdatedAt: string | null;
  lastUpdatedByUserId: string | null;
  requiresStepUp: boolean;
}

export interface MonitoringSnapshot {
  lastUpdatedAt: string;
  dbConnection: 'healthy' | 'degraded' | 'down';
  smtpStatus: 'ok' | 'warning' | 'error';
  uptimeSeconds: number;
  cpuUtilization: number;
  memoryUtilization: number;
  queueBacklog: number;
}

export interface InfrastructureStatus {
  lastBackupAt: string | null;
  lastBackupMode: 'manual' | 'scheduled' | null;
  lastRestoreAt: string | null;
  lastRestoreDryRunAt: string | null;
  deletionScheduledFor: string | null;
}

export interface AuditLogEntry {
  id: string;
  actorUserId: string;
  actorUsername: string;
  actorDisplayName: string;
  impersonatedUserId?: string | null;
  impersonatedUsername?: string | null;
  impersonatedDisplayName?: string | null;
  action: string;
  targetEntity: string;
  metadata: Record<string, unknown>;
  immutable: boolean;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
}

export interface SessionClaims {
  sub: string;
  role: UserRole;
  tier: LicenseTier;
  customerId: string;
  featureFlags: FeatureFlagKey[];
  impersonatingUserId?: string;
}

export interface RefreshTokenRecord {
  id: string;
  tenantId: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
  revokedAt?: string;
  replacedByTokenId?: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface StepUpEvent {
  id: string;
  userId: string;
  action: string;
  verifiedAt: string;
  success: boolean;
  metadata?: Record<string, unknown>;
}

export interface ImpersonationRecord {
  id: string;
  actorUserId: string;
  targetUserId: string;
  reason?: string;
  startedAt: string;
  endedAt?: string;
}

export interface AppState {
  users: UserRecord[];
  featureFlags: Record<FeatureFlagKey, FeatureFlagRecord>;
  license: LicenseState;
  configItems: ConfigItem[];
  monitoring: MonitoringSnapshot;
  infrastructure: InfrastructureStatus;
  auditLogs: AuditLogEntry[];
  refreshTokens: RefreshTokenRecord[];
  stepUpEvents: StepUpEvent[];
  impersonations: ImpersonationRecord[];
  bankConnections: BankConnectionRecord[];
  bankTokens: BankTokenRecord[];
}


export interface BankConnectionRecord {
  id: string;
  tenantId: string;
  userId: string;
  provider: 'demo' | 'teller' | 'plaid' | 'finicity' | 'basiq' | 'other';
  institutionId: string;
  institutionName: string;
  status: 'pending' | 'active' | 'error' | 'revoked';
  connectionLabel?: string;
  failureReason?: string;
  lastSyncedAt?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface BankTokenRecord {
  id: string;
  tenantId: string;
  connectionId: string;
  scope: string[];
  expiresAt: string;
  createdAt: string;
  rotatedAt?: string;
  revokedAt?: string;
  secretFragment: string;
  metadata?: Record<string, unknown>;
}


