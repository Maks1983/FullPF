import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Trash2, RefreshCw, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { bankApi } from '../../lib/apiClient';
import { useLicenseGating } from '../../hooks/useLicenseGating';

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

interface BankIntegrationSettingsProps {
  onChanged: () => void;
}

const BankIntegrationSettings: React.FC<BankIntegrationSettingsProps> = ({ onChanged }) => {
  const { canUseBankIntegration, getUpgradeMessage } = useLicenseGating();
  const [connections, setConnections] = useState<BankConnection[]>([]);
  const [tokens, setTokens] = useState<BankToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);

  const [newConnection, setNewConnection] = useState({
    provider: 'demo',
    institutionId: '',
    institutionName: '',
    connectionLabel: ''
  });

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const response = await bankApi.listConnections(true) as { connections: BankConnection[]; tokens: BankToken[] };
      setConnections(response.connections);
      setTokens(response.tokens);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch connections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canUseBankIntegration) {
      fetchConnections();
    } else {
      setLoading(false);
    }
  }, [canUseBankIntegration]);

  const handleCreateConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConnection.institutionId || !newConnection.institutionName) return;

    try {
      await bankApi.createConnection({
        provider: newConnection.provider as any,
        institutionId: newConnection.institutionId,
        institutionName: newConnection.institutionName,
        connectionLabel: newConnection.connectionLabel || undefined
      });

      setNewConnection({
        provider: 'demo',
        institutionId: '',
        institutionName: '',
        connectionLabel: ''
      });
      setShowAddForm(false);
      await fetchConnections();
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create connection');
    }
  };

  const handleSyncConnection = async (connectionId: string) => {
    try {
      setSyncing(connectionId);
      await bankApi.syncConnection(connectionId, { status: 'active' });
      await fetchConnections();
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync connection');
    } finally {
      setSyncing(null);
    }
  };

  const handleRevokeConnection = async (connectionId: string) => {
    if (!confirm('Are you sure you want to revoke this bank connection? This will also revoke all associated tokens.')) {
      return;
    }

    try {
      await bankApi.revokeConnection(connectionId, { reason: 'User requested revocation' });
      await fetchConnections();
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke connection');
    }
  };

  const handleIssueToken = async (connectionId: string) => {
    try {
      await bankApi.issueToken(connectionId, {
        scope: ['accounts:read', 'transactions:read'],
        expiresInDays: 90
      });
      await fetchConnections();
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to issue token');
    }
  };

  const handleRevokeToken = async (tokenId: string) => {
    if (!confirm('Are you sure you want to revoke this token?')) {
      return;
    }

    try {
      await bankApi.revokeToken(tokenId, { reason: 'User requested revocation' });
      await fetchConnections();
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke token');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'pending': return Clock;
      case 'error': return XCircle;
      case 'revoked': return XCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      case 'revoked': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  if (!canUseBankIntegration) {
    return (
      <div className="rounded-2xl bg-gradient-to-r from-purple-100 to-purple-50 border border-purple-200 p-6 text-purple-900 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <CreditCard className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-purple-900">
              Bank Integration
            </h3>
            <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-white text-purple-700">
              PREMIUM
            </span>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 mb-4 border border-purple-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((index) => (
              <div key={index} className="p-4 bg-gray-100 rounded-lg border border-gray-200">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mb-4 text-purple-800">
          {getUpgradeMessage('bankIntegration')}
        </p>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Upgrade to Premium
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bank Connections */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Bank Connections</h2>
              <p className="text-sm text-gray-600">Connect your bank accounts for automatic transaction import</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Connection
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Add Connection Form */}
        {showAddForm && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-4">Add New Bank Connection</h4>
            <form onSubmit={handleCreateConnection} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                  <select
                    value={newConnection.provider}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, provider: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="demo">Demo Provider</option>
                    <option value="plaid">Plaid</option>
                    <option value="teller">Teller</option>
                    <option value="finicity">Finicity</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name</label>
                  <input
                    type="text"
                    value={newConnection.institutionName}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, institutionName: e.target.value }))}
                    placeholder="e.g., Chase Bank"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution ID</label>
                  <input
                    type="text"
                    value={newConnection.institutionId}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, institutionId: e.target.value }))}
                    placeholder="e.g., chase"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Connection Label (Optional)</label>
                  <input
                    type="text"
                    value={newConnection.connectionLabel}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, connectionLabel: e.target.value }))}
                    placeholder="e.g., Primary Checking"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Connection
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Connections List */}
        <div className="space-y-4">
          {connections.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Bank Connections</h3>
              <p className="text-gray-600">Connect your first bank account to enable automatic transaction import.</p>
            </div>
          ) : (
            connections.map((connection) => {
              const StatusIcon = getStatusIcon(connection.status);
              const connectionTokens = tokens.filter(token => token.connectionId === connection.id && !token.revokedAt);
              
              return (
                <div key={connection.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <StatusIcon className={`h-5 w-5 ${getStatusColor(connection.status)}`} />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {connection.connectionLabel || connection.institutionName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {connection.provider} • {connection.institutionName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        connection.status === 'active' ? 'bg-green-100 text-green-800' :
                        connection.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        connection.status === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {connection.status}
                      </span>
                    </div>
                  </div>

                  {connection.failureReason && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                      {connection.failureReason}
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">Created:</span>
                      <span className="ml-1">{new Date(connection.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="font-medium">Last Sync:</span>
                      <span className="ml-1">
                        {connection.lastSyncedAt ? new Date(connection.lastSyncedAt).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Active Tokens:</span>
                      <span className="ml-1">{connectionTokens.length}</span>
                    </div>
                    <div>
                      <span className="font-medium">Provider:</span>
                      <span className="ml-1 capitalize">{connection.provider}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSyncConnection(connection.id)}
                      disabled={syncing === connection.id}
                      className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors text-sm disabled:opacity-50"
                    >
                      <RefreshCw className={`h-4 w-4 mr-1 ${syncing === connection.id ? 'animate-spin' : ''}`} />
                      Sync
                    </button>
                    <button
                      onClick={() => handleIssueToken(connection.id)}
                      className="flex items-center px-3 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors text-sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Issue Token
                    </button>
                    <button
                      onClick={() => handleRevokeConnection(connection.id)}
                      className="flex items-center px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors text-sm"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Revoke
                    </button>
                  </div>

                  {/* Tokens for this connection */}
                  {connectionTokens.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h5 className="font-medium text-gray-900 mb-2">Active Tokens</h5>
                      <div className="space-y-2">
                        {connectionTokens.map((token) => (
                          <div key={token.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <span className="text-sm font-medium text-gray-900">{token.secretFragment}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                Expires: {new Date(token.expiresAt).toLocaleDateString()}
                              </span>
                            </div>
                            <button
                              onClick={() => handleRevokeToken(token.id)}
                              className="text-xs text-red-600 hover:text-red-800"
                            >
                              Revoke
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bank Integration Guide */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Integration Guide</h2>
            <p className="text-sm text-gray-600">How to connect your bank accounts securely</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Create Connection</h4>
            <p className="text-sm text-gray-600">
              Add your bank using our secure connection flow. We only request read-only access.
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Issue Tokens</h4>
            <p className="text-sm text-gray-600">
              Generate secure tokens for data access. Tokens expire automatically and can be revoked anytime.
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 font-bold">3</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Sync Data</h4>
            <p className="text-sm text-gray-600">
              Your transactions and balances sync automatically. Review and categorize as needed.
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">🔒 Security & Privacy</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• All connections use bank-level encryption and read-only access</li>
            <li>• Tokens rotate automatically and can be revoked instantly</li>
            <li>• No account credentials are stored on our servers</li>
            <li>• All data remains in your tenant's isolated database</li>
          </ul>
        </div>
      </div>

      {/* Token Management */}
      {tokens.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <RefreshCw className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Access Tokens</h2>
              <p className="text-sm text-gray-600">Manage API tokens for bank data access</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Token</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Connection</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scope</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tokens.map((token) => {
                  const connection = connections.find(c => c.id === token.connectionId);
                  const isExpired = new Date(token.expiresAt) < new Date();
                  const isRevoked = Boolean(token.revokedAt);
                  
                  return (
                    <tr key={token.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-gray-900">
                        {token.secretFragment}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {connection?.institutionName || 'Unknown'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {token.scope.join(', ')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(token.expiresAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          isRevoked ? 'bg-gray-100 text-gray-800' :
                          isExpired ? 'bg-red-100 text-red-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {isRevoked ? 'Revoked' : isExpired ? 'Expired' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {!isRevoked && !isExpired && (
                          <button
                            onClick={() => handleRevokeToken(token.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankIntegrationSettings;