import React, { memo } from 'react';
import FinancialAwarenessSummary from '../FinancialAwarenessSummary';
import type { SpendingCategory } from '../../../types/current';

interface AwarenessSectionProps {
  totalMonthlyIncome: number;
  totalMonthlyExpenses: number;
  biggestExpenseCategory: { name: string; spent: number } | undefined;
  savingsRate: number;
  paycheckDays: number;
  netLeftoverUntilPaycheck: number;
}

const AwarenessSection: React.FC<AwarenessSectionProps> = memo(({
  totalMonthlyIncome,
  totalMonthlyExpenses,
  biggestExpenseCategory,
  savingsRate,
  paycheckDays,
  netLeftoverUntilPaycheck
}) => {
  return (
    <FinancialAwarenessSummary
      totalMonthlyIncome={totalMonthlyIncome}
      totalMonthlyExpenses={totalMonthlyExpenses}
      biggestExpenseCategory={biggestExpenseCategory}
      savingsRate={savingsRate}
      paycheckDays={paycheckDays}
      netLeftoverUntilPaycheck={netLeftoverUntilPaycheck}
    />
  );
});

AwarenessSection.displayName = 'AwarenessSection';

export default AwarenessSection;