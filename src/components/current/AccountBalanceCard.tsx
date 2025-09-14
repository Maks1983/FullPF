import React from 'react';
import { Wallet, CreditCard, PiggyBank, AlertTriangle } from 'lucide-react';
import type { CurrentBalance } from '../../types/current';

interface AccountBalanceCardProps {
  account: CurrentBalance;
}

const AccountBalanceCard: React.FC<AccountBalanceCardProps> = ({ account }) => {
  const getIcon = () => {
    switch (account.type) {
      case 'checking': return Wallet;
      case 'savings': return PiggyBank;
      case 'credit': return CreditCard;
      default: return Wallet;
    }
  };

  const getColorClasses = () => {
    if (account.type === 'credit') {
      return {
        bg: 'bg-orange-50',
        icon: 'text-orange-600',
        border: 'border-orange-200'
      };
    }
    if (account.balance < 1000 && account.type === 'checking') {
      return {
        bg: 'bg-red-50',
        icon: 'text-red-600',
        border: 'border-red-200'
      };
    }
    return {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      border: 'border-blue-200'
    };
  };

  const Icon = getIcon();
  const colors = getColorClasses();
  const isLowBalance = account.balance < 1000 && account.type === 'checking';

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border ${colors.border} hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`p-3 rounded-xl ${colors.bg}`}>
            <Icon className={`h-6 w-6 ${colors.icon}`} />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-gray-900">{account.account}</h3>
            <p className="text-sm text-gray-600 capitalize">{account.type}</p>
          </div>
        </div>
        {isLowBalance && (
          <AlertTriangle className="h-5 w-5 text-red-500" />
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Balance</span>
          <span className={`text-xl font-bold ${
            account.balance >= 0 ? 'text-gray-900' : 'text-red-600'
          }`}>
            NOK {Math.abs(account.balance).toLocaleString()}
            {account.balance < 0 && ' CR'}
          </span>
        </div>

        {account.type === 'credit' && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Available</span>
            <span className="font-semibold text-green-600">
              NOK {account.available.toLocaleString()}
            </span>
          </div>
        )}

        {account.pending !== 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Pending</span>
            <span className={`font-medium ${
              account.pending > 0 ? 'text-green-600' : 'text-orange-600'
            }`}>
              {account.pending > 0 ? '+' : ''}NOK {account.pending.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {isLowBalance && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-700">
            ⚠️ Low balance - consider transferring funds
          </p>
        </div>
      )}
    </div>
  );
};

export default AccountBalanceCard;