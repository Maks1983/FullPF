import React from 'react';
import { X, Wallet, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import type { CurrentAccount } from '../../types/current';

interface AccountBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: CurrentAccount[];
}

const AccountBalanceModal: React.FC<AccountBalanceModalProps> = ({
  isOpen,
  onClose,
  accounts
}) => {
  if (!isOpen) return null;

  const titleId = React.useId();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const totalBalance = accounts.reduce((sum, acc) => 
    sum + (acc.type === 'credit' ? acc.availableBalance : acc.balance), 0
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'low': return AlertTriangle;
      case 'overdrawn': return AlertTriangle;
      case 'frozen': return Clock;
      default: return CheckCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'low': return 'text-yellow-600';
      case 'overdrawn': return 'text-red-600';
      case 'frozen': return 'text-gray-600';
      default: return 'text-green-600';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wallet className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 id={titleId} className="text-xl font-bold text-gray-900">Account Balances</h2>
              <p className="text-sm text-gray-600">
                Total: NOK {totalBalance.toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Account Summary */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                NOK {accounts.filter(acc => acc.type !== 'credit')
                  .reduce((sum, acc) => sum + acc.balance, 0)
                  .toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Deposit Accounts</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                NOK {accounts.filter(acc => acc.type === 'credit')
                  .reduce((sum, acc) => sum + acc.availableBalance, 0)
                  .toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Available Credit</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {accounts.length}
              </div>
              <p className="text-sm text-gray-600">Total Accounts</p>
            </div>
          </div>
        </div>

        {/* Accounts List */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {accounts.map((account) => {
              const StatusIcon = getStatusIcon(account.status);
              
              return (
                <div key={account.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <StatusIcon className={`h-5 w-5 ${getStatusColor(account.status)}`} />
                      <div>
                        <h4 className="font-medium text-gray-900">{account.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{account.type} account</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        NOK {account.balance.toLocaleString()}
                      </p>
                      {account.type === 'credit' && (
                        <p className="text-sm text-gray-600">
                          Available: NOK {account.availableBalance.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        account.status === 'active' ? 'bg-green-100 text-green-800' :
                        account.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {account.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <span>Updated: {new Date(account.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {/* Additional account details */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {account.type === 'credit' && account.creditLimit && (
                        <>
                          <div>
                            <span className="text-gray-600">Credit Limit:</span>
                            <span className="ml-2 font-medium">NOK {account.creditLimit.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Utilization:</span>
                            <span className="ml-2 font-medium">
                              {((Math.abs(account.balance) / account.creditLimit) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </>
                      )}
                      {account.minimumBalance && (
                        <div>
                          <span className="text-gray-600">Minimum Balance:</span>
                          <span className="ml-2 font-medium">NOK {account.minimumBalance.toLocaleString()}</span>
                        </div>
                      )}
                      {account.overdraftLimit && (
                        <div>
                          <span className="text-gray-600">Overdraft Limit:</span>
                          <span className="ml-2 font-medium">NOK {account.overdraftLimit.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {accounts.length} account{accounts.length !== 1 ? 's' : ''}
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
              Export Data
            </button>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountBalanceModal;
