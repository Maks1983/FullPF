import { useMemo, useCallback } from 'react';
import type { SpendingCategory } from '../types/current';
import { FINANCIAL_THRESHOLDS } from '../constants/financial';

export const useFinancialCalculations = (spendingCategories: SpendingCategory[]) => {
  return useMemo(() => {
    // Calculate insights for awareness
    const totalMonthlyIncome = 52000; // This would come from data
    const totalMonthlyExpenses = spendingCategories.reduce((sum, cat) => sum + cat.spent, 0);
    const savingsRate = ((totalMonthlyIncome - totalMonthlyExpenses) / totalMonthlyIncome) * 100;
    const biggestExpenseCategory = spendingCategories.reduce((max, cat) => 
      cat.spent > max.spent ? cat : max, spendingCategories[0]);
    const dailyAverageSpending = totalMonthlyExpenses / 30;
    
    // Enhanced calculations with thresholds
    const netCashflow = totalMonthlyIncome - totalMonthlyExpenses;
    const isHealthySavingsRate = savingsRate >= FINANCIAL_THRESHOLDS.SAVINGS_RATE_GOOD;
    const emergencyFundTarget = totalMonthlyExpenses * FINANCIAL_THRESHOLDS.EMERGENCY_FUND_MONTHS;

    return {
      totalMonthlyIncome,
      totalMonthlyExpenses,
      netCashflow,
      savingsRate,
      isHealthySavingsRate,
      biggestExpenseCategory,
      dailyAverageSpending,
      emergencyFundTarget,
    };
  }, [spendingCategories]);
  
  // Memoized calculation functions
  const calculateFinancialHealth = useCallback((
    balance: number,
    monthlyExpenses: number
  ) => {
    const monthsOfExpenses = balance / monthlyExpenses;
    
    if (monthsOfExpenses >= FINANCIAL_THRESHOLDS.EMERGENCY_FUND_MONTHS) {
      return { status: 'excellent' as const, message: 'Strong financial position' };
    } else if (monthsOfExpenses >= 1) {
      return { status: 'good' as const, message: 'Adequate reserves' };
    } else if (balance >= FINANCIAL_THRESHOLDS.LOW_BALANCE) {
      return { status: 'warning' as const, message: 'Getting tight' };
    } else {
      return { status: 'critical' as const, message: 'Critical - need attention' };
    }
  }, []);
  
  return { calculateFinancialHealth };
};