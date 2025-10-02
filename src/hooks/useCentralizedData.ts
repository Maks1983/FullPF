import { useMemo } from 'react';
import { 
  FINANCIAL_DATA, 
  CALCULATED_TOTALS, 
  HISTORICAL_DATA, 
  PORTFOLIO_DATA, 
  RECENT_ACTIVITIES, 
  SMART_INSIGHTS 
} from '../data/centralizedData';
import type { TimeframeType } from '../types/financial';

// Main hook for all financial data
export const useCentralizedFinancialData = (timeframe: TimeframeType = '6M') => {
  return useMemo(() => {
    // Filter historical data based on timeframe
    const getTimeframeData = (data: any[], timeframe: TimeframeType) => {
      const timeframeMap = {
        '1M': 1,
        '3M': 3,
        '6M': 6,
        '1Y': 12,
        'ALL': data.length
      };
      
      const months = timeframeMap[timeframe] || 6;
      return data.slice(-months);
    };

    // Get filtered historical data
    const netWorthData = getTimeframeData(HISTORICAL_DATA.netWorthHistory, timeframe);
    const cashflowData = getTimeframeData(HISTORICAL_DATA.cashflowHistory, timeframe);
    const savingsData = getTimeframeData(HISTORICAL_DATA.savingsHistory, timeframe);
    const debtData = getTimeframeData(HISTORICAL_DATA.debtHistory, timeframe);
    const investmentData = getTimeframeData(HISTORICAL_DATA.investmentHistory, timeframe);

    return {
      // Core data
      user: FINANCIAL_DATA.user,
      accounts: FINANCIAL_DATA.accounts,
      investments: FINANCIAL_DATA.investments,
      physicalAssets: FINANCIAL_DATA.physicalAssets,
      debts: FINANCIAL_DATA.debts,
      spendingCategories: FINANCIAL_DATA.spendingCategories,
      goals: FINANCIAL_DATA.goals,

      // Calculated totals
      totals: CALCULATED_TOTALS,

      // Historical data (filtered by timeframe)
      history: {
        netWorth: netWorthData,
        cashflow: cashflowData,
        savings: savingsData,
        debt: debtData,
        investment: investmentData,
        healthScore: HISTORICAL_DATA.healthScoreHistory
      },

      // Chart data
      portfolioData: PORTFOLIO_DATA,
      recentActivities: RECENT_ACTIVITIES,
      smartInsights: SMART_INSIGHTS,

      // Timeframe
      timeframe
    };
  }, [timeframe]);
};

// Specific hooks for individual pages
export const useDashboardData = (timeframe: TimeframeType = '6M') => {
  const data = useCentralizedFinancialData(timeframe);
  
  return useMemo(() => ({
    // Primary metrics
    netWorth: data.totals.netWorth,
    monthlyCashflow: data.totals.monthlyCashflow,
    totalInvestments: data.totals.totalInvestments,
    liquidAssets: data.totals.liquidAssets,
    totalDebts: data.totals.totalDebts,
    savingsRate: data.totals.savingsRate,

    // Chart data
    cashflowData: data.history.cashflow,
    netWorthData: data.history.netWorth,
    portfolioData: data.portfolioData,
    healthScoreData: data.history.healthScore,

    // Other data
    goals: data.goals,
    smartInsights: data.smartInsights,
    recentActivities: data.recentActivities,
    timeframe: data.timeframe
  }), [data]);
};

export const useCurrentPageData = () => {
  const data = useCentralizedFinancialData();
  
  return useMemo(() => {
    // Calculate available balance from checking account only
    const checkingAccount = data.accounts.find(acc => acc.type === 'checking');
    const totalAvailable = checkingAccount ? checkingAccount.balance : 0; // NOK 15,420
    
    // Calculate upcoming payments - debt payments only
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

    // Mock recent transactions based on centralized data
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
      overdueCount: 0,
      todaySpending: 485.50, // This would be calculated from recent transactions
      totalMonthlyIncome: data.user.monthlyIncome,
      totalMonthlyExpenses: data.totals.monthlyExpenses
    };
  }, [data]);
};

export const useSavingsData = (timeframe: TimeframeType = '6M') => {
  const data = useCentralizedFinancialData(timeframe);

  return useMemo(() => {
    const savingsAccounts = data.accounts.filter(acc => acc.type === 'savings');
    const currentSavings = savingsAccounts.reduce((sum, acc) => sum + acc.balance, 0);
    const primaryGoal = data.goals.find(goal => goal.id === 'goal_emergency') ?? data.goals[0];
    const savingsGoal = primaryGoal?.target ?? currentSavings;
    const emergencyGoalCurrent = primaryGoal?.current ?? currentSavings;
    const emergencyGoalTarget = primaryGoal?.target ?? savingsGoal;
    const emergencyGoalProgress = emergencyGoalTarget > 0
      ? (emergencyGoalCurrent / emergencyGoalTarget) * 100
      : 0;

    const savingsHistory = data.history.savings;
    const recentWindow = savingsHistory.slice(-4);
    const monthlyChanges = recentWindow
      .map((point, index) => (index === 0 ? null : point.value - recentWindow[index - 1].value))
      .filter((value): value is number => value !== null);
    const averageMonthlyGrowth = monthlyChanges.length > 0
      ? monthlyChanges.reduce((sum, value) => sum + value, 0) / monthlyChanges.length
      : 0;

    const emergencyCoverageMonths = data.totals.monthlyExpenses > 0
      ? currentSavings / data.totals.monthlyExpenses
      : null;

    const additionalGoals = data.goals
      .filter(goal => (primaryGoal ? goal.id !== primaryGoal.id : true))
      .map(goal => {
        const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
        const remaining = Math.max(goal.target - goal.current, 0);
        const monthsToTarget = goal.monthlyContribution && goal.monthlyContribution > 0
          ? Math.ceil(remaining / goal.monthlyContribution)
          : null;

        return {
          ...goal,
          progress,
          remaining,
          monthsToTarget,
        };
      });

    const nextGoal = additionalGoals[0] ?? null;
    const isEmergencyGoalComplete = emergencyGoalProgress >= 100 || (emergencyCoverageMonths ?? 0) >= 6;
    const hasHighInterestDebt = data.debts.some(debt => debt.interestRate >= 15);
    const highestInterestDebt = data.debts.reduce<typeof data.debts[number] | null>((highest, debt) => {
      if (!highest) return debt;
      return debt.interestRate > highest.interestRate ? debt : highest;
    }, null);

    return {
      currentSavings,
      savingsGoal,
      monthlyGrowth: savingsHistory,
      savingsAccounts,
      primaryGoal,
      additionalGoals,
      nextGoal,
      savingsRate: data.totals.savingsRate,
      averageMonthlyGrowth,
      monthlyExpenses: data.totals.monthlyExpenses,
      emergencyCoverageMonths,
      emergencyGoalProgress,
      emergencyGoalCurrent,
      emergencyGoalTarget,
      isEmergencyGoalComplete,
      hasAdditionalGoals: additionalGoals.length > 0,
      hasHighInterestDebt,
      highestDebtRate: highestInterestDebt?.interestRate ?? null,
      highestDebtName: highestInterestDebt?.name ?? null,
      isPremiumUser: false,
    };
  }, [data]);
};

export const useDebtsData = () => {
  const data = useCentralizedFinancialData();
  
  return useMemo(() => ({
    totalDebt: data.totals.totalDebts,
    debts: data.debts,
    debtHistory: data.history.debt,
    monthlyPayments: data.debts.reduce((sum, debt) => sum + debt.minimumPayment, 0),
    averageInterestRate: data.debts.reduce((sum, debt) => sum + debt.interestRate, 0) / data.debts.length,
    debtToIncomeRatio: data.totals.debtToIncomeRatio
  }), [data]);
};

export const useInvestmentsData = () => {
  const data = useCentralizedFinancialData();
  
  return useMemo(() => ({
    totalInvestments: data.totals.totalInvestments,
    investments: data.investments,
    investmentHistory: data.history.investment,
    portfolioAllocation: data.portfolioData,
    totalGains: data.investments.reduce((sum, inv) => sum + (inv.value - inv.originalValue), 0),
    totalReturns: ((data.totals.totalInvestments - data.investments.reduce((sum, inv) => sum + inv.originalValue, 0)) / data.investments.reduce((sum, inv) => sum + inv.originalValue, 0)) * 100
  }), [data]);
};

export const useAssetsData = () => {
  const data = useCentralizedFinancialData();
  
  return useMemo(() => ({
    totalAssets: data.totals.totalAssets,
    liquidAssets: data.totals.liquidAssets,
    investments: data.totals.totalInvestments,
    physicalAssets: data.totals.totalPhysicalAssets,
    allAssets: [
      ...data.accounts.filter(acc => acc.type !== 'credit').map(acc => ({
        id: acc.id,
        name: acc.name,
        type: 'Cash',
        value: acc.balance,
        growth: 4.2,
        liquidity: 'High'
      })),
      ...data.investments.map(inv => ({
        id: inv.id,
        name: inv.name,
        type: inv.type === 'stocks' ? 'Investment' : inv.type === 'crypto' ? 'Cryptocurrency' : 'Investment',
        value: inv.value,
        growth: parseFloat(inv.performance.replace('%', '').replace('+', '')),
        liquidity: 'High'
      })),
      ...data.physicalAssets.map(asset => ({
        id: asset.id,
        name: asset.name,
        type: asset.type === 'real_estate' ? 'Real Estate' : 'Vehicle',
        value: asset.value,
        growth: parseFloat(asset.performance.replace('%', '').replace('+', '')),
        liquidity: asset.type === 'real_estate' ? 'Low' : 'Medium'
      }))
    ]
  }), [data]);
};

export const useLiabilitiesData = () => {
  const data = useCentralizedFinancialData();
  
  return useMemo(() => ({
    totalLiabilities: data.totals.totalDebts,
    liabilities: data.debts,
    debtHistory: data.history.debt,
    monthlyPayments: data.debts.reduce((sum, debt) => sum + debt.minimumPayment, 0),
    debtToIncomeRatio: data.totals.debtToIncomeRatio,
    averageInterestRate: data.debts.reduce((sum, debt) => sum + debt.interestRate, 0) / data.debts.length
  }), [data]);
};

export const useNetWorthData = () => {
  const data = useCentralizedFinancialData();
  
  return useMemo(() => ({
    netWorth: data.totals.netWorth,
    totalAssets: data.totals.totalAssets,
    totalLiabilities: data.totals.totalDebts,
    netWorthHistory: data.history.netWorth,
    assetLiabilityRatio: data.totals.totalAssets / data.totals.totalDebts,
    goals: data.goals,
    breakdown: [
      // Assets
      ...data.accounts.filter(acc => acc.type !== 'credit').map(acc => ({
        id: acc.id,
        category: 'Assets',
        type: acc.type === 'checking' ? 'Cash' : 'Savings',
        description: acc.name,
        value: acc.balance,
        percentage: ((acc.balance / data.totals.totalAssets) * 100).toFixed(1)
      })),
      ...data.investments.map(inv => ({
        id: inv.id,
        category: 'Assets',
        type: 'Investment',
        description: inv.name,
        value: inv.value,
        percentage: ((inv.value / data.totals.totalAssets) * 100).toFixed(1)
      })),
      ...data.physicalAssets.map(asset => ({
        id: asset.id,
        category: 'Assets',
        type: asset.type === 'real_estate' ? 'Real Estate' : 'Vehicle',
        description: asset.name,
        value: asset.value,
        percentage: ((asset.value / data.totals.totalAssets) * 100).toFixed(1)
      })),
      // Liabilities
      ...data.debts.map(debt => ({
        id: debt.id,
        category: 'Liabilities',
        type: debt.type === 'credit_card' ? 'Credit Card' : debt.type === 'auto_loan' ? 'Auto Loan' : 'Student Loan',
        description: debt.name,
        value: -debt.balance,
        percentage: ((debt.balance / data.totals.totalDebts) * 100).toFixed(1)
      }))
    ]
  }), [data]);
};


