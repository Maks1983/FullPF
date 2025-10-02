import React, { memo } from 'react';
import MoneyFlowInsights from '../MoneyFlowInsights';
import type { SpendingCategory, RecentTransaction } from '../../../types/current';

interface InsightsSectionProps {
  monthlyIncome: number;
  monthlyExpenses: number;
  spendingCategories: SpendingCategory[];
  todaySpending: number;
  recentTransactions: RecentTransaction[];
}

const InsightsSection: React.FC<InsightsSectionProps> = memo(({
  monthlyIncome,
  monthlyExpenses,
  spendingCategories,
  todaySpending,
  recentTransactions
}) => {
  return (
    <MoneyFlowInsights 
      monthlyIncome={monthlyIncome}
      monthlyExpenses={monthlyExpenses}
      spendingCategories={spendingCategories}
      todaySpending={todaySpending}
      recentTransactions={recentTransactions}
    />
  );
});

InsightsSection.displayName = 'InsightsSection';

export default InsightsSection;