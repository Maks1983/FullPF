import { useMemo } from 'react';
import type { SpendingCategory } from '../types/current';

export const useFinancialCalculations = (
  spendingCategories: SpendingCategory[],
  totalMonthlyIncome: number
) => {
  return useMemo(() => {
    const normalizedIncome = Number.isFinite(totalMonthlyIncome) ? totalMonthlyIncome : 0;
    const totalMonthlyExpenses = spendingCategories.reduce((sum, category) => sum + category.spent, 0);
    const savingsRate = normalizedIncome > 0
      ? ((normalizedIncome - totalMonthlyExpenses) / normalizedIncome) * 100
      : 0;

    const biggestExpenseCategory = spendingCategories.reduce<SpendingCategory | undefined>((currentMax, category) => {
      if (!currentMax || category.spent > currentMax.spent) {
        return category;
      }
      return currentMax;
    }, undefined);

    const dailyAverageSpending = totalMonthlyExpenses > 0
      ? totalMonthlyExpenses / 30
      : 0;

    return {
      totalMonthlyIncome: normalizedIncome,
      totalMonthlyExpenses,
      savingsRate,
      biggestExpenseCategory,
      dailyAverageSpending,
    };
  }, [spendingCategories, totalMonthlyIncome]);
};
