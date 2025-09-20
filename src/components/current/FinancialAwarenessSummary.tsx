import React from 'react';
import { Brain } from 'lucide-react';

interface FinancialAwarenessSummaryProps {
  totalMonthlyIncome: number;
  totalMonthlyExpenses: number;
  biggestExpenseCategory: { name: string; spent: number } | undefined;
  savingsRate: number;
  paycheckDays: number;
  netLeftoverUntilPaycheck: number;
}

const FinancialAwarenessSummary: React.FC<FinancialAwarenessSummaryProps> = ({
  totalMonthlyIncome,
  totalMonthlyExpenses,
  biggestExpenseCategory,
  savingsRate,
  paycheckDays,
  netLeftoverUntilPaycheck
}) => {
  const netResult = totalMonthlyIncome - totalMonthlyExpenses;

  return (
    <div className="space-y-5">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-slate-100 rounded-lg">
          <Brain className="h-5 w-5 text-slate-600" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">Monthly pulse</h3>
          <p className="text-xs text-gray-500">Quick view of how income and spending balance out</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-center">
          <p className="text-xs uppercase tracking-wide text-slate-500">Money in</p>
          <p className="text-2xl font-semibold text-gray-900">NOK {totalMonthlyIncome.toLocaleString('no-NO', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-center">
          <p className="text-xs uppercase tracking-wide text-slate-500">Money out</p>
          <p className="text-2xl font-semibold text-gray-900">NOK {totalMonthlyExpenses.toLocaleString('no-NO', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-center">
          <p className="text-xs uppercase tracking-wide text-slate-500">Net result</p>
          <p className={`text-2xl font-semibold ${netResult >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {netResult >= 0 ? '+' : '-'}NOK {Math.abs(netResult).toLocaleString('no-NO', { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-100 bg-slate-50 px-4 py-3">
          <dt className="text-xs uppercase tracking-wide text-slate-500">Biggest expense</dt>
          <dd className="text-sm text-gray-900">
            {biggestExpenseCategory ? (
              <>
                {biggestExpenseCategory.name}
                <span className="ml-1 text-xs text-gray-500">
                  NOK {biggestExpenseCategory.spent.toLocaleString('no-NO', { maximumFractionDigits: 0 })}
                </span>
              </>
            ) : (
              'No category data yet'
            )}
          </dd>
        </div>
        <div className="rounded-lg border border-gray-100 bg-slate-50 px-4 py-3">
          <dt className="text-xs uppercase tracking-wide text-slate-500">Savings rate</dt>
          <dd className="text-sm text-gray-900">{savingsRate.toFixed(1)}% of income</dd>
        </div>
        <div className="rounded-lg border border-gray-100 bg-slate-50 px-4 py-3">
          <dt className="text-xs uppercase tracking-wide text-slate-500">Days to payday</dt>
          <dd className="text-sm text-gray-900">{paycheckDays}</dd>
        </div>
        <div className="rounded-lg border border-gray-100 bg-slate-50 px-4 py-3">
          <dt className="text-xs uppercase tracking-wide text-slate-500">Runway status</dt>
          <dd className={`text-sm font-medium ${netLeftoverUntilPaycheck >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {netLeftoverUntilPaycheck >= 0 ? 'Covered until payday' : 'Short before payday'}
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default FinancialAwarenessSummary;
