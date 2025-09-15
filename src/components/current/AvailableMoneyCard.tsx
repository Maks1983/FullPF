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
  
  // Calculate progress for circular indicator (days until paycheck)
  const totalDaysInPayPeriod = 30;
  const progress = ((totalDaysInPayPeriod - paycheckInfo.daysUntilPaycheck) / totalDaysInPayPeriod) * 100;
  
  const statusMessage = isDeficit 
    ? `Short by NOK ${Math.abs(netLeftover).toLocaleString()}`
    : `Available until payday`;

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-all ${
      isDeficit ? 'border-red-200 bg-red-50' : 'border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isDeficit ? 'bg-red-100' : 'bg-blue-100'}`}>
            <Wallet className={`h-5 w-5 ${isDeficit ? 'text-red-600' : 'text-blue-600'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Money Available</h3>
            <p className="text-sm text-gray-600">Until next payday</p>
          </div>
        </div>
        {isDeficit && (
          <AlertTriangle className="h-5 w-5 text-red-500" />
        )}
      </div>

      {/* Centered Circular Progress */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-24 h-24">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {/* Background circle */}
              <path
                className="text-gray-200"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Progress circle */}
              <path
                className={isDeficit ? "text-red-500" : "text-blue-500"}
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${progress}, 100`}
                strokeLinecap="round"
                fill="transparent"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-gray-900">
                {paycheckInfo.daysUntilPaycheck}
              </div>
              <div className="text-xs text-gray-600">
                {paycheckInfo.daysUntilPaycheck === 1 ? 'day' : 'days'}
              </div>
              <div className="text-xs text-gray-500">
                to payday
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Total Available</p>
          <p className="text-2xl font-bold text-gray-900">
            NOK {totalAvailable.toLocaleString()}
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">{statusMessage}</p>
          <p className={`text-xl font-bold ${
            isDeficit ? 'text-red-600' : 'text-green-600'
          }`}>
            {isDeficit ? '-' : '+'}NOK {Math.abs(netLeftover).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AvailableMoneyCard;