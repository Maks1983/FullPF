import type { CurrentPageData } from '../types/current';

export const mockCurrentPageData: CurrentPageData = {
  paydayInfo: {
    nextPaydayDate: '2025-01-31',
    daysUntilPayday: 16,
    currentSaldo: 425.70,
    remainingPayments: 5,
    remainingPaymentsTotal: -24359.75,
    netLeftover: -23934.05
  },

  upcomingTransactions: [
    {
      id: 'ut1',
      date: '2025-01-18',
      description: 'Phone',
      amount: -99.00,
      category: 'Utilities',
      type: 'expense',
      isRecurring: true
    },
    {
      id: 'ut2',
      date: '2025-01-24',
      description: 'Phone',
      amount: -273.75,
      category: 'Utilities',
      type: 'expense',
      isRecurring: true
    },
    {
      id: 'ut3',
      date: '2025-01-25',
      description: 'Salary',
      amount: 60000.00,
      category: 'Salary',
      type: 'income',
      isRecurring: true
    },
    {
      id: 'ut4',
      date: '2025-01-20',
      description: 'Rent',
      amount: -12000.00,
      category: 'Housing',
      type: 'expense',
      isRecurring: true
    },
    {
      id: 'ut5',
      date: '2025-01-22',
      description: 'Car Insurance',
      amount: -2500.00,
      category: 'Insurance',
      type: 'expense',
      isRecurring: false
    }
  ],

  overduePayments: [
    {
      id: 'op1',
      date: '2025-01-08',
      description: 'Ema Allowance',
      amount: -1766.00,
      daysOverdue: 7,
      category: 'Personal'
    },
    {
      id: 'op2',
      date: '2025-01-08',
      description: 'Video/DVD/Movies',
      amount: 119.00,
      daysOverdue: 7,
      category: 'Entertainment'
    },
    {
      id: 'op3',
      date: '2025-01-08',
      description: 'Home Insurance',
      amount: 1410.00,
      daysOverdue: 7,
      category: 'Insurance'
    }
  ],

  categoryData: [
    { name: 'Salary', amount: 60000, type: 'income', color: '#10b981' },
    { name: 'Freelance', amount: 8500, type: 'income', color: '#059669' },
    { name: 'Housing', amount: -12000, type: 'expense', color: '#ef4444' },
    { name: 'Food & Dining', amount: -4500, type: 'expense', color: '#f97316' },
    { name: 'Transportation', amount: -2800, type: 'expense', color: '#eab308' },
    { name: 'Utilities', amount: -1200, type: 'expense', color: '#3b82f6' },
    { name: 'Entertainment', amount: -800, type: 'expense', color: '#8b5cf6' },
    { name: 'Insurance', amount: -2500, type: 'expense', color: '#ec4899' }
  ],

  monthlyData: [
    { month: 'Oct', income: 58000, expenses: 42000, cashflow: 16000 },
    { month: 'Nov', income: 62000, expenses: 45000, cashflow: 17000 },
    { month: 'Dec', income: 60000, expenses: 48000, cashflow: 12000 },
    { month: 'Jan', income: 68500, expenses: 52000, cashflow: 16500 }
  ],

  recentTransactions: [
    {
      id: 'rt1',
      date: '2025-01-15',
      account: 'Nelson Sparebank',
      transactionType: 'expense',
      description: 'Groceries',
      amount: -136.69,
      category: 'Food'
    },
    {
      id: 'rt2',
      date: '2025-01-14',
      account: 'Nelson Sparebank',
      transactionType: 'expense',
      description: 'Outdoor Leisure',
      amount: -1000.00,
      category: 'Entertainment'
    },
    {
      id: 'rt3',
      date: '2025-01-13',
      account: 'Nelson Sparebank',
      transactionType: 'expense',
      description: 'Parking',
      amount: -35.00,
      category: 'Transportation'
    },
    {
      id: 'rt4',
      date: '2025-01-12',
      account: 'Nelson Sparebank',
      transactionType: 'income',
      description: 'Freelance Payment',
      amount: 2500.00,
      category: 'Freelance'
    },
    {
      id: 'rt5',
      date: '2025-01-11',
      account: 'Nelson Sparebank',
      transactionType: 'transfer',
      description: 'Savings Transfer',
      amount: -1500.00,
      category: 'Transfer'
    }
  ]
};