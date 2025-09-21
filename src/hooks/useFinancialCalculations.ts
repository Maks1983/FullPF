/**
 * Custom hook for financial calculations and derived metrics
 */

import { useMemo } from 'react';
import { safeNumber, safePercentage } from '../utils/financial';
import type { SpendingCategory } from '../types/current';

export interface FinancialCalculations {
  totalMonthlyIncome: number;
  totalMonthlyExpenses: number;
  netCashflow: number;
  savingsRate: number;
  biggestExpenseCategory: SpendingCategory | undefined;
  dailyAverageSpending: number;
  monthlyBurnRate: number;
  expensesByCategory: Record<string, number>;
  budgetUtilization: number;
}

/**
 * Calculate comprehensive financial metrics from spending categories and income
 */
export const useFinancialCalculations = (
  spendingCategories: SpendingCategory[],
  totalMonthlyIncome: number
): FinancialCalculations => {
  return useMemo(() => {
    // Normalize inputs
    const normalizedIncome = safeNumber(totalMonthlyIncome);
    const validCategories = spendingCategories.filter(cat => 
      cat && typeof cat.spent === 'number' && typeof cat.budget === 'number'
    );

    // Calculate totals
    const totalMonthlyExpenses = validCategories.reduce((sum, category) => 
      sum + safeNumber(category.spent), 0
    );
    
    const totalBudget = validCategories.reduce((sum, category) => 
      sum + safeNumber(category.budget), 0
    );

    const netCashflow = normalizedIncome - totalMonthlyExpenses;
    
    // Calculate rates and percentages
    const savingsRate = safePercentage(netCashflow, normalizedIncome);
    const budgetUtilization = safePercentage(totalMonthlyExpenses, totalBudget);
    
    // Find biggest expense category
    const biggestExpenseCategory = validCategories.reduce<SpendingCategory | undefined>(
      (currentMax, category) => {
        const categorySpent = safeNumber(category.spent);
        const maxSpent = currentMax ? safeNumber(currentMax.spent) : 0;
        
        return categorySpent > maxSpent ? category : currentMax;
      }, 
      undefined
    );

    // Calculate daily metrics
    const dailyAverageSpending = totalMonthlyExpenses / 30;
    const monthlyBurnRate = dailyAverageSpending * 30; // Same as totalMonthlyExpenses, but explicit

    // Create expenses by category map
    const expensesByCategory = validCategories.reduce<Record<string, number>>(
      (acc, category) => {
        acc[category.name] = safeNumber(category.spent);
        return acc;
      }, 
      {}
    );

    return {
      totalMonthlyIncome: normalizedIncome,
      totalMonthlyExpenses,
      netCashflow,
      savingsRate,
      biggestExpenseCategory,
      dailyAverageSpending,
      monthlyBurnRate,
      expensesByCategory,
      budgetUtilization,
    };
  }, [spendingCategories, totalMonthlyIncome]);
};

/**
 * Hook for budget analysis specifically
 */
export const useBudgetAnalysis = (spendingCategories: SpendingCategory[]) => {
  return useMemo(() => {
    const validCategories = spendingCategories.filter(cat => 
      cat && typeof cat.spent === 'number' && typeof cat.budget === 'number'
    );

    const overBudgetCategories = validCategories.filter(cat => cat.isOverBudget);
    const underBudgetCategories = validCategories.filter(cat => !cat.isOverBudget);
    
    const totalOverspend = overBudgetCategories.reduce((sum, cat) => 
      sum + Math.abs(safeNumber(cat.remaining)), 0
    );
    
    const totalUnderBudget = underBudgetCategories.reduce((sum, cat) => 
      sum + safeNumber(cat.remaining), 0
    );

    const netBudgetVariance = totalUnderBudget - totalOverspend;
    
    const categoriesAtRisk = validCategories.filter(cat => 
      cat.percentUsed > 80 && !cat.isOverBudget
    );

    return {
      overBudgetCategories,
      underBudgetCategories,
      categoriesAtRisk,
      totalOverspend,
      totalUnderBudget,
      netBudgetVariance,
      budgetHealthScore: Math.max(0, 100 - (overBudgetCategories.length * 20)),
    };
  }, [spendingCategories]);
};

/**
 * Hook for cash flow projections
 */
export const useCashflowProjections = (
  currentBalance: number,
  dailySpending: number,
  daysUntilPaycheck: number,
  expectedIncome: number = 0
) => {
  return useMemo(() => {
    const projections = [];
    let runningBalance = currentBalance;
    
    for (let day = 0; day <= daysUntilPaycheck; day++) {
      // Add income on payday
      if (day === daysUntilPaycheck && expectedIncome > 0) {
        runningBalance += expectedIncome;
      }
      
      // Subtract daily spending (except on day 0)
      if (day > 0) {
        runningBalance -= dailySpending;
      }
      
      projections.push({
        day,
        balance: runningBalance,
        isPayday: day === daysUntilPaycheck,
        isDeficit: runningBalance < 0,
      });
    }
    
    const deficitDay = projections.find(p => p.isDeficit);
    const daysUntilDeficit = deficitDay ? deficitDay.day : null;
    const finalBalance = projections[projections.length - 1]?.balance || 0;
    
    return {
      projections,
      daysUntilDeficit,
      finalBalance,
      willRunShort: finalBalance < 0,
    };
  }, [currentBalance, dailySpending, daysUntilPaycheck, expectedIncome]);
};