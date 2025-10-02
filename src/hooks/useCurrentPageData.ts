import { useMemo } from 'react';
import { useCentralizedFinancialData } from './useCentralizedData';
import type { CurrentPageData } from '../types/current';
import type { TimeframeType } from '../types/financial';

export const useCurrentPageData = (timeframe: TimeframeType = '1M'): CurrentPageData & {
  criticalAlerts: number;
  isDeficitProjected: boolean;
  daysUntilDeficit: number;
  highPriorityPayments: number;
} => {
  const data = useCentralizedFinancialData(timeframe);
  
  return useMemo(() => {
    // Calculate available balance from checking account only
    const checkingAccount = data.accounts.find(acc => acc.type === 'checking');
    const totalAvailable = checkingAccount ? checkingAccount.balance : 0; // NOK 15,420
    
    // Calculate upcoming payments - debt payments + rent
    const debtPayments = data.debts.map(debt => ({
      id: `payment_${debt.id}`,
      description: `${debt.name} Payment`,
      amount: -debt.minimumPayment,
      dueDate: debt.dueDate,
      category: 'Debt',
      status: 'scheduled' as const,
      isRecurring: true,
      accountId: 'acc_checking',
      priority: 'high' as const
    }));

    // Add rent payment  
    const rentPayment = {
      id: 'payment_rent',
      description: 'Rent Payment',
      amount: -12000,
      dueDate: '2024-01-20',
      category: 'Housing',
      status: 'scheduled' as const,
      isRecurring: true,
      accountId: 'acc_checking',
      priority: 'high' as const
    };
    
    const upcomingPayments = [...debtPayments, rentPayment];
    
    // Calculate totals
    const totalUpcomingPayments = upcomingPayments.reduce((sum, payment) => sum + Math.abs(payment.amount), 0); // NOK 13,020
    const netLeftoverUntilPaycheck = totalAvailable - totalUpcomingPayments; // NOK 15,420 - 13,020 = NOK 2,400
    
    // Calculate critical alerts
    const lowBalanceAccounts = data.accounts.filter(acc => 
      acc.type !== 'credit' && acc.minimumBalance && acc.balance < acc.minimumBalance
    ).length;
    
    const highCreditUtilization = data.accounts.filter(acc => 
      acc.type === 'credit' && acc.creditLimit && 
      (Math.abs(acc.balance) / acc.creditLimit) > 0.8
    ).length;
    
    const overdueCount = upcomingPayments.filter(p => p.status === 'overdue').length;
    const criticalAlerts = overdueCount + lowBalanceAccounts + highCreditUtilization;
    
    // Check if deficit is projected
    const isDeficitProjected = netLeftoverUntilPaycheck < 0;
    
    // Days until deficit (simplified)
    const daysUntilDeficit = isDeficitProjected ? 1 : 999;
    
    // Count high priority payments
    const highPriorityPayments = upcomingPayments.filter(payment => 
      payment.priority === 'high' && payment.status !== 'paid'
    ).length;

    // Mock recent transactions
    const recentTransactions = [
      {
        id: 'tx1',
        description: 'Grocery Store',
        amount: -485.50,
        date: '2024-01-15',
        category: 'Food',
        accountId: 'acc_checking',
        status: 'completed' as const,
        merchant: 'Rema 1000'
      },
      {
        id: 'tx2',
        description: 'Gas Station',
        amount: -650.00,
        date: '2024-01-14',
        category: 'Transportation',
        accountId: 'acc_checking',
        status: 'completed' as const,
        merchant: 'Shell'
      },
      {
        id: 'tx3',
        description: 'Salary Deposit',
        amount: 52000.00,
        date: '2024-01-01',
        category: 'Income',
        accountId: 'acc_checking',
        status: 'completed' as const
      }
    ];
    
    // Calculate spending categories with remaining amounts
    const spendingCategoriesWithRemaining = data.spendingCategories.map(cat => ({
      ...cat,
      remaining: cat.budget - cat.spent,
      percentUsed: (cat.spent / cat.budget) * 100,
      isOverBudget: cat.spent > cat.budget
    }));
    
    // Mock cashflow projections
    const cashflowProjections = [
      { date: '2024-01-15', projectedBalance: totalAvailable, scheduledIncome: 0, scheduledExpenses: 0, netFlow: 0 },
      { date: '2024-01-16', projectedBalance: totalAvailable - 500, scheduledIncome: 0, scheduledExpenses: -500, netFlow: -500 },
      { date: '2024-01-17', projectedBalance: totalAvailable - 500, scheduledIncome: 0, scheduledExpenses: 0, netFlow: 0 },
      { date: '2024-01-18', projectedBalance: totalAvailable - 1200, scheduledIncome: 0, scheduledExpenses: -700, netFlow: -700 },
      { date: '2024-01-19', projectedBalance: totalAvailable - 1200, scheduledIncome: 0, scheduledExpenses: 0, netFlow: 0 },
      { date: '2024-01-20', projectedBalance: netLeftoverUntilPaycheck, scheduledIncome: 0, scheduledExpenses: -totalUpcomingPayments, netFlow: -totalUpcomingPayments },
      { date: '2024-01-21', projectedBalance: netLeftoverUntilPaycheck, scheduledIncome: 0, scheduledExpenses: 0, netFlow: 0 }
    ];
    
    return {
      accounts: data.accounts,
      upcomingPayments,
      recentTransactions,
      paycheckInfo: {
        nextPaycheckDate: '2024-01-31',
        daysUntilPaycheck: 16,
        expectedAmount: data.user.monthlyIncome,
        isEstimated: false
      },
      cashflowProjections,
      spendingCategories: spendingCategoriesWithRemaining,
      totalAvailable,
      netLeftoverUntilPaycheck,
      overdueCount,
      totalMonthlyIncome: data.user.monthlyIncome,
      totalMonthlyExpenses: data.totals.monthlyExpenses,
      criticalAlerts,
      isDeficitProjected,
      daysUntilDeficit,
      highPriorityPayments
    };
  }, [data, timeframe]);
};
