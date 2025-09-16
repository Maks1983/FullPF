import React from 'react';
import RecentTransactionsCard from '../RecentTransactionsCard';
import type { RecentTransaction } from '../../../types/current';

interface TransactionsSectionProps {
  transactions: RecentTransaction[];
}

const TransactionsSection: React.FC<TransactionsSectionProps> = ({
  transactions
}) => {
  return (
    <RecentTransactionsCard transactions={transactions} />
  );
};

export default TransactionsSection;