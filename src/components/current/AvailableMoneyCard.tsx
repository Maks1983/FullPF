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
  
  // Calculate net change (mock data - in real app this would come from props)
  const previousTotalAvailable = 17250; // This would be passed as prop
  const netChange = totalAvailable - previousTotalAvailable;
  const netChangePercent = ((netChange / previousTotalAvailable) * 100);
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
    <div className={`bg-white p-6 rounded-xl shadow-sm border-2 transition-all hover:shadow-lg cursor-pointer group ${
      isDeficit ? 'border-red-200 hover:border-red-300' : 'border-blue-200 hover:border-blue-300'
    }`}
      onClick={onViewDetails}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Your Money Overview</h3>
          <p className="text-sm text-gray-600">Complete financial position until payday</p>
        </div>
        <div className="flex items-center space-x-2">
          {isDeficit && <AlertTriangle className="h-5 w-5 text-red-500" />}
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
      </div>
      
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
      
      {/* Main Financial Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Available Now */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Available Now</p>
          <p className="text-2xl font-bold text-green-600">
            NOK {totalAvailable.toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">
          </p>
        </div>
      </div>
      
      {/* Bottom info */}
      <div className="mt-3 pt-3 border-t border-slate-600">
        {/* Dynamic status message */}
        <div className="text-xs text-slate-400 mt-1">
          {Math.abs(currentSaldo) >= thresholds.tight && Math.abs(currentSaldo) < thresholds.adequate && '⚠️ Getting tight'}
          {Math.abs(currentSaldo) < thresholds.tight && '🚨 Critical - need attention'}
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
