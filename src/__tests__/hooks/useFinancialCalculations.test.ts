import { renderHook } from '@testing-library/react';
import { useFinancialCalculations } from '../../hooks/useFinancialCalculations';
import { MOCK_FINANCIAL_VALUES } from '../../data/mockData';
import type { SpendingCategory } from '../../types/current';

// Mock spending categories for testing
const mockSpendingCategories: SpendingCategory[] = [
  {
    name: 'Food & Dining',
    spent: 2850,
    budget: 4000,
    remaining: 1150,
    percentUsed: 71.25,
    color: '#ef4444',
    isOverBudget: false
  },
  {
    name: 'Transportation',
    spent: 1680,
    budget: 2500,
    remaining: 820,
    percentUsed: 67.2,
    color: '#3b82f6',
    isOverBudget: false
  },
  {
    name: 'Entertainment',
    spent: 1650,
    budget: 1500,
    remaining: -150,
    percentUsed: 110,
    color: '#8b5cf6',
    isOverBudget: true
  }
];

describe('useFinancialCalculations', () => {
  it('should calculate total monthly income from mock data', () => {
    const { result } = renderHook(() => useFinancialCalculations(mockSpendingCategories));
    
    expect(result.current.totalMonthlyIncome).toBe(MOCK_FINANCIAL_VALUES.MONTHLY_INCOME);
  });

  it('should calculate total monthly expenses from spending categories', () => {
    const { result } = renderHook(() => useFinancialCalculations(mockSpendingCategories));
    
    const expectedExpenses = mockSpendingCategories.reduce((sum, cat) => sum + cat.spent, 0);
    expect(result.current.totalMonthlyExpenses).toBe(expectedExpenses);
  });

  it('should calculate savings rate correctly', () => {
    const { result } = renderHook(() => useFinancialCalculations(mockSpendingCategories));
    
    const expectedSavingsRate = ((MOCK_FINANCIAL_VALUES.MONTHLY_INCOME - 6180) / MOCK_FINANCIAL_VALUES.MONTHLY_INCOME) * 100;
    expect(result.current.savingsRate).toBeCloseTo(expectedSavingsRate, 2);
  });

  it('should identify biggest expense category', () => {
    const { result } = renderHook(() => useFinancialCalculations(mockSpendingCategories));
    
    expect(result.current.biggestExpenseCategory?.name).toBe('Food & Dining');
    expect(result.current.biggestExpenseCategory?.spent).toBe(2850);
  });

  it('should calculate net cashflow', () => {
    const { result } = renderHook(() => useFinancialCalculations(mockSpendingCategories));
    
    const expectedNetCashflow = MOCK_FINANCIAL_VALUES.MONTHLY_INCOME - 6180;
    expect(result.current.netCashflow).toBe(expectedNetCashflow);
  });

  it('should determine healthy savings rate', () => {
    const { result } = renderHook(() => useFinancialCalculations(mockSpendingCategories));
    
    // With mock income of 52000 and expenses of 6180, savings rate should be healthy (>10%)
    expect(result.current.isHealthySavingsRate).toBe(true);
  });
});