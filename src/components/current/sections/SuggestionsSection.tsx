import React from 'react';
import SmartSuggestions from '../SmartSuggestions';
import type { SpendingCategory } from '../../../types/current';

interface SuggestionsSectionProps {
  netLeftover: number;
  savingsRate: number;
  spendingCategories: SpendingCategory[];
  overdueCount: number;
  daysUntilPaycheck: number;
}

const SuggestionsSection: React.FC<SuggestionsSectionProps> = ({
  netLeftover,
  savingsRate,
  spendingCategories,
  overdueCount,
  daysUntilPaycheck
}) => {
  return (
    <SmartSuggestions 
      netLeftover={netLeftover}
      savingsRate={savingsRate}
      spendingCategories={spendingCategories}
      overdueCount={overdueCount}
      daysUntilPaycheck={daysUntilPaycheck}
    />
  );
};

export default SuggestionsSection;