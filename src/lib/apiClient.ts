import type {
  AuditLogEntry,
  ConfigItem,
  FeatureFlagKey,
  FeatureFlagRecord,
  ImpersonationState,
  InfrastructureStatus,
  LicenseState,
  MonitoringSnapshot,
  SessionInfo,
} from '../context/AdminFoundation';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';
const API_VERSION = 'api'; // Use versioned API endpoints
const REFRESH_STORAGE_KEY = 'owncent.refreshToken';
const TENANT_ID = (import.meta.env.VITE_TENANT_ID ?? 'demo-instance').toLowerCase();

let accessToken: string | null = null;
let refreshInFlight: Promise<string | null> | null = null;

export interface LoginSuccess {
  accessToken: string;
  refreshToken: string;
}

export interface LoginChallenge {
  requiresTwoFactor: true;
  challengeId: string;
}

export type LoginResponse = LoginSuccess | LoginChallenge;

export interface BankConnection {
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

export interface BankToken {
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


type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

type JsonValue = Record<string, unknown> | undefined;

const withApiBase = (path: string): string => {
  if (path.startsWith('http')) {
    return path;
  }
  // Use versioned API endpoints with tenant header
  return `${API_BASE_URL}/${API_VERSION}${path}`;
};

export const getStoredRefreshToken = (): string | null =>
  localStorage.getItem(REFRESH_STORAGE_KEY);

export const setTokens = (tokens: { accessToken: string; refreshToken?: string | null }): void => {
  accessToken = tokens.accessToken;
  if (tokens.refreshToken) {
    localStorage.setItem(REFRESH_STORAGE_KEY, tokens.refreshToken);
  }
};

export const clearTokens = (): void => {
  accessToken = null;
  localStorage.removeItem(REFRESH_STORAGE_KEY);
};

const refreshAccessToken = async (): Promise<string | null> => {
  if (refreshInFlight) {
    return refreshInFlight;
  }
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    accessToken = null;
    return null;
  }
  refreshInFlight = (async () => {
    try {
      const response = await fetch(withApiBase('/api/auth/refresh'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': TENANT_ID,
        },
        body: JSON.stringify({ refreshToken }),
      });
      if (!response.ok) {
        clearTokens();
        return null;
      }
      const data = (await response.json()) as { accessToken: string };
      accessToken = data.accessToken;
      return accessToken;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
};

interface RequestOptions {
  method?: HttpMethod;
  body?: JsonValue;
  signal?: AbortSignal;
}

const request = async <TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> => {
  const { method = 'GET', body, signal } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Tenant-ID': TENANT_ID,
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const execute = () =>
    fetch(withApiBase(path), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });

  let response = await execute();

  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      throw new Error('UNAUTHORIZED');
    }
    headers.Authorization = `Bearer ${refreshed}`;
    response = await execute();
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Request failed');
  }

  return (await response.json()) as TResponse;
};

export const authApi = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(withApiBase('/api/auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-ID': TENANT_ID,
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.reason ?? 'Login failed');
    }
    const data = (await response.json()) as LoginResponse;
    if ('requiresTwoFactor' in data) {
      return data;
    }
    setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    return data;
  },

  async verifyTwoFactor(challengeId: string, code: string): Promise<LoginSuccess> {
    const response = await fetch(withApiBase('/api/auth/2fa/verify'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-ID': TENANT_ID,
      },
      body: JSON.stringify({ challengeId, code }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message ?? 'Two-factor verification failed');
    }
    const data = (await response.json()) as LoginSuccess;
    setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    return data;
  },

  async logout(): Promise<void> {
    try {
      const refreshToken = getStoredRefreshToken();
      await request<void>('/api/auth/logout', {
        method: 'POST',
        body: refreshToken ? { refreshToken } : undefined,
      });
    } catch (error) {
      console.warn('Logout failed', error);
    } finally {
      clearTokens();
    }
  },

  async loadSession(): Promise<{ user: SessionInfo; impersonation: ImpersonationState | null }> {
    return request('/api/auth/session');
  },

  async stepUp(action: string, code: string): Promise<{ success: boolean }> {
    return request('/api/auth/step-up', {
      method: 'POST',
      body: { action, code },
    });
  },

  async impersonate(targetUserId: string, reason?: string): Promise<string> {
    const data = await request<{ accessToken: string }>('/api/auth/impersonate', {
      method: 'POST',
      body: { targetUserId, reason },
    });
    setTokens({ accessToken: data.accessToken });
    return data.accessToken;
  },

  async stopImpersonation(): Promise<string> {
    const data = await request<{ accessToken: string }>('/api/auth/impersonate/stop', {
      method: 'POST',
    });
    setTokens({ accessToken: data.accessToken });
    return data.accessToken;
  },

  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(withApiBase('/api/auth/password-reset/request'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-ID': TENANT_ID,
      },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message ?? 'Password reset request failed');
    }
    
    return response.json();
  },

  async confirmPasswordReset(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(withApiBase('/api/auth/password-reset/confirm'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-ID': TENANT_ID,
      },
      body: JSON.stringify({ token, newPassword }),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message ?? 'Password reset failed');
    }
    
    return response.json();
  },

  async requestEmailVerification(): Promise<{ success: boolean; message: string }> {
    return request('/api/auth/email-verification/request', {
      method: 'POST',
    });
  },

  async confirmEmailVerification(token: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(withApiBase('/api/auth/email-verification/confirm'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-ID': TENANT_ID,
      },
      body: JSON.stringify({ token }),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message ?? 'Email verification failed');
    }
    
    return response.json();
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return request('/api/auth/change-password', {
      method: 'POST',
      body: { currentPassword, newPassword },
    });
  },
};

export interface AdminBootstrapResponse {
  users: Array<SessionInfo & { phone: string }>;
  featureFlags: Record<FeatureFlagKey, FeatureFlagRecord>;
  license: LicenseState;
  configItems: ConfigItem[];
  monitoring: MonitoringSnapshot;
  infrastructure: InfrastructureStatus;
  auditLogs: AuditLogEntry[];
}

export const adminApi = {
  async bootstrap(): Promise<AdminBootstrapResponse> {
    return request('/api/admin/bootstrap');
  },

  async updateFeatureFlag(
    key: FeatureFlagKey,
    payload: { value: boolean; notes?: string },
  ): Promise<FeatureFlagRecord> {
    return request(`/api/admin/feature-flags/${key}`, {
      method: 'PATCH',
      body: payload,
    });
  },

  async appendAudit(entry: {
    action: string;
    targetEntity: string;
    severity?: 'info' | 'warning' | 'critical';
    metadata?: Record<string, unknown>;
    immutable?: boolean;
  }): Promise<AuditLogEntry> {
    return request('/api/admin/audit', {
      method: 'POST',
      body: entry,
    });
  },

  async updateConfig(key: string, payload: { value: string; masked?: boolean }): Promise<ConfigItem> {
    return request(`/api/admin/config/${key}`, {
      method: 'PATCH',
      body: payload,
    });
  },

  async refreshMonitoring(): Promise<MonitoringSnapshot> {
    return request('/api/admin/monitoring/refresh', { method: 'POST' });
  },

  async triggerBackup(mode: 'manual' | 'scheduled'): Promise<InfrastructureStatus> {
    return request('/api/admin/infrastructure/backup', {
      method: 'POST',
      body: { mode },
    });
  },

  async triggerRestore(options: { dryRun?: boolean }): Promise<InfrastructureStatus> {
    return request('/api/admin/infrastructure/restore', {
      method: 'POST',
      body: options,
    });
  },

  async scheduleDeletion(payload: { confirmationToken: string; scheduledFor: string }): Promise<InfrastructureStatus> {
    return request('/api/admin/infrastructure/deletion/schedule', {
      method: 'POST',
      body: payload,
    });
  },

  async cancelDeletion(): Promise<InfrastructureStatus> {
    return request('/api/admin/infrastructure/deletion/cancel', { method: 'POST' });
  },

  async updateLicenseOverride(payload: { overrideActive: boolean; overrideTier?: LicenseState['tier'] }): Promise<LicenseState> {
    return request('/api/admin/license/override', {
      method: 'POST',
      body: payload,
    });
  },
};

export const bankApi = {
  async listConnections(includeTokens = false): Promise<
    BankConnection[] | { connections: BankConnection[]; tokens: BankToken[] }
  > {
    if (includeTokens) {
      return request('/api/bank/connections?includeTokens=true');
    }
    return request('/api/bank/connections');
  },

  async createConnection(payload: {
    provider?: BankConnection['provider'];
    institutionId: string;
    institutionName: string;
    connectionLabel?: string;
  }): Promise<BankConnection> {
    return request('/api/bank/connections', {
      method: 'POST',
      body: payload,
    });
  },

  async issueToken(
    connectionId: string,
    payload: { scope: string[]; expiresInDays?: number },
  ): Promise<BankToken> {
    return request(`/api/bank/connections/${connectionId}/token`, {
      method: 'POST',
      body: payload,
    });
  },

  async syncConnection(
    connectionId: string,
    payload: { status?: 'pending' | 'active' | 'error'; failureReason?: string },
  ): Promise<BankConnection> {
    return request(`/api/bank/connections/${connectionId}/sync`, {
      method: 'POST',
      body: payload,
    });
  },

  async revokeConnection(
    connectionId: string,
    payload?: { reason?: string },
  ): Promise<{ connection: BankConnection; revokedTokens: BankToken[] }> {
    return request(`/api/bank/connections/${connectionId}/revoke`, {
      method: 'POST',
      body: payload,
    });
  },

  async listTokens(connectionId: string): Promise<BankToken[]> {
    return request(`/api/bank/connections/${connectionId}/tokens`);
  },

  async revokeToken(tokenId: string, payload?: { reason?: string }): Promise<BankToken> {
    return request(`/api/bank/tokens/${tokenId}/revoke`, {
      method: 'POST',
      body: payload,
    });
  },
};

export const initializeTokensFromStorage = (): void => {
  const storedRefresh = getStoredRefreshToken();
  if (!storedRefresh) {
    accessToken = null;
  }
};