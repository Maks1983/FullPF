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
  const totalDaysInMonth = 30; // Approximate
  const progress = ((totalDaysInMonth - paycheckInfo.daysUntilPaycheck) / totalDaysInMonth) * 100;
  
  // Calculate remaining payments total
  const remainingPayments = Math.abs(netLeftover - totalAvailable);

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all cursor-pointer group ${
      isDeficit ? 'border-red-200' : 'border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Wallet className="h-5 w-5 text-blue-600" />
          <h3 className="text-sm font-medium text-gray-500">Left over until next payday</h3>
        </div>
        {isDeficit && (
          <AlertTriangle className="h-5 w-5 text-red-500" />
        )}
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-between">
        {/* Left side - Financial info */}
        <div className="flex-1">
          <div className="text-sm text-gray-600 mb-1">
            Available: NOK {totalAvailable.toLocaleString()}
          </div>
          
          <div className={`text-3xl font-bold mb-2 ${
            netLeftover >= 0 ? 'text-gray-900' : 'text-red-600'
          }`}>
            NOK {Math.abs(netLeftover).toLocaleString('no-NO', { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
            })}
          </div>
          
          <div className="text-sm text-gray-500">
            {isDeficit ? 
              `${Math.ceil(remainingPayments / 1000)}k remaining payments` :
              `After all scheduled payments`
            }
          </div>
        </div>

        {/* Right side - Circular progress */}
        <div className="flex items-center justify-center ml-6">
          <div className="relative w-24 h-24">
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
              <div className="text-xl font-bold text-gray-900">
                {paycheckInfo.daysUntilPaycheck}
              </div>
              <div className="text-xs text-gray-500">
                {paycheckInfo.daysUntilPaycheck === 1 ? 'day' : 'days'}
              </div>
              <div className="text-xs text-gray-400">
                to pay
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover indicator */}
      <div className="flex items-center justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs text-gray-400 mr-2">View details</span>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};

export default AvailableMoneyCard;