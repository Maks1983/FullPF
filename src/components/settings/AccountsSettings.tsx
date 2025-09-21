import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Eye, EyeOff, CreditCard, PiggyBank, Wallet } from 'lucide-react';

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  isActive: boolean;
  bankName?: string;
  accountNumber?: string;
  interestRate?: number;
  creditLimit?: number;
}

interface AccountsSettingsProps {
  onChanged: () => void;
}

const AccountsSettings: React.FC<AccountsSettingsProps> = ({ onChanged }) => {
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: 'acc1',
      name: 'Main Checking',
      type: 'checking',
      balance: 15420,
      isActive: true,
      bankName: 'DNB',
      accountNumber: '****1234'
    },
    {
      id: 'acc2',
      name: 'High Yield Savings',
      type: 'savings',
      balance: 82000,
      isActive: true,
      bankName: 'Nordea',
      accountNumber: '****5678',
      interestRate: 4.2
    },
    {
      id: 'acc3',
      name: 'Emergency Fund',
      type: 'savings',
      balance: 47200,
      isActive: true,
      bankName: 'Nordea',
      accountNumber: '****9012',
      interestRate: 3.8
    },
    {
      id: 'acc4',
      name: 'Credit Card',
      type: 'credit',
      balance: -18500,
      isActive: true,
      bankName: 'SEB',
      accountNumber: '****3456',
      creditLimit: 25000
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [showBalances, setShowBalances] = useState(false);

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking': return Wallet;
      case 'savings': return PiggyBank;
      case 'credit': return CreditCard;
      case 'investment': return CreditCard;
      default: return Wallet;
    }
  };

  const getAccountColor = (type: string) => {
    switch (type) {
      case 'checking': return 'text-blue-600 bg-blue-100';
      case 'savings': return 'text-green-600 bg-green-100';
      case 'credit': return 'text-red-600 bg-red-100';
      case 'investment': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleToggleAccount = (id: string) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === id ? { ...acc, isActive: !acc.isActive } : acc
    ));
    onChanged();
  };

  const handleDeleteAccount = (id: string) => {
    if (confirm('Are you sure you want to delete this account?')) {
      setAccounts(prev => prev.filter(acc => acc.id !== id));
      onChanged();
    }
  };

  return (
    <div className="space-y-6">
      {/* Accounts Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Bank Accounts</h2>
              <p className="text-sm text-gray-600">Manage your connected accounts and balances</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowBalances(!showBalances)}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {showBalances ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showBalances ? 'Hide' : 'Show'} Balances
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </button>
          </div>
        </div>

        {/* Accounts List */}
        <div className="space-y-4">
          {accounts.map((account) => {
            const Icon = getAccountIcon(account.type);
            const colorClasses = getAccountColor(account.type);
            
            return (
              <div
                key={account.id}
                className={`p-4 rounded-lg border transition-all ${
                  account.isActive ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${colorClasses}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{account.name}</h4>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span className="capitalize">{account.type}</span>
                        <span>•</span>
                        <span>{account.bankName}</span>
                        <span>•</span>
                        <span>{account.accountNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {showBalances && (
                      <div className="text-right">
                        <p className={`font-semibold ${
                          account.balance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          NOK {Math.abs(account.balance).toLocaleString()}
                        </p>
                        {account.interestRate && (
                          <p className="text-xs text-gray-500">{account.interestRate}% APY</p>
                        )}
                        {account.creditLimit && (
                          <p className="text-xs text-gray-500">
                            Limit: NOK {account.creditLimit.toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingAccount(account.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleAccount(account.id)}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                          account.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {account.isActive ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Account Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {accounts.filter(acc => acc.type === 'checking').length}
              </p>
              <p className="text-sm text-gray-600">Checking</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {accounts.filter(acc => acc.type === 'savings').length}
              </p>
              <p className="text-sm text-gray-600">Savings</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {accounts.filter(acc => acc.type === 'credit').length}
              </p>
              <p className="text-sm text-gray-600">Credit</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {accounts.filter(acc => acc.isActive).length}
              </p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Integration */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <CreditCard className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Bank Integration</h3>
            <p className="text-sm text-gray-600">Connect your bank accounts for automatic updates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">DNB Bank</h4>
            <p className="text-sm text-gray-600 mb-3">Connect your DNB accounts</p>
            <button className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
              Connect DNB
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Nordea</h4>
            <p className="text-sm text-gray-600 mb-3">Connect your Nordea accounts</p>
            <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Connect Nordea
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Other Banks</h4>
            <p className="text-sm text-gray-600 mb-3">SEB, Handelsbanken, etc.</p>
            <button className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
              Connect Other
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-purple-100 rounded-lg">
          <p className="text-sm text-purple-800">
            <strong>Note:</strong> Bank integration requires a Premium license. Automatic transaction import, real-time balances, and smart categorization.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountsSettings;