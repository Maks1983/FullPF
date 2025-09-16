import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { CurrentAccount, PaycheckInfo } from '../../types/current';

interface AvailableMoneyCardProps {
  accounts: CurrentAccount[];
  totalAvailable: number;
  netLeftover: number;
  paycheckInfo: PaycheckInfo;
  upcomingPayments?: Array<{ amount: number; status: string }>;
  onViewDetails?: () => void;
}

const AvailableMoneyCard: React.FC<AvailableMoneyCardProps> = ({
  accounts,
  totalAvailable,
  netLeftover,
  paycheckInfo,
  upcomingPayments = [],
  onViewDetails
}) => {
  const isDeficit = netLeftover < 0;
  
  // Calculate sum of upcoming payments and count
  const upcomingPaymentsTotal = upcomingPayments
    .filter(payment => payment.status !== 'paid')
    .reduce((sum, payment) => sum + Math.abs(payment.amount), 0);
  const remainingPaymentsCount = upcomingPayments.filter(payment => payment.status !== 'paid').length;
  
  // Calculate progress for countdown donut (days until paycheck)
  const totalDaysInMonth = 30; // Approximate
  const progress = ((totalDaysInMonth - paycheckInfo.daysUntilPaycheck) / totalDaysInMonth) * 100;

  return (
    <div 
      className={`bg-gradient-to-br from-slate-700 to-slate-800 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group relative ${
        isDeficit ? 'ring-2 ring-red-400' : 'ring-2 ring-green-400'
      }`}
      onClick={onViewDetails}
    >
      <div className="flex items-center justify-between">
        {/* Left side - Hero number and supporting context */}
        <div className="flex-1">
          {/* Hero Number - Net Available */}
          <div className="mb-4">
            <div className="text-sm text-slate-300 mb-1">
              Net Available (after obligations)
            </div>
            <div className={`text-4xl font-bold mb-2 ${
              isDeficit ? 'text-red-400' : 'text-green-400'
            }`}>
              {netLeftover < 0 ? '-' : ''}{Math.abs(netLeftover).toLocaleString('no-NO', { 
                minimumFractionDigits: 0,
                maximumFractionDigits: 0 
              })} NOK
            </div>
          </div>
          
          {/* Supporting Context */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Current Balance:</span>
              <span className="text-sm font-medium text-white">
                {totalAvailable.toLocaleString('no-NO', { 
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0 
                })} NOK
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Upcoming Payments:</span>
              <span className="text-sm font-medium text-red-300">
                −{upcomingPaymentsTotal.toLocaleString('no-NO', { 
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0 
                })} NOK ({remainingPaymentsCount} payments)
              </span>
            </div>
          </div>
          
          {/* Optional Tagline */}
          <div className="mt-4 pt-3 border-t border-slate-600">
            <div className="text-xs text-slate-400">
              {isDeficit 
                ? `Shortfall: ${Math.abs(netLeftover).toLocaleString('no-NO')} NOK`
                : `Safe to spend: ${netLeftover.toLocaleString('no-NO')} NOK`
              }
            </div>
          </div>
        </div>
        
        {/* Right side - Countdown donut */}
        <div className="relative ml-4">
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
                className={isDeficit ? "text-red-400" : "text-green-400"}
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

      {/* Hover indicator */}
      <div className="flex items-center justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs text-slate-400 mr-2">View details</span>
        <ChevronRight className="h-4 w-4 text-slate-400" />
      </div>
    </div>
  );
};

export default AvailableMoneyCard;