import React, { memo } from 'react';
import RecentTransactionsCard from '../RecentTransactionsCard';
import type { RecentTransaction } from '../../../types/current';

interface TransactionsSectionProps {
  transactions: RecentTransaction[];
}

const TransactionsSection: React.FC<TransactionsSectionProps> = memo(({
  transactions
}) => {
  return (
    <RecentTransactionsCard transactions={transactions} />
  );
});

TransactionsSection.displayName = 'TransactionsSection';

export default TransactionsSection;