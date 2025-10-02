import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, AlertTriangle, Clock, RefreshCw, Plus } from 'lucide-react';
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
}

const BankConnectionStatus: React.FC = () => {
  const { canUseBankIntegration } = useLicenseGating();
  const [connections, setConnections] = useState<BankConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);

  useEffect(() => {
    if (canUseBankIntegration) {
      fetchConnections();
    } else {
      setLoading(false);
    }
  }, [canUseBankIntegration]);

  const fetchConnections = async () => {
    try {
      const response = await bankApi.listConnections() as BankConnection[];
      setConnections(response);
    } catch (error) {
      console.error('Failed to fetch bank connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (connectionId: string) => {
    try {
      setSyncing(connectionId);
      await bankApi.syncConnection(connectionId, { status: 'active' });
      await fetchConnections();
    } catch (error) {
      console.error('Failed to sync connection:', error);
    } finally {
      setSyncing(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'pending': return Clock;
      case 'error': return AlertTriangle;
      case 'revoked': return AlertTriangle;
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
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="font-medium text-gray-900">Bank Integration</h3>
            <span className="ml-2 px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">PREMIUM</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Connect your bank accounts for automatic transaction import and real-time balance updates.
        </p>
        <button className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
          Upgrade to Premium
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium text-gray-900">Bank Connections</h3>
        </div>
        <button
          onClick={() => window.location.hash = '#settings/bank-integration'}
          className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors text-sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </button>
      </div>

      {connections.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-sm text-gray-600 mb-2">No bank connections</p>
          <p className="text-xs text-gray-500">Connect your accounts in Settings</p>
        </div>
      ) : (
        <div className="space-y-3">
          {connections.slice(0, 3).map((connection) => {
            const StatusIcon = getStatusIcon(connection.status);
            
            return (
              <div key={connection.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <StatusIcon className={`h-4 w-4 ${getStatusColor(connection.status)}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {connection.connectionLabel || connection.institutionName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {connection.lastSyncedAt 
                        ? `Synced ${new Date(connection.lastSyncedAt).toLocaleDateString()}`
                        : 'Never synced'
                      }
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleSync(connection.id)}
                  disabled={syncing === connection.id}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${syncing === connection.id ? 'animate-spin' : ''}`} />
                </button>
              </div>
            );
          })}
          
          {connections.length > 3 && (
            <p className="text-xs text-gray-500 text-center">
              +{connections.length - 3} more connections
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BankConnectionStatus;