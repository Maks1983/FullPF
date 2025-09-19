import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { PaycheckInfo } from '../../types/current';

interface AvailableMoneyCardProps {
  totalAvailable: number;
  netLeftover: number;
  paycheckInfo: PaycheckInfo;
  monthlyExpenses: number;
  upcomingPayments?: Array<{ amount: number; status: string }>;
  onViewDetails?: () => void;
}

const AvailableMoneyCard: React.FC<AvailableMoneyCardProps> = ({
  totalAvailable,
  netLeftover,
  paycheckInfo,
  monthlyExpenses,
  upcomingPayments = [],
  onViewDetails
}) => {
  const normalizedMonthlyExpenses = monthlyExpenses > 0 ? monthlyExpenses : 0;

  const getUserFinancialThresholds = (availableBalance: number, expenseBaseline: number) => {
    if (expenseBaseline <= 0) {
      const fallback = Math.max(availableBalance, 1);
      return {
        comfortable: fallback,
        adequate: fallback * 0.75,
        tight: fallback * 0.25,
        critical: fallback * 0.1,
      };
    }

    const monthlyBurnRate = expenseBaseline / 30;
    const emergencyFundTarget = monthlyBurnRate * 90;

    return {
      comfortable: emergencyFundTarget * 0.8,
      adequate: emergencyFundTarget * 0.5,
      tight: monthlyBurnRate * 7,
      critical: monthlyBurnRate * 3,
    };
  };

  const thresholds = getUserFinancialThresholds(totalAvailable, normalizedMonthlyExpenses);

  const totalDaysInMonth = 30;
  const clampedDaysUntilPaycheck = Math.max(Math.min(paycheckInfo.daysUntilPaycheck, totalDaysInMonth), 0);
  const progress = totalDaysInMonth > 0
    ? ((totalDaysInMonth - clampedDaysUntilPaycheck) / totalDaysInMonth) * 100
    : 0;

  const upcomingPaymentsTotal = upcomingPayments
    .filter(payment => payment.status !== 'paid')
    .reduce((sum, payment) => sum + Math.abs(payment.amount), 0);

  const getFinancialStatus = (amount: number) => {
    if (amount >= thresholds.comfortable) return { color: 'text-green-400', ring: '' };
    if (amount >= thresholds.adequate) return { color: 'text-blue-400', ring: '' };
    if (amount >= thresholds.tight) return { color: 'text-yellow-400', ring: 'ring-2 ring-yellow-400' };
    if (amount >= thresholds.critical) return { color: 'text-orange-400', ring: 'ring-2 ring-orange-400' };
    return { color: 'text-red-400', ring: 'ring-2 ring-red-400' };
  };

  const statusStyle = getFinancialStatus(totalAvailable);
  const netAfterUpcoming = Number.isFinite(netLeftover) ? netLeftover : totalAvailable - upcomingPaymentsTotal;

  const primaryMessage = (() => {
    if (totalAvailable >= thresholds.comfortable) return '💪 Strong financial position';
    if (totalAvailable >= thresholds.adequate) return '👍 Adequate reserves';
    if (totalAvailable >= thresholds.tight) return '⚠️ Getting tight';
    return '🚨 Critical - need attention';
  })();

  return (
    <div
      className={`bg-gradient-to-br from-slate-700 to-slate-800 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer group relative ${
        statusStyle.ring
      }`}
      onClick={onViewDetails}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-xs text-slate-300 mb-1">
            Available Balance (in NOK)
          </div>
          <div className={`text-2xl font-bold mb-1 ${
            totalAvailable < 0 ? 'text-red-400' : 'text-white'
          }`}>
            {totalAvailable < 0 ? '-' : ''}{Math.abs(totalAvailable).toLocaleString('no-NO', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })}
          </div>
          <div className="text-xs text-slate-400">
            Net after upcoming bills: {netAfterUpcoming.toLocaleString('no-NO', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })}
          </div>
        </div>

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
                strokeDasharray={`${Math.max(0, Math.min(progress, 100))}, 100`}
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

      <div className="mt-3 pt-3 border-t border-slate-600">
        <div className="text-xs text-slate-400 mt-1">
          {primaryMessage}
        </div>
      </div>

      <div className="flex items-center justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs text-slate-400 mr-2">View details</span>
        <ChevronRight className="h-4 w-4 text-slate-400" />
      </div>
    </div>
  );
};

export default AvailableMoneyCard;
