import React from 'react';
import { Wallet, AlertTriangle, TrendingDown, Clock, TrendingUp, ChevronRight } from 'lucide-react';
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
  
  // Calculate net change (mock data - in real app this would come from props)
  const previousTotalAvailable = 17250; // This would be passed as prop
  const netChange = totalAvailable - previousTotalAvailable;
  const netChangePercent = ((netChange / previousTotalAvailable) * 100);

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border-2 transition-all hover:shadow-lg cursor-pointer group ${
      isDeficit ? 'border-red-200 hover:border-red-300' : 'border-blue-200 hover:border-blue-300'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl ${isDeficit ? 'bg-red-100' : 'bg-blue-100'}`}>
            <Wallet className={`h-6 w-6 ${isDeficit ? 'text-red-600' : 'text-blue-600'}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Your Money Overview</h3>
            <p className="text-sm text-gray-600">Complete financial position until payday</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isDeficit && <AlertTriangle className="h-5 w-5 text-red-500" />}
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
      </div>

      {/* Main Financial Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Available Now */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Available Now</p>
          <p className="text-2xl font-bold text-green-600">
            NOK {totalAvailable.toLocaleString()}
          </p>
          <div className="flex items-center justify-center mt-1">
            {netChange >= 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={`text-xs font-medium ${netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netChange >= 0 ? '+' : ''}NOK {Math.abs(netChange).toLocaleString()}
            </span>
          </div>
        </div>

        {/* After Bills */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">After Bills</p>
          <p className={`text-2xl font-bold ${isDeficit ? 'text-red-600' : 'text-green-600'}`}>
            NOK {netLeftover.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {isDeficit ? 'Deficit projected' : 'Surplus projected'}
          </p>
        </div>

        {/* Next Paycheck */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Next Income</p>
          <p className="text-2xl font-bold text-purple-600">
            {paycheckInfo.daysUntilPaycheck} days
          </p>
          <p className="text-xs text-gray-500 mt-1">
            NOK {paycheckInfo.expectedAmount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Account Breakdown */}
      <div className="grid grid-cols-3 gap-3 mb-4">
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

      {/* Status Summary */}
      <div className={`p-3 rounded-lg border ${
        isDeficit ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className={`h-4 w-4 ${isDeficit ? 'text-red-600' : 'text-green-600'}`} />
            <span className={`text-sm font-medium ${isDeficit ? 'text-red-800' : 'text-green-800'}`}>
              {isDeficit 
                ? `Need NOK ${Math.abs(netLeftover).toLocaleString()} more to cover bills`
                : `NOK ${netLeftover.toLocaleString()} surplus after all bills`
              }
            </span>
          </div>
          <span className="text-xs text-gray-600">
            Until {new Date(paycheckInfo.nextPaycheckDate).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AvailableMoneyCard;