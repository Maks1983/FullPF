// Centralized financial data with consistent values across all dashboards
export const FINANCIAL_DATA = {
  // User Profile
  user: {
    id: 'user_1',
    name: 'John Doe',
    email: 'john@example.com',
    currency: 'NOK',
    monthlyIncome: 52000,
    createdAt: '2023-01-01'
  },

  // Current Accounts (Real-time balances)
  accounts: [
    {
      id: 'acc_checking',
      name: 'Main Checking',
      type: 'checking' as const,
      balance: 15420.00,
      availableBalance: 15420.00,
      currency: 'NOK',
      lastUpdated: '2024-01-15T14:30:00Z',
      status: 'active' as const,
      minimumBalance: 500,
      overdraftLimit: 1000
    },
    {
      id: 'acc_savings',
      name: 'High Yield Savings',
      type: 'savings' as const,
      balance: 82000.00,
      availableBalance: 82000.00,
      currency: 'NOK',
      lastUpdated: '2024-01-15T14:30:00Z',
      status: 'active' as const,
      interestRate: 4.2
    },
    {
      id: 'acc_emergency',
      name: 'Emergency Fund',
      type: 'savings' as const,
      balance: 47200.00,
      availableBalance: 47200.00,
      currency: 'NOK',
      lastUpdated: '2024-01-15T14:30:00Z',
      status: 'active' as const,
      interestRate: 3.8
    },
    {
      id: 'acc_credit',
      name: 'Credit Card',
      type: 'credit' as const,
      balance: -18500.00,
      availableBalance: 8750.00,
      currency: 'NOK',
      lastUpdated: '2024-01-15T14:30:00Z',
      status: 'active' as const,
      creditLimit: 25000,
      interestRate: 18.9
    }
  ],

  // Investments & Assets
  investments: [
    {
      id: 'inv_stocks',
      name: 'Stock Portfolio',
      type: 'stocks' as const,
      value: 85000,
      originalValue: 75000,
      performance: '+13.3%',
      color: '#3b82f6'
    },
    {
      id: 'inv_crypto',
      name: 'Cryptocurrency',
      type: 'crypto' as const,
      value: 18500,
      originalValue: 15000,
      performance: '+23.3%',
      color: '#f59e0b'
    },
    {
      id: 'inv_bonds',
      name: 'Bonds',
      type: 'bonds' as const,
      value: 12000,
      originalValue: 11500,
      performance: '+4.3%',
      color: '#6366f1'
    }
  ],

  // Physical Assets
  physicalAssets: [
    {
      id: 'asset_house',
      name: 'Primary Residence',
      type: 'real_estate' as const,
      value: 2850000,
      originalValue: 2650000,
      performance: '+7.5%',
      color: '#8b5cf6'
    },
    {
      id: 'asset_car',
      name: '2022 Honda Civic',
      type: 'vehicle' as const,
      value: 285000,
      originalValue: 350000,
      performance: '-18.6%',
      color: '#ef4444'
    }
  ],

  // Debts & Liabilities
  debts: [
    {
      id: 'debt_credit',
      name: 'Credit Cards',
      type: 'credit_card' as const,
      balance: 18500,
      interestRate: 19.5,
      minimumPayment: 555,
      dueDate: '2024-01-25'
    },
    {
      id: 'debt_car',
      name: 'Car Loan',
      type: 'auto_loan' as const,
      balance: 12200,
      interestRate: 4.2,
      minimumPayment: 340,
      dueDate: '2024-01-15'
    },
    {
      id: 'debt_student',
      name: 'Student Loan',
      type: 'student_loan' as const,
      balance: 7750,
      interestRate: 5.8,
      minimumPayment: 125,
      dueDate: '2024-01-20'
    }
  ],

  // Monthly Spending Categories
  spendingCategories: [
    {
      name: 'Housing',
      spent: 12000,
      budget: 15000,
      color: '#ef4444',
      isEssential: true
    },
    {
      name: 'Food & Dining',
      spent: 4200,
      budget: 5000,
      color: '#f59e0b',
      isEssential: true
    },
    {
      name: 'Transportation',
      spent: 2800,
      budget: 3500,
      color: '#3b82f6',
      isEssential: true
    },
    {
      name: 'Utilities',
      spent: 1800,
      budget: 2200,
      color: '#10b981',
      isEssential: true
    },
    {
      name: 'Entertainment',
      spent: 1650,
      budget: 1500,
      color: '#8b5cf6',
      isEssential: false
    },
    {
      name: 'Shopping',
      spent: 2200,
      budget: 2000,
      color: '#ec4899',
      isEssential: false
    },
    {
      name: 'Healthcare',
      spent: 800,
      budget: 1200,
      color: '#06b6d4',
      isEssential: true
    },
    {
      name: 'Insurance',
      spent: 1200,
      budget: 1200,
      color: '#84cc16',
      isEssential: true
    },
    {
      name: 'Savings',
      spent: 8000,
      budget: 8000,
      color: '#22c55e',
      isEssential: true
    },
    {
      name: 'Debt Payments',
      spent: 1020,
      budget: 1020,
      color: '#f97316',
      isEssential: true
    },
    {
      name: 'Personal Care',
      spent: 600,
      budget: 800,
      color: '#a855f7',
      isEssential: false
    },
    {
      name: 'Miscellaneous',
      spent: 450,
      budget: 500,
      color: '#6b7280',
      isEssential: false
    }
  ],

  // Financial Goals
  goals: [
    {
      id: 'goal_emergency',
      name: 'Emergency Fund',
      current: 129200, // Sum of savings accounts
      target: 180000, // 6 months expenses (30k/month * 6)
      deadline: '2024-12-31',
      monthlyContribution: 5000,
      category: 'safety'
    },
    {
      id: 'goal_house',
      name: 'House Down Payment',
      current: 45000,
      target: 100000,
      deadline: '2025-12-31',
      monthlyContribution: 3000,
      category: 'major_purchase'
    },
    {
      id: 'goal_retirement',
      name: 'Retirement Fund',
      current: 115500, // Current investments
      target: 500000,
      deadline: '2040-12-31',
      monthlyContribution: 2000,
      category: 'retirement'
    }
  ]
};

// Calculated totals (derived from base data)
export const CALCULATED_TOTALS = {
  // Liquid assets (checking + savings)
  liquidAssets: FINANCIAL_DATA.accounts
    .filter(acc => acc.type !== 'credit')
    .reduce((sum, acc) => sum + acc.balance, 0),

  // Total investments
  totalInvestments: FINANCIAL_DATA.investments
    .reduce((sum, inv) => sum + inv.value, 0),

  // Total physical assets
  totalPhysicalAssets: FINANCIAL_DATA.physicalAssets
    .reduce((sum, asset) => sum + asset.value, 0),

  // Total assets
  get totalAssets() {
    return this.liquidAssets + this.totalInvestments + this.totalPhysicalAssets;
  },

  // Total debts
  totalDebts: FINANCIAL_DATA.debts
    .reduce((sum, debt) => sum + debt.balance, 0),

  // Net worth
  get netWorth() {
    return this.totalAssets - this.totalDebts;
  },

  // Monthly expenses
  monthlyExpenses: FINANCIAL_DATA.spendingCategories
    .reduce((sum, cat) => sum + cat.spent, 0),

  // Monthly net cashflow
  get monthlyCashflow() {
    return FINANCIAL_DATA.user.monthlyIncome - this.monthlyExpenses;
  },

  // Savings rate
  get savingsRate() {
    return (this.monthlyCashflow / FINANCIAL_DATA.user.monthlyIncome) * 100;
  },

  // Debt to income ratio
  get debtToIncomeRatio() {
    const monthlyDebtPayments = FINANCIAL_DATA.debts
      .reduce((sum, debt) => sum + debt.minimumPayment, 0);
    return (monthlyDebtPayments / FINANCIAL_DATA.user.monthlyIncome) * 100;
  }
};

// Historical data for charts (consistent with current totals)
export const HISTORICAL_DATA = {
  // Net worth progression (12 months)
  netWorthHistory: [
    { month: 'Jan', assets: 3100000, liabilities: 45000, netWorth: 3055000 },
    { month: 'Feb', assets: 3120000, liabilities: 44200, netWorth: 3075800 },
    { month: 'Mar', assets: 3140000, liabilities: 43400, netWorth: 3096600 },
    { month: 'Apr', assets: 3160000, liabilities: 42600, netWorth: 3117400 },
    { month: 'May', assets: 3180000, liabilities: 41800, netWorth: 3138200 },
    { month: 'Jun', assets: 3200000, liabilities: 41000, netWorth: 3159000 },
    { month: 'Jul', assets: 3220000, liabilities: 40200, netWorth: 3179800 },
    { month: 'Aug', assets: 3240000, liabilities: 39400, netWorth: 3200600 },
    { month: 'Sep', assets: 3260000, liabilities: 38600, netWorth: 3221400 },
    { month: 'Oct', assets: 3280000, liabilities: 37800, netWorth: 3242200 },
    { month: 'Nov', assets: 3300000, liabilities: 37000, netWorth: 3263000 },
    { month: 'Dec', assets: CALCULATED_TOTALS.totalAssets, liabilities: CALCULATED_TOTALS.totalDebts, netWorth: CALCULATED_TOTALS.netWorth }
  ],

  // Cashflow history (12 months)
  cashflowHistory: [
    { month: 'Jan', income: 50000, expenses: 28000, cashflow: 22000 },
    { month: 'Feb', income: 50000, expenses: 29000, cashflow: 21000 },
    { month: 'Mar', income: 51000, expenses: 29500, cashflow: 21500 },
    { month: 'Apr', income: 51000, expenses: 30000, cashflow: 21000 },
    { month: 'May', income: 52000, expenses: 30200, cashflow: 21800 },
    { month: 'Jun', income: 52000, expenses: 30500, cashflow: 21500 },
    { month: 'Jul', income: 52000, expenses: 29800, cashflow: 22200 },
    { month: 'Aug', income: 52000, expenses: 30100, cashflow: 21900 },
    { month: 'Sep', income: 52000, expenses: 30300, cashflow: 21700 },
    { month: 'Oct', income: 52000, expenses: 30000, cashflow: 22000 },
    { month: 'Nov', income: 52000, expenses: 29900, cashflow: 22100 },
    { month: 'Dec', income: FINANCIAL_DATA.user.monthlyIncome, expenses: CALCULATED_TOTALS.monthlyExpenses, cashflow: CALCULATED_TOTALS.monthlyCashflow }
  ],

  // Savings growth (12 months)
  savingsHistory: [
    { month: 'Jan', value: 110000 },
    { month: 'Feb', value: 115000 },
    { month: 'Mar', value: 118000 },
    { month: 'Apr', value: 121000 },
    { month: 'May', value: 124000 },
    { month: 'Jun', value: 126000 },
    { month: 'Jul', value: 128000 },
    { month: 'Aug', value: 130000 },
    { month: 'Sep', value: 127000 }, // Emergency expense
    { month: 'Oct', value: 129000 },
    { month: 'Nov', value: 131000 },
    { month: 'Dec', value: CALCULATED_TOTALS.liquidAssets }
  ],

  // Debt reduction (12 months)
  debtHistory: [
    { month: 'Jan', balance: 45000, interest: 520 },
    { month: 'Feb', balance: 44200, interest: 510 },
    { month: 'Mar', balance: 43400, interest: 500 },
    { month: 'Apr', balance: 42600, interest: 490 },
    { month: 'May', balance: 41800, interest: 480 },
    { month: 'Jun', balance: 41000, interest: 470 },
    { month: 'Jul', balance: 40200, interest: 460 },
    { month: 'Aug', balance: 39400, interest: 450 },
    { month: 'Sep', balance: 38600, interest: 440 },
    { month: 'Oct', balance: 37800, interest: 430 },
    { month: 'Nov', balance: 37000, interest: 420 },
    { month: 'Dec', balance: CALCULATED_TOTALS.totalDebts, interest: 410 }
  ],

  // Investment performance (12 months)
  investmentHistory: [
    { month: 'Jan', value: 95000 },
    { month: 'Feb', value: 98000 },
    { month: 'Mar', value: 102000 },
    { month: 'Apr', value: 105000 },
    { month: 'May', value: 108000 },
    { month: 'Jun', value: 110000 },
    { month: 'Jul', value: 112000 },
    { month: 'Aug', value: 114000 },
    { month: 'Sep', value: 111000 }, // Market dip
    { month: 'Oct', value: 113000 },
    { month: 'Nov', value: 115000 },
    { month: 'Dec', value: CALCULATED_TOTALS.totalInvestments }
  ],

  // Financial health scores (6 months)
  healthScoreHistory: [
    { month: 'Jul', score: 78 },
    { month: 'Aug', score: 80 },
    { month: 'Sep', score: 82 },
    { month: 'Oct', score: 83 },
    { month: 'Nov', score: 84 },
    { month: 'Dec', score: 85 }
  ]
};

// Portfolio allocation for charts
export const PORTFOLIO_DATA = FINANCIAL_DATA.investments.map(inv => ({
  name: inv.name,
  value: inv.value,
  color: inv.color,
  performance: inv.performance
}));

// Recent activities (consistent with account balances)
export const RECENT_ACTIVITIES = [
  {
    id: 1,
    type: 'income' as const,
    description: 'Salary Deposit',
    amount: 52000,
    date: '2 days ago'
  },
  {
    id: 2,
    type: 'expense' as const,
    description: 'Grocery Shopping',
    amount: -1485,
    date: '3 days ago'
  },
  {
    id: 3,
    type: 'transfer' as const,
    description: 'Auto-save Transfer',
    amount: 2500,
    date: '5 days ago'
  }
];

// Smart insights based on actual data
export const SMART_INSIGHTS = [
  {
    type: 'opportunity' as const,
    title: 'Investment Opportunity',
    message: `Your liquid assets (${CALCULATED_TOTALS.liquidAssets.toLocaleString()} NOK) are 15% above optimal. Consider investing NOK 20,000.`,
    impact: 'High',
    action: 'Invest Now',
    color: 'green' as const
  },
  {
    type: 'warning' as const,
    title: 'Budget Alert',
    message: 'Entertainment spending is 10% over budget this month.',
    impact: 'Medium',
    action: 'Review Budget',
    color: 'yellow' as const
  },
  {
    type: 'achievement' as const,
    title: 'Goal Achievement',
    message: `Emergency fund is now ${((CALCULATED_TOTALS.liquidAssets / 180000) * 100).toFixed(0)}% complete! Great progress.`,
    impact: 'Positive',
    action: 'View Goal',
    color: 'blue' as const
  }
];