import React from 'react';
import { Wallet, AlertTriangle, TrendingDown, Clock } from 'lucide-react';
import type { CurrentAccount, PaycheckInfo } from '../../types/current';

interface AvailableMoneyCardProps {
  accounts: CurrentAccount[];
  totalAvailable: number;
  netLeftover: number;
  paycheckInfo: PaycheckInfo;
}

const AvailableMoneyCard: React.FC<AvailableMoneyCardProps> = ({
  accounts,
  totalAvailable,
  netLeftover,
  paycheckInfo
}) => {
  const isDeficit = netLeftover < 0;
  const checkingBalance = accounts.find(acc => acc.type === 'checking')?.availableBalance || 0;
  const savingsBalance = accounts.find(acc => acc.type === 'savings')?.availableBalance || 0;
  const creditAvailable = accounts.find(acc => acc.type === 'credit')?.availableBalance || 0;

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border-2 transition-all hover:shadow-md ${
      isDeficit ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl ${isDeficit ? 'bg-red-100' : 'bg-blue-100'}`}>
            <Wallet className={`h-6 w-6 ${isDeficit ? 'text-red-600' : 'text-blue-600'}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Available Money</h3>
            <p className="text-sm text-gray-600">Immediately accessible funds</p>
          </div>
        </div>
        {isDeficit && <AlertTriangle className="h-6 w-6 text-red-500" />}
      </div>

      {/* Total Available */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">Total Available Now</p>
        <p className="text-3xl font-bold text-gray-900">
          NOK {totalAvailable.toLocaleString()}
        </p>
      </div>

      {/* Account Breakdown */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-white rounded-lg border">
          <p className="text-sm text-gray-600 mb-1">Checking</p>
          <p className="font-semibold text-blue-600">
            NOK {checkingBalance.toLocaleString()}
          </p>
        </div>
        <div className="text-center p-3 bg-white rounded-lg border">
          <p className="text-sm text-gray-600 mb-1">Savings</p>
          <p className="font-semibold text-green-600">
            NOK {savingsBalance.toLocaleString()}
          </p>
        </div>
        <div className="text-center p-3 bg-white rounded-lg border">
          <p className="text-sm text-gray-600 mb-1">Credit</p>
          <p className="font-semibold text-purple-600">
            NOK {creditAvailable.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Net Leftover Until Paycheck */}
      <div className={`p-4 rounded-lg border-2 ${
        isDeficit ? 'border-red-200 bg-red-100' : 'border-green-200 bg-green-100'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Clock className={`h-4 w-4 ${isDeficit ? 'text-red-600' : 'text-green-600'}`} />
            <span className="text-sm font-medium text-gray-900">
              Net Leftover Until Paycheck
            </span>
          </div>
          {isDeficit && <TrendingDown className="h-4 w-4 text-red-500" />}
        </div>
        
        <div className="flex items-center justify-between">
          <p className={`text-2xl font-bold ${isDeficit ? 'text-red-600' : 'text-green-600'}`}>
            NOK {netLeftover.toLocaleString()}
          </p>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              {paycheckInfo.daysUntilPaycheck} days left
            </p>
            <p className="text-xs text-gray-500">
              Next: {new Date(paycheckInfo.nextPaycheckDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {isDeficit && (
          <div className="mt-3 p-2 bg-red-200 rounded text-sm text-red-800">
            ⚠️ Projected deficit! Consider reducing expenses or using credit/savings.
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableMoneyCard;