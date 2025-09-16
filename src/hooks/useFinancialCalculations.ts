import { useMemo } from 'react';
import type { SpendingCategory } from '../types/current';

export const useFinancialCalculations = (
  totalMonthlyIncome: number,
  spendingCategories: SpendingCategory[]
) => {
  return useMemo(() => {
    const totalMonthlyExpenses = spendingCategories.reduce((sum, cat) => sum + cat.spent, 0);
    const savingsRate = ((totalMonthlyIncome - totalMonthlyExpenses) / totalMonthlyIncome) * 100;
    const biggestExpenseCategory = spendingCategories.reduce((max, cat) => 
      cat.spent > max.spent ? cat : max, spendingCategories[0]);
    const dailyAverageSpending = totalMonthlyExpenses / 30;

    return {
      totalMonthlyExpenses,
      savingsRate,
      biggestExpenseCategory,
      dailyAverageSpending,
    };
  }, [totalMonthlyIncome, spendingCategories]);
};