import React from 'react';
import { Wallet, AlertTriangle, TrendingDown, Clock, TrendingUp, ChevronRight, Eye } from 'lucide-react';
import type { CurrentAccount, PaycheckInfo } from '../../types/current';

interface AvailableMoneyCardProps {
  accounts: CurrentAccount[];
  totalAvailable: number;
  netLeftover: number;
  paycheckInfo: PaycheckInfo;
  upcomingPayments?: Array<{ amount: number; status: string }>;
  onViewDetails?: () => void;
  onViewAccounts?: () => void;
}

const AvailableMoneyCard: React.FC<AvailableMoneyCardProps> = ({
  accounts,
  totalAvailable,
  netLeftover,
  paycheckInfo,
  upcomingPayments = [],
  onViewDetails,
  onViewAccounts
}) => {
  const isDeficit = netLeftover < 0;
  
  // Calculate progress for circular indicator (days until paycheck)
  const totalDaysInMonth = 30; // Approximate
  const progress = ((totalDaysInMonth - paycheckInfo.daysUntilPaycheck) / totalDaysInMonth) * 100;
  
  // Calculate sum of upcoming payments and count
  const upcomingPaymentsTotal = upcomingPayments
    .filter(payment => payment.status !== 'paid')
    .reduce((sum, payment) => sum + Math.abs(payment.amount), 0);
  const remainingPaymentsCount = upcomingPayments.filter(payment => payment.status !== 'paid').length;
  
  // Calculate current saldo: net after payments + upcoming payments
  const currentSaldo = totalAvailable + upcomingPaymentsTotal;

  return (
    <div 
      className={`bg-gradient-to-br from-slate-700 to-slate-800 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer group relative ${
      isDeficit ? 'ring-2 ring-red-400' : ''
    }`}
      onClick={onViewDetails}
    >
      {/* Compact layout */}
      <div className="flex items-center justify-between">
        {/* Left side - Main info */}
        <div className="flex-1">
          <div className="text-xs text-slate-300 mb-1">
            Available Balance (in NOK)
          </div>
          <div className={`text-2xl font-bold mb-1 ${
            currentSaldo < 0 ? 'text-red-400' : 'text-white'
          }`}>
            {currentSaldo < 0 ? '-' : ''}{Math.abs(currentSaldo).toLocaleString('no-NO', { 
              minimumFractionDigits: 0,
              maximumFractionDigits: 0 
            })}
          </div>
          <div className="text-xs text-slate-400">
            -{upcomingPaymentsTotal.toLocaleString()} in {remainingPaymentsCount} payments
          </div>
        </div>
        
        {/* Right side - Circular progress */}
        <div className="relative ml-4">
          <div className="w-16 h-16">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-600"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
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
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-lg font-bold text-white">
                {paycheckInfo.daysUntilPaycheck}
              </div>
              <div className="text-xs text-slate-300">
                {paycheckInfo.daysUntilPaycheck === 1 ? 'day' : 'days'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom info */}
      <div className="mt-3 pt-3 border-t border-slate-600">
        <div className="text-sm font-medium text-white">
          Available: {totalAvailable < 0 ? '-' : ''}{Math.abs(totalAvailable).toLocaleString('no-NO', { 
            minimumFractionDigits: 0,
            maximumFractionDigits: 0 
          })}
        </div>
      </div>

      {/* Hover indicator */}
      <div className="flex items-center justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center space-x-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onViewAccounts?.();
            }}
            className="flex items-center text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Eye className="h-3 w-3 mr-1" />
            Accounts
          </button>
          <span className="text-xs text-slate-400">|</span>
          <span className="text-xs text-slate-400 mr-2">Income/Expenses</span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </div>
      </div>
    </div>
  );
};

export default AvailableMoneyCard;