import { useState, useEffect, useCallback } from 'react';
import { bankApi } from '../lib/apiClient';
import { useLicenseGating } from './useLicenseGating';

interface BankConnection {
  id: string;
  provider: string;
  institutionName: string;
  status: 'pending' | 'active' | 'error' | 'revoked';
  connectionLabel?: string;
  lastSyncedAt?: string;
  failureReason?: string;
  createdAt: string;
}

interface BankToken {
  id: string;
  connectionId: string;
  scope: string[];
  expiresAt: string;
  createdAt: string;
  secretFragment: string;
  revokedAt?: string;
}

interface UseBankConnectionsReturn {
  connections: BankConnection[];
  tokens: BankToken[];
  loading: boolean;
  error: string | null;
  canUseBankIntegration: boolean;
  refetch: () => Promise<void>;
  createConnection: (data: {
    provider?: string;
    institutionId: string;
    institutionName: string;
    connectionLabel?: string;
  }) => Promise<void>;
  syncConnection: (connectionId: string) => Promise<void>;
  revokeConnection: (connectionId: string, reason?: string) => Promise<void>;
  issueToken: (connectionId: string, scope: string[], expiresInDays?: number) => Promise<void>;
  revokeToken: (tokenId: string, reason?: string) => Promise<void>;
}

export const useBankConnections = (): UseBankConnectionsReturn => {
  const { canUseBankIntegration } = useLicenseGating();
  const [connections, setConnections] = useState<BankConnection[]>([]);
  const [tokens, setTokens] = useState<BankToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!canUseBankIntegration) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await bankApi.listConnections(true) as { connections: BankConnection[]; tokens: BankToken[] };
      setConnections(response.connections);
      setTokens(response.tokens);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bank data');
    } finally {
      setLoading(false);
    }
  }, [canUseBankIntegration]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createConnection = useCallback(async (data: {
    provider?: string;
    institutionId: string;
    institutionName: string;
    connectionLabel?: string;
  }) => {
    try {
      setError(null);
      await bankApi.createConnection(data);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create connection');
      throw err;
    }
  }, [fetchData]);

  const syncConnection = useCallback(async (connectionId: string) => {
    try {
      setError(null);
      await bankApi.syncConnection(connectionId, { status: 'active' });
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync connection');
      throw err;
    }
  }, [fetchData]);

  const revokeConnection = useCallback(async (connectionId: string, reason?: string) => {
    try {
      setError(null);
      await bankApi.revokeConnection(connectionId, { reason });
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke connection');
      throw err;
    }
  }, [fetchData]);

  const issueToken = useCallback(async (connectionId: string, scope: string[], expiresInDays = 90) => {
    try {
      setError(null);
      await bankApi.issueToken(connectionId, { scope, expiresInDays });
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to issue token');
      throw err;
    }
  }, [fetchData]);

  const revokeToken = useCallback(async (tokenId: string, reason?: string) => {
    try {
      setError(null);
      await bankApi.revokeToken(tokenId, { reason });
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke token');
      throw err;
    }
  }, [fetchData]);

  return {
    connections,
    tokens,
    loading,
    error,
    canUseBankIntegration,
    refetch: fetchData,
    createConnection,
    syncConnection,
    revokeConnection,
    issueToken,
    revokeToken,
  };
};