import type { 
  CurrentAccount, 
  UpcomingPayment, 
  RecentTransaction, 
  PaycheckInfo, 
  SpendingCategory,
  CashflowProjection,
  MoneyRecommendation
} from '../types/current';

// Mock data for current financial snapshot
export const mockCurrentAccounts: CurrentAccount[] = [
  {
    id: '1',
    name: 'Nelson Sparebank - Checking',
    type: 'checking',
    balance: 8420.50,
    availableBalance: 8420.50,
    currency: 'NOK',
    lastUpdated: '2025-01-15T10:30:00Z',
    status: 'active'
  },
  {
    id: '2',
    name: 'High Yield Savings',
    type: 'savings',
    balance: 47200.00,
    availableBalance: 47200.00,
    currency: 'NOK',
    lastUpdated: '2025-01-15T10:30:00Z',
    status: 'active'
  },
  {
    id: '3',
    name: 'Credit Card',
    type: 'credit',
    balance: -8500.00,
    availableBalance: 11500.00, // Available credit
    currency: 'NOK',
    lastUpdated: '2025-01-15T10:30:00Z',
    status: 'active'
  }
];

export const mockUpcomingPayments: UpcomingPayment[] = [
  {
    id: '1',
    dueDate: '2025-01-18',
    description: 'Phone Bill',
    amount: -99.00,
    category: 'utilities',
    priority: 'medium',
    status: 'scheduled',
    isRecurring: true
  },
  {
    id: '2',
    dueDate: '2025-01-20',
    description: 'Rent Payment',
    amount: -12000.00,
    category: 'housing',
    priority: 'high',
    status: 'scheduled',
    isRecurring: true
  },
  {
    id: '3',
    dueDate: '2025-01-22',
    description: 'Car Insurance',
    amount: -2500.00,
    category: 'insurance',
    priority: 'high',
    status: 'scheduled',
    isRecurring: false
  },
  {
    id: '4',
    dueDate: '2025-01-24',
    description: 'Internet Bill',
    amount: -273.75,
    category: 'utilities',
    priority: 'medium',
    status: 'scheduled',
    isRecurring: true
  },
  {
    id: '5',
    dueDate: '2025-01-08',
    description: 'Ema Allowance',
    amount: -1766.00,
    category: 'personal',
    priority: 'high',
    status: 'overdue',
    isRecurring: true,
    daysOverdue: 7
  },
  {
    id: '6',
    dueDate: '2025-01-08',
    description: 'Video/DVD/Movies',
    amount: 119.00,
    category: 'entertainment',
    priority: 'low',
    status: 'overdue',
    isRecurring: false,
    daysOverdue: 7
  }
];

export const mockRecentTransactions: RecentTransaction[] = [
  {
    id: '1',
    date: '2025-01-15',
    description: 'Groceries',
    amount: -136.69,
    category: 'Food',
    merchant: 'Rema 1000',
    status: 'completed'
  },
  {
    id: '2',
    date: '2025-01-14',
    description: 'Outdoor Leisure',
    amount: -1000.00,
    category: 'Entertainment',
    merchant: 'XXL Sport',
    status: 'completed'
  },
  {
    id: '3',
    date: '2025-01-13',
    description: 'Parking',
    amount: -35.00,
    category: 'Transportation',
    status: 'completed'
  },
  {
    id: '4',
    date: '2025-01-12',
    description: 'Freelance Payment',
    amount: 2500.00,
    category: 'Cash',
    status: 'completed'
  },
  {
    id: '5',
    date: '2025-01-11',
    description: 'Savings Transfer',
    amount: -1500.00,
    category: 'Transfer',
    status: 'completed'
  }
];

export const mockPaycheckInfo: PaycheckInfo = {
  nextPaycheckDate: '2025-01-31',
  daysUntilPaycheck: 16,
  estimatedAmount: 52000.00
};

export const mockSpendingCategories: SpendingCategory[] = [
  {
    name: 'Food & Dining',
    spent: 3200,
    budget: 4000,
    percentUsed: 80,
    remaining: 800,
    isOverBudget: false,
    color: '#ef4444'
  },
  {
    name: 'Transportation',
    spent: 1850,
    budget: 1500,
    percentUsed: 123,
    remaining: -350,
    isOverBudget: true,
    color: '#f97316'
  },
  {
    name: 'Entertainment',
    spent: 2200,
    budget: 2000,
    percentUsed: 110,
    remaining: -200,
    isOverBudget: true,
    color: '#8b5cf6'
  },
  {
    name: 'Utilities',
    spent: 850,
    budget: 1200,
    percentUsed: 71,
    remaining: 350,
    isOverBudget: false,
    color: '#3b82f6'
  }
];

export const mockCashflowProjections: CashflowProjection[] = [
  { date: '2025-01-15', projectedBalance: 8420.50, netFlow: 0 },
  { date: '2025-01-18', projectedBalance: 8321.50, netFlow: -99 },
  { date: '2025-01-20', projectedBalance: -3678.50, netFlow: -12000 },
  { date: '2025-01-22', projectedBalance: -6178.50, netFlow: -2500 },
  { date: '2025-01-24', projectedBalance: -6452.25, netFlow: -273.75 },
  { date: '2025-01-31', projectedBalance: 45547.75, netFlow: 52000 }
];

export const mockMoneyRecommendations: MoneyRecommendation[] = [
  {
    id: '1',
    type: 'emergency',
    title: 'Cover Upcoming Deficit',
    description: 'You\'ll be short NOK 6,452 before payday. Consider using savings or available credit.',
    amount: 6452,
    priority: 'high',
    impact: 'Prevents overdraft fees',
    action: 'Transfer from Savings'
  },
  {
    id: '2',
    type: 'pay_debt',
    title: 'Pay Overdue Items',
    description: 'You have NOK 1,647 in overdue payments. Pay these immediately to avoid late fees.',
    amount: 1647,
    priority: 'high',
    impact: 'Avoids late fees',
    action: 'Pay Now'
  },
  {
    id: '3',
    type: 'spend',
    title: 'Reduce Entertainment Spending',
    description: 'You\'re 10% over budget on entertainment. Consider reducing spending by NOK 200.',
    amount: 200,
    priority: 'medium',
    impact: 'Stay within budget',
    action: 'Review Subscriptions'
  }
];

export const mockCurrentPageData = {
  accounts: mockCurrentAccounts,
  upcomingPayments: mockUpcomingPayments,
  recentTransactions: mockRecentTransactions,
  paycheckInfo: mockPaycheckInfo,
  spendingCategories: mockSpendingCategories,
  cashflowProjections: mockCashflowProjections,
  recommendations: mockMoneyRecommendations,
  totalAvailable: mockCurrentAccounts.reduce((sum, acc) => sum + Math.max(0, acc.availableBalance), 0),
  netLeftover: -23934.05,
  overdueCount: mockUpcomingPayments.filter(p => p.status === 'overdue').length,
  daysUntilDeficit: 5,
  todaySpending: 485.50
};