import React from 'react';
import { Clock, Flame } from 'lucide-react';
import CashflowProjectionChart from '../CashflowProjectionChart';
import SpendingCategoriesCard from '../SpendingCategoriesCard';
import type { CashflowProjection, SpendingCategory } from '../../../types/current';

interface MoneyFlowSectionProps {
  cashflowProjections: CashflowProjection[];
  spendingCategories: SpendingCategory[];
  daysUntilDeficit: number;
  todaySpending: number;
  dailyAverageSpending: number;
  netLeftover: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

const MoneyFlowSection: React.FC<MoneyFlowSectionProps> = ({
  cashflowProjections,
  spendingCategories,
  daysUntilDeficit,
  todaySpending,
  dailyAverageSpending,
  netLeftover,
  monthlyIncome,
  monthlyExpenses
}) => {
  const hasDeficitRisk = daysUntilDeficit !== 999 && daysUntilDeficit >= 0;
  const monthlyNetFlow = monthlyIncome - monthlyExpenses;
  const isDailyOverspend = dailyAverageSpending > 0
    ? todaySpending > dailyAverageSpending * 1.25
    : false;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-4 rounded-lg border ${hasDeficitRisk ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Clock className={`h-4 w-4 ${hasDeficitRisk ? 'text-red-500' : 'text-blue-500'}`} />
                <span className="text-sm font-semibold text-gray-900">Runway to Payday</span>
              </div>
              <span className={`text-xs font-medium ${netLeftover >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                NOK {netLeftover.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-600">
              {hasDeficitRisk
                ? `Money could run short in ${daysUntilDeficit} day${daysUntilDeficit === 1 ? '' : 's'}`
                : 'Spending is covered until the next paycheck'}
            </p>
          </div>

          <div className={`p-4 rounded-lg border ${isDailyOverspend ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Flame className={`h-4 w-4 ${isDailyOverspend ? 'text-orange-500' : 'text-green-500'}`} />
                <span className="text-sm font-semibold text-gray-900">Daily Burn Rate</span>
              </div>
              <span className="text-xs font-medium text-gray-700">
                Avg NOK {Math.round(dailyAverageSpending).toLocaleString()}
              </span>
            </div>
            <p className={`text-xs ${isDailyOverspend ? 'text-orange-600' : 'text-gray-600'}`}>
              Today: NOK {todaySpending.toLocaleString()} {isDailyOverspend ? '(above trend)' : '(on track)'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Monthly net flow: {monthlyNetFlow >= 0 ? '+' : '-'}NOK {Math.abs(monthlyNetFlow).toLocaleString()}
            </p>
          </div>
        </div>

        <CashflowProjectionChart
          projections={cashflowProjections}
          daysUntilDeficit={daysUntilDeficit}
        />
      </div>

      <div className="space-y-6">
        <SpendingCategoriesCard
          categories={spendingCategories}
          todaySpending={todaySpending}
        />
      </div>
    </div>
  );
};

export default MoneyFlowSection;
