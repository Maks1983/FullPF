import React from 'react';
import { Wallet, AlertTriangle, TrendingDown, Clock, TrendingUp, ChevronRight } from 'lucide-react';
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
  
  // Dynamic thresholds based on user's financial context
  const getUserFinancialThresholds = (totalAvailable: number, monthlyExpenses: number) => {
    const monthlyBurnRate = monthlyExpenses / 30;
    const emergencyFundTarget = monthlyBurnRate * 90; // 3 months expenses
    
    return {
      comfortable: emergencyFundTarget * 0.8, // 80% of 3-month emergency fund
      adequate: emergencyFundTarget * 0.5,    // 50% of 3-month emergency fund
      tight: monthlyBurnRate * 7,             // 1 week of expenses
      critical: monthlyBurnRate * 3           // 3 days of expenses
    };
  };
  
  // Calculate average monthly expenses from spending categories (if available)
  const estimatedMonthlyExpenses = 35000; // This would come from props/context
  const thresholds = getUserFinancialThresholds(totalAvailable, estimatedMonthlyExpenses);
  
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

  // Dynamic status determination
  const getFinancialStatus = (amount: number) => {
    if (amount >= thresholds.comfortable) return { color: 'text-green-400', ring: '' };
    if (amount >= thresholds.adequate) return { color: 'text-blue-400', ring: '' };
    if (amount >= thresholds.tight) return { color: 'text-yellow-400', ring: 'ring-2 ring-yellow-400' };
    if (amount >= thresholds.critical) return { color: 'text-orange-400', ring: 'ring-2 ring-orange-400' };
    return { color: 'text-red-400', ring: 'ring-2 ring-red-400' };
  };
  
  const statusStyle = getFinancialStatus(Math.abs(currentSaldo));

  return (
    <div 
      className={`bg-gradient-to-br from-slate-700 to-slate-800 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer group relative ${
      statusStyle.ring
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
            Net Available: {totalAvailable.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400">
            NOK {upcomingPaymentsTotal.toLocaleString()} in {remainingPaymentsCount} remaining payments
          </div>
        </div>
        
        {/* Right side - Circular progress */}
        <div className="relative">
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
        {/* Dynamic status message */}
        <div className="text-xs text-slate-400 mt-1">
          {Math.abs(currentSaldo) >= thresholds.comfortable && '💪 Strong financial position'}
          {Math.abs(currentSaldo) >= thresholds.adequate && Math.abs(currentSaldo) < thresholds.comfortable && '👍 Adequate reserves'}
          {Math.abs(currentSaldo) >= thresholds.tight && Math.abs(currentSaldo) < thresholds.adequate && '⚠️ Getting tight'}
          {Math.abs(currentSaldo) < thresholds.tight && '🚨 Critical - need attention'}
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
