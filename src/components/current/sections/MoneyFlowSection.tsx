import React, { memo } from 'react';
import CashflowProjectionChart from '../CashflowProjectionChart';
import SpendingCategoriesCard from '../SpendingCategoriesCard';
import type { CashflowProjection, SpendingCategory } from '../../../types/current';

interface MoneyFlowSectionProps {
  cashflowProjections: CashflowProjection[];
  spendingCategories: SpendingCategory[];
  daysUntilDeficit: number;
  todaySpending: number;
}

const MoneyFlowSection: React.FC<MoneyFlowSectionProps> = memo(({
  cashflowProjections,
  spendingCategories,
  daysUntilDeficit,
  todaySpending
}) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Left Column - Money Status */}
      <div className="xl:col-span-2 space-y-6">
        {/* Additional summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        </div>
        {/* Cashflow Projection - Full Width */}
        <CashflowProjectionChart
          projections={cashflowProjections}
          daysUntilDeficit={daysUntilDeficit}
        />
      </div>

      {/* Right Column - Payments & Spending */}
      <div className="space-y-6">
        {/* Spending Categories */}
        <SpendingCategoriesCard
          categories={spendingCategories}
          todaySpending={todaySpending}
        />
      </div>
    </div>
  );
});

MoneyFlowSection.displayName = 'MoneyFlowSection';

export default MoneyFlowSection;