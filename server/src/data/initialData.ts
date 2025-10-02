import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import type {
  AppState,
  BankConnectionRecord,
  BankTokenRecord,
  ConfigItem,
  FeatureFlagKey,
  FeatureFlagRecord,
  InfrastructureStatus,
  LicenseState,
  MonitoringSnapshot,
  UserRecord,
} from '../types';
const saltRounds = 10;

type SeedUser = Omit<
  UserRecord,
  | 'id'
  | 'passwordHash'
  | 'twoFactorEnabled'
  | 'emailVerified'
  | 'phoneVerified'
  | 'failedLoginAttempts'
  | 'createdAt'
  | 'updatedAt'
> & {
  id?: string;
  password: string;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
};

const makeUser = (seed: SeedUser): UserRecord => {
  const user: UserRecord = {
    id: seed.id ?? uuid(),
    username: seed.username,
    displayName: seed.displayName,
    email: seed.email,
    role: seed.role,
    tier: seed.tier,
    isPremium: seed.isPremium,
    phone: seed.phone,
    passwordHash: bcrypt.hashSync(seed.password, saltRounds),
    twoFactorEnabled: seed.twoFactorEnabled ?? false,
    emailVerified: seed.emailVerified ?? true,
    phoneVerified: seed.phoneVerified ?? true,
    failedLoginAttempts: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (seed.twoFactorSecret) {
    user.twoFactorSecret = seed.twoFactorSecret;
  }

  return user;
};

const baseFeatureFlags: Record<FeatureFlagKey, FeatureFlagRecord> = {
  debt_optimizer_enabled: {
    key: 'debt_optimizer_enabled',
    description: 'Enable the premium debt optimization module.',
    value: false,
    overridableBy: ['owner'],
    lastChangedAt: '2025-09-01T10:15:00.000Z',
  },
  strategy_simulator_enabled: {
    key: 'strategy_simulator_enabled',
    description: 'Enable what-if strategy simulator.',
    value: false,
    overridableBy: ['owner'],
    lastChangedAt: '2025-09-01T10:15:00.000Z',
  },
  bank_api_enabled: {
    key: 'bank_api_enabled',
    description: 'Allow direct bank data aggregation via partner API.',
    value: false,
    overridableBy: ['owner'],
    lastChangedAt: '2025-09-05T08:20:00.000Z',
  },
  family_features_enabled: {
    key: 'family_features_enabled',
    description: 'Unlock multi-user household planning features.',
    value: true,
    overridableBy: ['owner'],
    lastChangedAt: '2025-09-02T07:30:00.000Z',
  },
  reports_enabled: {
    key: 'reports_enabled',
    description: 'Enable premium reporting engine.',
    value: false,
    overridableBy: ['owner'],
    lastChangedAt: '2025-09-03T16:05:00.000Z',
  },
};

const buildFeatureFlags = (
  overrides?: Partial<Record<FeatureFlagKey, Partial<FeatureFlagRecord>>>,
): Record<FeatureFlagKey, FeatureFlagRecord> => {
  const flags = Object.entries(baseFeatureFlags).reduce(
    (acc, [key, value]) => {
      acc[key as FeatureFlagKey] = { ...value };
      return acc;
    },
    {} as Record<FeatureFlagKey, FeatureFlagRecord>,
  );

  if (overrides) {
    Object.entries(overrides).forEach(([key, value]) => {
      const flagKey = key as FeatureFlagKey;
      if (!flags[flagKey]) {
        return;
      }
      flags[flagKey] = {
        ...flags[flagKey],
        ...value,
        lastChangedAt: value?.lastChangedAt ?? flags[flagKey].lastChangedAt,
      };
    });
  }

  return flags;
};

const baseLicense: LicenseState = {
  licenseId: 'unassigned',
  tier: 'free',
  status: 'expired',
  expiresAt: '1970-01-01T00:00:00.000Z',
  lastValidatedAt: '1970-01-01T00:00:00.000Z',
  overrideActive: false,
  overrideTier: undefined,
  features: {
    debt_optimizer: false,
    strategy_simulator: false,
    bank_api: false,
    family_accounts: false,
    detailed_reports: false,
  },
};

const buildLicense = (
  overrides?: Partial<LicenseState> & {
    features?: Partial<LicenseState['features']>;
  },
): LicenseState => {
  const { features, ...rest } = overrides ?? {};
  return {
    ...baseLicense,
    ...rest,
    features: {
      ...baseLicense.features,
      ...(features ?? {}),
    },
  };
};

const baseMonitoring: MonitoringSnapshot = {
  lastUpdatedAt: '2025-09-28T11:45:00.000Z',
  dbConnection: 'healthy',
  smtpStatus: 'ok',
  uptimeSeconds: 86400 * 15,
  cpuUtilization: 0.42,
  memoryUtilization: 0.56,
  queueBacklog: 3,
};

const buildMonitoring = (
  overrides?: Partial<MonitoringSnapshot>,
): MonitoringSnapshot => ({
  ...baseMonitoring,
  ...(overrides ?? {}),
});

const baseInfrastructure: InfrastructureStatus = {
  lastBackupAt: '2025-09-28T05:00:00.000Z',
  lastBackupMode: 'scheduled',
  lastRestoreAt: '2025-09-15T02:15:00.000Z',
  lastRestoreDryRunAt: '2025-09-20T18:30:00.000Z',
  deletionScheduledFor: null,
};

const buildInfrastructure = (
  overrides?: Partial<InfrastructureStatus>,
): InfrastructureStatus => ({
  ...baseInfrastructure,
  ...(overrides ?? {}),
});

const buildConfigItems = (
  tenantId: string,
  ownerUserId: string,
  overrides?: Partial<Record<string, Partial<ConfigItem>>>,
): ConfigItem[] => {
  const base: ConfigItem[] = [
    {
      key: 'db.connection_string',
      value: `postgresql://app-user:app-pass@db.${tenantId}.local:5432/core`,
      encrypted: true,
      masked: true,
      description: 'Primary database connection string (read/write).',
      lastUpdatedAt: '2025-08-10T12:45:00.000Z',
      lastUpdatedByUserId: ownerUserId,
      requiresStepUp: true,
    },
    {
      key: 'smtp.username',
      value: `alerts@${tenantId}.owncent`,
      encrypted: false,
      masked: false,
      description: 'SMTP username for alerting and statements.',
      lastUpdatedAt: '2025-08-12T09:15:00.000Z',
      lastUpdatedByUserId: ownerUserId,
      requiresStepUp: false,
    },
    {
      key: 'smtp.password',
      value: '••••••••••',
      encrypted: true,
      masked: true,
      description: 'SMTP credential for transactional mail.',
      lastUpdatedAt: null,
      lastUpdatedByUserId: null,
      requiresStepUp: true,
    },
    {
      key: 'security.enforce_strong_passwords',
      value: 'true',
      encrypted: false,
      masked: false,
      description: 'Require passwords to meet complexity thresholds.',
      lastUpdatedAt: '2025-08-31T08:00:00.000Z',
      lastUpdatedByUserId: ownerUserId,
      requiresStepUp: false,
    },
  ];

  if (!overrides) {
    return base;
  }

  return base.map((item) => {
    const patch = overrides[item.key];
    return patch ? { ...item, ...patch } : item;
  });
};

interface TenantSeed {
  tenantId: string;
  users: SeedUser[];
  license?: Partial<LicenseState> & {
    features?: Partial<LicenseState['features']>;
  };
  featureFlags?: Partial<Record<FeatureFlagKey, Partial<FeatureFlagRecord>>>;
  configOverrides?: Partial<Record<string, Partial<ConfigItem>>>;
  monitoring?: Partial<MonitoringSnapshot>;
  infrastructure?: Partial<InfrastructureStatus>;
  bankConnections?: BankConnectionRecord[];
  bankTokens?: BankTokenRecord[];
}

const tenantSeeds: TenantSeed[] = [
  {
    tenantId: 'demo-instance',
    users: [
      {
        id: 'user-owner',
        username: 'admin',
        password: 'admin',
        displayName: 'Avery Li',
        email: 'avery.li@demo-instance.owncent',
        role: 'owner',
        tier: 'premium',
        isPremium: true,
        phone: '+1-555-0100',
        twoFactorEnabled: true,
        twoFactorSecret: 'KZXW6YTBONSWG4TFOQ======',
      },
      {
        id: 'user-manager',
        username: 'manager',
        password: 'manager',
        displayName: 'Jordan Smith',
        email: 'jordan.smith@demo-instance.owncent',
        role: 'manager',
        tier: 'advanced',
        isPremium: false,
        phone: '+1-555-0101',
      },
      {
        id: 'user-demo',
        username: 'demo',
        password: 'demo',
        displayName: 'Demo User',
        email: 'demo.user@demo-instance.owncent',
        role: 'user',
        tier: 'advanced',
        isPremium: false,
        phone: '+1-555-0102',
      },
      {
        id: 'user-premium',
        username: 'premium',
        password: 'premium',
        displayName: 'Priya Malhotra',
        email: 'priya.malhotra@demo-instance.owncent',
        role: 'user',
        tier: 'premium',
        isPremium: true,
        phone: '+1-555-0103',
      },
      {
        id: 'user-family',
        username: 'family',
        password: 'family',
        displayName: 'The Oakwoods',
        email: 'family.team@demo-instance.owncent',
        role: 'family',
        tier: 'family',
        isPremium: true,
        phone: '+1-555-0104',
      },
      {
        id: 'user-readonly',
        username: 'readonly',
        password: 'readonly',
        displayName: 'View Only',
        email: 'readonly.viewer@demo-instance.owncent',
        role: 'readonly',
        tier: 'free',
        isPremium: false,
        phone: '+1-555-0105',
      },
    ],
    license: {
      licenseId: 'demo-license-001',
      tier: 'premium',
      status: 'valid',
      expiresAt: '2026-01-01T00:00:00.000Z',
      lastValidatedAt: '2025-09-28T00:00:00.000Z',
      features: {
        debt_optimizer: false,
        strategy_simulator: false,
        bank_api: false,
        family_accounts: true,
        detailed_reports: false,
      },
    },
  },
  {
    tenantId: 'aurora-family',
    users: [
      {
        id: 'aurora-owner',
        username: 'aurora-admin',
        password: 'aurora',
        displayName: 'Morgan Patel',
        email: 'morgan.patel@aurora-family.owncent',
        role: 'owner',
        tier: 'family',
        isPremium: true,
        phone: '+1-555-0200',
        twoFactorEnabled: true,
        twoFactorSecret: 'NB2W45DFOIZA====',
      },
      {
        id: 'aurora-ops',
        username: 'operations',
        password: 'operations',
        displayName: 'Riley Chen',
        email: 'riley.chen@aurora-family.owncent',
        role: 'manager',
        tier: 'premium',
        isPremium: true,
        phone: '+1-555-0201',
      },
      {
        id: 'aurora-advisor',
        username: 'advisor',
        password: 'advisor',
        displayName: 'Samira El-Sayed',
        email: 'samira.el-sayed@aurora-family.owncent',
        role: 'user',
        tier: 'advanced',
        isPremium: false,
        phone: '+1-555-0202',
      },
      {
        id: 'aurora-household',
        username: 'household',
        password: 'household',
        displayName: 'Aurora Household',
        email: 'household.team@aurora-family.owncent',
        role: 'family',
        tier: 'family',
        isPremium: true,
        phone: '+1-555-0203',
      },
    ],
    license: {
      licenseId: 'aurora-license-301',
      tier: 'family',
      status: 'valid',
      expiresAt: '2026-04-15T00:00:00.000Z',
      lastValidatedAt: '2025-09-25T09:00:00.000Z',
      features: {
        debt_optimizer: true,
        strategy_simulator: true,
        bank_api: true,
        family_accounts: true,
        detailed_reports: true,
      },
    },
    featureFlags: {
      bank_api_enabled: {
        value: true,
        lastChangedAt: '2025-09-18T10:00:00.000Z',
      },
      debt_optimizer_enabled: {
        value: true,
        lastChangedAt: '2025-09-12T12:30:00.000Z',
      },
      strategy_simulator_enabled: {
        value: true,
        lastChangedAt: '2025-09-12T12:30:00.000Z',
      },
      reports_enabled: {
        value: true,
        lastChangedAt: '2025-09-19T07:45:00.000Z',
      },
    },
    configOverrides: {
      'db.connection_string': {
        value: 'postgresql://aurora-app:aurora-pass@db.aurora-family.local:5432/core',
        lastUpdatedByUserId: 'aurora-owner',
        lastUpdatedAt: '2025-08-22T10:30:00.000Z',
      },
      'smtp.username': {
        value: 'alerts@aurora-family.owncent',
        lastUpdatedByUserId: 'aurora-ops',
        lastUpdatedAt: '2025-08-24T08:10:00.000Z',
      },
    },
    monitoring: {
      lastUpdatedAt: '2025-09-29T14:20:00.000Z',
      dbConnection: 'healthy',
      smtpStatus: 'warning',
      cpuUtilization: 0.35,
      memoryUtilization: 0.61,
      queueBacklog: 5,
      uptimeSeconds: 86400 * 22,
    },
    infrastructure: {
      lastBackupAt: '2025-09-27T04:45:00.000Z',
      lastBackupMode: 'manual',
      lastRestoreAt: '2025-09-10T01:20:00.000Z',
      lastRestoreDryRunAt: '2025-09-18T16:10:00.000Z',
    },
    bankConnections: [
      {
        id: 'conn-aurora-dnb',
        tenantId: 'aurora-family',
        userId: 'aurora-owner',
        provider: 'demo',
        institutionId: 'dnb',
        institutionName: 'DNB Bank',
        status: 'active',
        connectionLabel: 'Aurora Household DNB',
        lastSyncedAt: '2025-09-28T09:45:00.000Z',
        createdAt: '2025-08-15T12:00:00.000Z',
        updatedAt: '2025-09-28T09:45:00.000Z',
        metadata: { accountCount: 3 },
      },
    ],
    bankTokens: [
      {
        id: 'token-aurora-dnb-root',
        tenantId: 'aurora-family',
        connectionId: 'conn-aurora-dnb',
        scope: ['accounts:read', 'transactions:read'],
        expiresAt: '2025-12-31T23:59:59.000Z',
        createdAt: '2025-08-15T12:01:00.000Z',
        secretFragment: 'aur-****-demo',
      },
    ],
  },
];

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const buildInitialTenants = (): Record<string, AppState> => {
  const entries = tenantSeeds.map((seed) => {
    const users = seed.users.map(makeUser);
    const ownerId =
      users.find((user) => user.role === 'owner')?.id ?? users[0]?.id ?? 'system-owner';
    const bankConnections = seed.bankConnections?.map((connection) => ({ ...connection })) ?? [];
    const bankTokens = seed.bankTokens?.map((token) => ({ ...token })) ?? [];
    const state: AppState = {
      users,
      featureFlags: buildFeatureFlags(seed.featureFlags),
      license: buildLicense(seed.license),
      configItems: buildConfigItems(seed.tenantId, ownerId, seed.configOverrides),
      monitoring: buildMonitoring(seed.monitoring),
      infrastructure: buildInfrastructure(seed.infrastructure),
      auditLogs: [],
      refreshTokens: [],
      stepUpEvents: [],
      impersonations: [],
      bankConnections,
      bankTokens,
    };
    return [seed.tenantId, state] as const;
  });

  return Object.fromEntries(entries);
};

const seededTenants = buildInitialTenants();

export const initialTenants: Record<string, AppState> = seededTenants;

export const knownTenantIds = Object.freeze(Object.keys(seededTenants));

export const getInitialTenantState = (tenantId: string): AppState | undefined => {
  const state = seededTenants[tenantId];
  if (!state) {
    return undefined;
  }
  return clone(state);
};












