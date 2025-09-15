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
  
  // Calculate remaining payments count from upcoming payments
  const remainingPaymentsCount = 5; // This should come from upcomingPayments prop when available

  return (
    <div className={`bg-gradient-to-br from-slate-700 to-slate-800 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group ${
      isDeficit ? 'ring-2 ring-red-400' : ''
    }`}>
      <div className="flex items-start justify-between">
        {/* Left side - Main content */}
        <div className="flex-1">
          <div className="text-sm text-slate-300 mb-1">
            Left over until next payday
          </div>
          
          <div className={`text-4xl font-bold mb-3 ${
            isDeficit ? 'text-red-400' : 'text-white'
          }`}>
            NOK {totalAvailable.toLocaleString('no-NO', { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
            })}
          </div>
          
          <div className="text-sm text-slate-400">
            {isDeficit ? 
              `NOK ${Math.abs(netLeftover).toLocaleString()} in ${remainingPaymentsCount} remaining payments to pay` :
              `After all scheduled payments`
            }
          </div>
        </div>

        {/* Right side - Circular progress */}
        <div className="relative">
          <div className="w-20 h-20">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {/* Background circle */}
              <path
                className="text-slate-600"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Progress circle */}
              <path
                className="text-blue-400"
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
              <div className="text-2xl font-bold text-white">
                {paycheckInfo.daysUntilPaycheck}
              </div>
              <div className="text-xs text-slate-300">
                {paycheckInfo.daysUntilPaycheck === 1 ? 'day' : 'days'}
              </div>
              <div className="text-xs text-slate-400">
                to pay
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover indicator */}
      <div className="flex items-center justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs text-slate-400 mr-2">View details</span>
        <ChevronRight className="h-4 w-4 text-slate-400" />
      </div>
    </div>
  );
};

export default AvailableMoneyCard;