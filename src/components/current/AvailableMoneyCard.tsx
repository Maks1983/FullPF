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

const formatNumber = (value: number) =>
  value.toLocaleString('no-NO', { maximumFractionDigits: 0 });

const AvailableMoneyCard: React.FC<AvailableMoneyCardProps> = ({
  totalAvailable,
  netLeftover,
  paycheckInfo,
  monthlyExpenses,
  upcomingPayments = [],
  onViewDetails
}) => {
  const normalizedMonthlyExpenses = monthlyExpenses > 0 ? monthlyExpenses : 0;

  const upcomingPaymentsTotal = upcomingPayments
    .filter(payment => payment.status !== 'paid')
    .reduce((sum, payment) => sum + Math.abs(payment.amount), 0);

  const netAfterUpcoming = Number.isFinite(netLeftover)
    ? netLeftover
    : totalAvailable - upcomingPaymentsTotal;

  const dailyBudget = paycheckInfo.daysUntilPaycheck > 0
    ? netAfterUpcoming / paycheckInfo.daysUntilPaycheck
    : netAfterUpcoming;

  const monthlyBurnRate = normalizedMonthlyExpenses > 0 ? normalizedMonthlyExpenses / 30 : 0;

  return (
    <button
      type="button"
      onClick={onViewDetails}
      className="group h-full w-full rounded-lg border border-gray-200 bg-slate-50 p-4 text-left transition hover:border-slate-300 hover:bg-white"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Available balance</p>
          <p className={`text-2xl font-semibold ${totalAvailable < 0 ? 'text-amber-600' : 'text-gray-900'}`}>
            NOK {formatNumber(Math.abs(totalAvailable))}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            After upcoming bills: NOK {formatNumber(netAfterUpcoming)}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-400 opacity-0 transition group-hover:opacity-100" aria-hidden="true" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-600">
        <div>
          <p className="font-medium text-slate-500">Days to payday</p>
          <p className="text-base font-semibold text-gray-900">{paycheckInfo.daysUntilPaycheck}</p>
        </div>
        <div>
          <p className="font-medium text-slate-500">Daily allowance</p>
          <p className={`text-base font-semibold ${dailyBudget >= monthlyBurnRate ? 'text-emerald-600' : 'text-amber-600'}`}>
            NOK {formatNumber(Math.max(dailyBudget, 0))}
          </p>
        </div>
      </div>
    </button>
  );
};

export default AvailableMoneyCard;
