import React from 'react';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';

interface NetCashflowCardProps {
  monthlyIncome: number;
  monthlyExpenses: number;
  onClick: () => void;
}

const NetCashflowCard: React.FC<NetCashflowCardProps> = ({
  monthlyIncome,
  monthlyExpenses,
  onClick
}) => {
  const netCashflow = monthlyIncome - monthlyExpenses;
  const isPositive = netCashflow >= 0;
  const cashflowPercentage = monthlyIncome > 0 ? Math.abs(netCashflow / monthlyIncome) * 100 : 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="h-full w-full rounded-lg border border-gray-200 bg-slate-50 p-4 text-left transition hover:border-slate-300 hover:bg-white"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            {isPositive ? (
              <TrendingUp className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            ) : (
              <TrendingDown className="h-5 w-5 text-amber-600" aria-hidden="true" />
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Net cashflow</p>
            <p className={`text-2xl font-semibold ${isPositive ? 'text-emerald-600' : 'text-amber-600'}`}>
              {isPositive ? '+' : '-'}NOK {Math.abs(netCashflow).toLocaleString('no-NO', { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-500">
        <div>
          <p className="font-medium text-slate-500">Money in</p>
          <p className="text-base font-semibold text-gray-900">NOK {monthlyIncome.toLocaleString('no-NO', { maximumFractionDigits: 0 })}</p>
        </div>
        <div>
          <p className="font-medium text-slate-500">Money out</p>
          <p className="text-base font-semibold text-gray-900">NOK {monthlyExpenses.toLocaleString('no-NO', { maximumFractionDigits: 0 })}</p>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Savings rate: {cashflowPercentage.toFixed(1)}%
      </p>
    </button>
  );
};

export default NetCashflowCard;
