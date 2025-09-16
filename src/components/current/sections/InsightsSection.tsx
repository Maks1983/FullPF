import React from 'react';
import MoneyFlowInsights from '../MoneyFlowInsights';
import type { SpendingCategory, RecentTransaction } from '../../../types/current';

interface InsightsSectionProps {
  monthlyIncome: number;
  monthlyExpenses: number;
  spendingCategories: SpendingCategory[];
  todaySpending: number;
  recentTransactions: RecentTransaction[];
}

const InsightsSection: React.FC<InsightsSectionProps> = ({
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
};

export default InsightsSection;