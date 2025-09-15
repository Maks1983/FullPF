import { useMemo } from 'react';
import { 
  currentBalances, 
  upcomingTransactions, 
  budgetCategories, 
  cashflowProjection,
  paydayInfo 
} from '../data/currentData';
import type { CurrentBalance, UpcomingTransaction } from '../types/current';

export const useCurrentData = () => {
  return useMemo(() => {
    // Calculate total liquid funds
    const totalLiquid = currentBalances
      .filter(account => account.type !== 'credit')
      .reduce((sum, account) => sum + account.balance, 0);

    // Calculate net worth including credit
    const netWorth = currentBalances
      .reduce((sum, account) => sum + account.balance, 0);

    // Calculate upcoming expenses
    const upcomingExpenses = upcomingTransactions
      .filter(t => t.amount < 0 && t.status !== 'overdue')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // Calculate overdue amounts
    const overdueAmount = upcomingTransactions
      .filter(t => t.status === 'overdue')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // Calculate projected balance after all upcoming transactions
    const projectedBalance = totalLiquid - upcomingExpenses;

    // Budget health score
    const budgetHealth = budgetCategories.reduce((score, category) => {
      const utilization = category.spent / category.budget;
      if (utilization <= 0.8) return score + 20;
      if (utilization <= 1.0) return score + 10;
      return score;
    }, 0);

    return {
      balances: currentBalances,
      transactions: upcomingTransactions,
      budgets: budgetCategories,
      projections: cashflowProjection,
      payday: paydayInfo,
      metrics: {
        totalLiquid,
        netWorth,
        upcomingExpenses,
        overdueAmount,
        projectedBalance,
        budgetHealth
      }
    };
  }, []);
};