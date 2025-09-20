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
