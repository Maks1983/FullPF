import React, { memo } from 'react';
import SmartSuggestions from '../SmartSuggestions';
import type { SpendingCategory } from '../../../types/current';

interface SuggestionsSectionProps {
  netLeftover: number;
  savingsRate: number;
  spendingCategories: SpendingCategory[];
  overdueCount: number;
  daysUntilPaycheck: number;
  totalAvailable: number;
  monthlyExpenses: number;
}

const SuggestionsSection: React.FC<SuggestionsSectionProps> = memo(({
  netLeftover,
  savingsRate,
  spendingCategories,
  overdueCount,
  daysUntilPaycheck,
  totalAvailable,
  monthlyExpenses
}) => {
  return (
    <SmartSuggestions 
      netLeftover={netLeftover}
      savingsRate={savingsRate}
      spendingCategories={spendingCategories}
      overdueCount={overdueCount}
      daysUntilPaycheck={daysUntilPaycheck}
      totalAvailable={totalAvailable}
      monthlyExpenses={monthlyExpenses}
    />
  );
});

SuggestionsSection.displayName = 'SuggestionsSection';

export default SuggestionsSection;
