import { randomUUID } from 'crypto';
import { getInitialTenantState, knownTenantIds } from './initialData';
import type {
  AppState,
  AuditLogEntry,
  BankConnectionRecord,
  BankTokenRecord,
  FeatureFlagKey,
  FeatureFlagRecord,
  ImpersonationRecord,
  RefreshTokenRecord,
  StepUpEvent,
  UserRecord,
} from '../types';
export class TenantNotFoundError extends Error {
  tenantId: string;

  constructor(tenantId: string) {
    super(`Tenant not found: ${tenantId}`);
    this.name = 'TenantNotFoundError';
    this.tenantId = tenantId;
  }
}

export class TenantIsolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TenantIsolationError';
  }
}

const knownTenants = new Set(knownTenantIds);
const tenants = new Map<string, AppState>();

const bootstrapTenants = () => {
  knownTenants.forEach((tenantId) => {
    const snapshot = getInitialTenantState(tenantId);
    if (snapshot) {
      tenants.set(tenantId, snapshot);
    }
  });
};

bootstrapTenants();

const requireTenant = (tenantId: string): AppState => {
  const existing = tenants.get(tenantId);
  if (existing) {
    return existing;
  }
  const snapshot = getInitialTenantState(tenantId);
  if (!snapshot) {
    throw new TenantNotFoundError(tenantId);
  }
  tenants.set(tenantId, snapshot);
  return snapshot;
};

const validateTenantAccess = (tenantId: string, operation: string): void => {
  if (!tenantId || tenantId.trim().length === 0) {
    throw new TenantIsolationError(`Invalid tenant ID for operation: ${operation}`);
  }
  
  const normalizedTenantId = tenantId.trim().toLowerCase();
  if (normalizedTenantId !== tenantId) {
    throw new TenantIsolationError(`Tenant ID must be normalized for operation: ${operation}`);
  }
};

export const listTenants = (): string[] =>
  Array.from(new Set<string>([...knownTenants, ...tenants.keys()]));

export const tenantExists = (tenantId: string): boolean => {
  validateTenantAccess(tenantId, 'tenantExists');
  return knownTenants.has(tenantId) || tenants.has(tenantId);
};

export const resetState = (tenantId?: string): void => {
  if (!tenantId) {
    tenants.clear();
    bootstrapTenants();
    return;
  }
  validateTenantAccess(tenantId, 'resetState');
  const snapshot = getInitialTenantState(tenantId);
  if (!snapshot) {
    throw new TenantNotFoundError(tenantId);
  }
  tenants.set(tenantId, snapshot);
};

export const getState = (tenantId: string): AppState => {
  validateTenantAccess(tenantId, 'getState');
  return requireTenant(tenantId);
};

export const saveUser = (tenantId: string, user: UserRecord): void => {
  validateTenantAccess(tenantId, 'saveUser');
  const state = requireTenant(tenantId);
  const index = state.users.findIndex((existing) => existing.id === user.id);
  if (index >= 0) {
    state.users[index] = user;
  } else {
    state.users.push(user);
  }
};

export const findUserByUsername = (
  tenantId: string,
  username: string,
): UserRecord | undefined => {
  validateTenantAccess(tenantId, 'findUserByUsername');
  const state = requireTenant(tenantId);
  const normalized = username.trim().toLowerCase();
  return state.users.find((user) => user.username.toLowerCase() === normalized);
};

export const findUserById = (tenantId: string, id: string): UserRecord | undefined => {
  validateTenantAccess(tenantId, 'findUserById');
  const state = requireTenant(tenantId);
  return state.users.find((user) => user.id === id);
};

export const addAuditLog = (tenantId: string, entry: AuditLogEntry): void => {
  validateTenantAccess(tenantId, 'addAuditLog');
  const state = requireTenant(tenantId);
  state.auditLogs.unshift(entry);
  state.auditLogs = state.auditLogs.slice(0, 2000);
};

export const getAuditLogs = (tenantId: string): AuditLogEntry[] =>
  {
    validateTenantAccess(tenantId, 'getAuditLogs');
    return requireTenant(tenantId).auditLogs;
  };

export const updateFeatureFlag = (
  tenantId: string,
  key: FeatureFlagKey,
  updater: (current: FeatureFlagRecord) => FeatureFlagRecord,
): FeatureFlagRecord => {
  validateTenantAccess(tenantId, 'updateFeatureFlag');
  const state = requireTenant(tenantId);
  const current = state.featureFlags[key];
  const next = updater(current);
  state.featureFlags[key] = next;
  return next;
};

export const getFeatureFlags = (
  tenantId: string,
): Record<FeatureFlagKey, FeatureFlagRecord> => {
    validateTenantAccess(tenantId, 'getFeatureFlags');
    return requireTenant(tenantId).featureFlags;
  };

export const getLicense = (tenantId: string): AppState['license'] => {
  validateTenantAccess(tenantId, 'getLicense');
  return requireTenant(tenantId).license;
};

export const setLicense = (tenantId: string, license: AppState['license']): void => {
  validateTenantAccess(tenantId, 'setLicense');
  const state = requireTenant(tenantId);
  state.license = license;
};

export const getConfigItems = (tenantId: string): AppState['configItems'] =>
  requireTenant(tenantId).configItems;

export const setConfigItems = (
  tenantId: string,
  items: AppState['configItems'],
): void => {
  const state = requireTenant(tenantId);
  state.configItems = items;
};

export const getMonitoring = (tenantId: string): AppState['monitoring'] =>
  requireTenant(tenantId).monitoring;

export const setMonitoring = (
  tenantId: string,
  snapshot: AppState['monitoring'],
): void => {
  const state = requireTenant(tenantId);
  state.monitoring = snapshot;
};

export const getInfrastructure = (tenantId: string): AppState['infrastructure'] =>
  requireTenant(tenantId).infrastructure;

export const setInfrastructure = (
  tenantId: string,
  status: AppState['infrastructure'],
): void => {
  const state = requireTenant(tenantId);
  state.infrastructure = status;
};

export const addRefreshToken = (
  tenantId: string,
  record: RefreshTokenRecord,
): void => {
  const state = requireTenant(tenantId);
  state.refreshTokens.push(record);
};

export const findRefreshToken = (
  tenantId: string,
  token: string,
): RefreshTokenRecord | undefined => {
  const state = requireTenant(tenantId);
  return state.refreshTokens.find(
    (record) => record.token === token && !record.revokedAt && record.tenantId === tenantId,
  );
};

export const revokeRefreshToken = (
  tenantId: string,
  token: string,
  reason?: string,
): void => {
  const state = requireTenant(tenantId);
  const record = state.refreshTokens.find((refresh) => refresh.token === token);
  if (record && !record.revokedAt) {
    record.revokedAt = new Date().toISOString();
    addAuditLog(tenantId, {
      id: randomUUID(),
      actorUserId: record.userId,
      actorUsername: 'system',
      actorDisplayName: 'System',
      action: 'auth.refresh_revoked',
      targetEntity: record.userId,
      metadata: { reason },
      severity: 'warning',
      immutable: false,
      timestamp: new Date().toISOString(),
    });
  }
};

export const addStepUpEvent = (tenantId: string, event: StepUpEvent): void => {
  const state = requireTenant(tenantId);
  state.stepUpEvents.push(event);
};

export const getStepUpEventsByUser = (
  tenantId: string,
  userId: string,
): StepUpEvent[] => {
  const state = requireTenant(tenantId);
  return state.stepUpEvents.filter((event) => event.userId === userId);
};

export const startImpersonation = (
  tenantId: string,
  record: ImpersonationRecord,
): void => {
  const state = requireTenant(tenantId);
  state.impersonations.push(record);
};

export const endImpersonation = (
  tenantId: string,
  actorUserId: string,
): void => {
  const state = requireTenant(tenantId);
  state.impersonations = state.impersonations.map((impersonation) =>
    impersonation.actorUserId === actorUserId && !impersonation.endedAt
      ? { ...impersonation, endedAt: new Date().toISOString() }
      : impersonation,
  );
};

export const getActiveImpersonation = (
  tenantId: string,
  actorUserId: string,
): ImpersonationRecord | undefined => {
  const state = requireTenant(tenantId);
  return state.impersonations.find(
    (impersonation) => impersonation.actorUserId === actorUserId && !impersonation.endedAt,
  );
};

export const listBankConnections = (tenantId: string): BankConnectionRecord[] =>
  requireTenant(tenantId).bankConnections;

export const addBankConnection = (
  tenantId: string,
  connection: BankConnectionRecord,
): void => {
  const state = requireTenant(tenantId);
  state.bankConnections.push(connection);
};

export const updateBankConnection = (
  tenantId: string,
  connectionId: string,
  updater: (current: BankConnectionRecord) => BankConnectionRecord,
): BankConnectionRecord | null => {
  const state = requireTenant(tenantId);
  const index = state.bankConnections.findIndex((connection) => connection.id === connectionId);
  if (index === -1) {
    return null;
  }
  const next = updater(state.bankConnections[index]!);
  state.bankConnections[index] = next;
  return next;
};

export const listBankTokens = (
  tenantId: string,
  connectionId?: string,
): BankTokenRecord[] => {
  const state = requireTenant(tenantId);
  if (!connectionId) {
    return state.bankTokens;
  }
  return state.bankTokens.filter((token) => token.connectionId === connectionId);
};

export const addBankToken = (tenantId: string, token: BankTokenRecord): void => {
  const state = requireTenant(tenantId);
  state.bankTokens.push(token);
};

export const revokeBankTokenRecord = (
  tenantId: string,
  tokenId: string,
  reason?: string,
): BankTokenRecord | null => {
  const state = requireTenant(tenantId);
  const token = state.bankTokens.find((record) => record.id === tokenId);
  if (!token || token.revokedAt) {
    return null;
  }
  token.revokedAt = new Date().toISOString();
  token.metadata = {
    ...(token.metadata ?? {}),
    revokedReason: reason ?? 'revoked',
  };
  return token;
};

export const revokeTokensForConnection = (
  tenantId: string,
  connectionId: string,
  reason?: string,
): BankTokenRecord[] => {
  const state = requireTenant(tenantId);
  const revoked: BankTokenRecord[] = [];
  state.bankTokens = state.bankTokens.map((token) => {
    if (token.connectionId !== connectionId || token.revokedAt) {
      return token;
    }
    const updated: BankTokenRecord = {
      ...token,
      revokedAt: new Date().toISOString(),
      metadata: {
        ...(token.metadata ?? {}),
        revokedReason: reason ?? 'connection_revoked',
      },
    };
    revoked.push(updated);
    return updated;
  });
  return revoked;
};
export const newAuditLogEntry = (
  tenantId: string,
  partial: Omit<AuditLogEntry, 'id' | 'timestamp'>,
): AuditLogEntry => {
  const entry: AuditLogEntry = {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    ...partial,
  };
  addAuditLog(tenantId, entry);
  return entry;
};



