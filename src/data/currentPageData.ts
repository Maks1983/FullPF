import type { CurrentPageData } from '../types/current';

export const mockCurrentPageData: CurrentPageData = {
  accounts: [
    {
      id: 'acc1',
      name: 'Main Checking',
      type: 'checking',
      balance: 2847.50,
      availableBalance: 2847.50,
      currency: 'NOK',
      lastUpdated: '2024-01-15T14:30:00Z',
      status: 'active',
      minimumBalance: 500,
      overdraftLimit: 1000
    },
    {
      id: 'acc2',
      name: 'Emergency Savings',
      type: 'savings',
      balance: 8420.00,
      availableBalance: 8420.00,
      currency: 'NOK',
      lastUpdated: '2024-01-15T14:30:00Z',
      status: 'active'
    },
    {
      id: 'acc3',
      name: 'Credit Card',
      type: 'credit',
      balance: -1250.00,
      availableBalance: 8750.00,
      currency: 'NOK',
      lastUpdated: '2024-01-15T14:30:00Z',
      status: 'active',
      creditLimit: 10000
    }
  ],

  upcomingPayments: [
    {
      id: 'pay1',
      description: 'Rent Payment',
      amount: -12000,
      dueDate: '2024-01-20',
      category: 'Housing',
      status: 'scheduled',
      isRecurring: true,
      accountId: 'acc1',
      priority: 'high'
    },
    {
      id: 'pay2',
      description: 'Credit Card Payment',
      amount: -1250,
      dueDate: '2024-01-12',
      category: 'Debt',
      status: 'overdue',
      isRecurring: true,
      accountId: 'acc1',
      daysOverdue: 3,
      priority: 'high'
    },
    {
      id: 'pay3',
      description: 'Phone Bill',
      amount: -699,
      dueDate: '2024-01-18',
      category: 'Utilities',
      status: 'scheduled',
      isRecurring: true,
      accountId: 'acc1',
      priority: 'medium'
    },
    {
      id: 'pay4',
      description: 'Netflix Subscription',
      amount: -159,
      dueDate: '2024-01-16',
      category: 'Entertainment',
      status: 'scheduled',
      isRecurring: true,
      accountId: 'acc1',
      priority: 'low'
    },
    {
      id: 'pay5',
      description: 'Car Insurance',
      amount: -2500,
      dueDate: '2024-01-25',
      category: 'Insurance',
      status: 'scheduled',
      isRecurring: false,
      accountId: 'acc1',
      priority: 'high'
    }
  ],

  recentTransactions: [
    {
      id: 'tx1',
      description: 'Grocery Store',
      amount: -485.50,
      date: '2024-01-15',
      category: 'Food',
      accountId: 'acc1',
      status: 'completed',
      merchant: 'Rema 1000'
    },
    {
      id: 'tx2',
      description: 'Gas Station',
      amount: -650.00,
      date: '2024-01-14',
      category: 'Transportation',
      accountId: 'acc1',
      status: 'completed',
      merchant: 'Shell'
    },
    {
      id: 'tx3',
      description: 'Coffee Shop',
      amount: -87.50,
      date: '2024-01-14',
      category: 'Food',
      accountId: 'acc1',
      status: 'completed',
      merchant: 'Starbucks'
    },
    {
      id: 'tx4',
      description: 'Online Transfer',
      amount: 2500.00,
      date: '2024-01-13',
      category: 'Transfer',
      accountId: 'acc1',
      status: 'completed'
    },
    {
      id: 'tx5',
      description: 'ATM Withdrawal',
      amount: -1000.00,
      date: '2024-01-13',
      category: 'Cash',
      accountId: 'acc1',
      status: 'completed'
    },
    // Premium transactions (6+)
    {
      id: 'tx6',
      description: 'Restaurant Dinner',
      amount: -420.00,
      date: '2024-01-12',
      category: 'Food',
      accountId: 'acc1',
      status: 'completed',
      merchant: 'Frognerseteren'
    },
    {
      id: 'tx7',
      description: 'Pharmacy',
      amount: -185.50,
      date: '2024-01-12',
      category: 'Healthcare',
      accountId: 'acc1',
      status: 'completed',
      merchant: 'Apotek 1'
    },
    {
      id: 'tx8',
      description: 'Streaming Service',
      amount: -159.00,
      date: '2024-01-11',
      category: 'Entertainment',
      accountId: 'acc1',
      status: 'completed',
      merchant: 'Netflix'
    }
  ],

  paycheckInfo: {
    nextPaycheckDate: '2024-01-31',
    daysUntilPaycheck: 16,
    expectedAmount: 52000,
    isEstimated: false
  },

  cashflowProjections: [
    { date: '2024-01-15', projectedBalance: 2847.50, scheduledIncome: 0, scheduledExpenses: 0, netFlow: 0 },
    { date: '2024-01-16', projectedBalance: 2688.50, scheduledIncome: 0, scheduledExpenses: -159, netFlow: -159 },
    { date: '2024-01-17', projectedBalance: 2688.50, scheduledIncome: 0, scheduledExpenses: 0, netFlow: 0 },
    { date: '2024-01-18', projectedBalance: 1989.50, scheduledIncome: 0, scheduledExpenses: -699, netFlow: -699 },
    { date: '2024-01-19', projectedBalance: 1989.50, scheduledIncome: 0, scheduledExpenses: 0, netFlow: 0 },
    { date: '2024-01-20', projectedBalance: -10010.50, scheduledIncome: 0, scheduledExpenses: -12000, netFlow: -12000 },
    { date: '2024-01-21', projectedBalance: -10010.50, scheduledIncome: 0, scheduledExpenses: 0, netFlow: 0 }
  ],

  spendingCategories: [
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
    },
    {
      name: 'Utilities',
      spent: 1200,
      budget: 2000,
      remaining: 800,
      percentUsed: 60,
      color: '#10b981',
      isOverBudget: false
    }
  ],

  totalAvailable: 19017.50,
  netLeftoverUntilPaycheck: -8608,
  overdueCount: 1,
  todaySpending: 485.50
};