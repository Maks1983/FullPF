import React from 'react';
import CashflowProjectionChart from '../CashflowProjectionChart';
import SpendingCategoriesCard from '../SpendingCategoriesCard';
import UpcomingPaymentsTimeline from '../UpcomingPaymentsTimeline';
import type { CashflowProjection, SpendingCategory, UpcomingPayment } from '../../../types/current';

interface MoneyFlowSectionProps {
  cashflowProjections: CashflowProjection[];
  spendingCategories: SpendingCategory[];
  daysUntilDeficit: number;
  upcomingPayments: UpcomingPayment[];
}

const MoneyFlowSection: React.FC<MoneyFlowSectionProps> = ({
  cashflowProjections,
  spendingCategories,
  daysUntilDeficit,
  upcomingPayments
}) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-8 items-start">
      <div className="space-y-6">
        <CashflowProjectionChart
          projections={cashflowProjections}
          daysUntilDeficit={daysUntilDeficit}
        />

        <UpcomingPaymentsTimeline
          payments={upcomingPayments}
          limit={4}
        />
      </div>

      <div className="w-full xl:h-full">
        <SpendingCategoriesCard
          categories={spendingCategories}
          className="h-full"
        />
      </div>
    </div>
  );
};

export default MoneyFlowSection;
