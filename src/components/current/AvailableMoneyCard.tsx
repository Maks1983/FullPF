import React from 'react';
import { Wallet, AlertTriangle, ChevronRight } from 'lucide-react';
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
  // Calculate net available after upcoming payments
  const upcomingPaymentsTotal = upcomingPayments
    .filter(payment => payment.status !== 'paid')
    .reduce((sum, payment) => sum + Math.abs(payment.amount), 0);
  
  const netAvailable = totalAvailable - upcomingPaymentsTotal;
  const isDeficit = netAvailable < 0;
  
  // Calculate money sustainability (optional stat)
  const monthlyExpenses = 44000; // This would come from props in real implementation
  const dailyBurnRate = monthlyExpenses / 30;
  const daysMoneyLasts = Math.floor(netAvailable / dailyBurnRate);
  
  // Critical alerts - only balance-related
  const hasCriticalAlert = isDeficit || daysMoneyLasts < paycheckInfo.daysUntilPaycheck;
  
  // Calculate progress for circular indicator (days until paycheck)
  const totalDaysInMonth = 30; // Approximate
  const progress = ((totalDaysInMonth - paycheckInfo.daysUntilPaycheck) / totalDaysInMonth) * 100;

  return (
    <div 
      className={`bg-gradient-to-br from-slate-700 to-slate-800 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer group relative ${
      hasCriticalAlert ? 'ring-2 ring-red-400' : ''
    }`}
      onClick={onViewDetails}
    >
      <div className="flex items-center justify-between">
        {/* Left side - Main info */}
        <div className="flex-1">
          <div className="text-xs text-slate-300 mb-1">
            Net Available (in NOK)
          </div>
          <div className={`text-3xl font-bold mb-1 ${
            isDeficit ? 'text-red-400' : 'text-white'
          }`}>
            {isDeficit ? '-' : ''}{Math.abs(netAvailable).toLocaleString('no-NO', { 
              minimumFractionDigits: 0,
              maximumFractionDigits: 0 
            })}
          </div>
          <div className="text-xs text-slate-400">
            What's left after obligations
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
      
      {/* Optional money sustainability stat */}
      {!isDeficit && daysMoneyLasts > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-600">
          <div className="text-sm text-slate-300">
            Money lasts: <span className="font-medium text-white">{daysMoneyLasts} days</span>
            <span className="text-xs text-slate-400 ml-2">at current rate</span>
          </div>
        </div>
      )}
      
      {/* Critical alert - only balance-related */}
      {hasCriticalAlert && (
        <div className="mt-3 pt-3 border-t border-red-400">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">
              {isDeficit ? 'Insufficient funds' : 'Money runs out before payday'}
            </span>
          </div>
        </div>
      )}

      {/* Hover indicator */}
      <div className="flex items-center justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs text-slate-400 mr-2">View details</span>
        <ChevronRight className="h-4 w-4 text-slate-400" />
      </div>
    </div>
  );
};

export default AvailableMoneyCard;
