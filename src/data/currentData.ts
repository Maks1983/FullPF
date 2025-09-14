import type { 
  CurrentBalance, 
  UpcomingTransaction, 
  BudgetCategory, 
  CashflowProjection,
  PaydayInfo 
} from '../types/current';

export const currentBalances: CurrentBalance[] = [
  {
    account: 'Main Checking',
    balance: 4256.78,
    available: 4256.78,
    pending: 0,
    type: 'checking'
  },
  {
    account: 'High Yield Savings',
    balance: 15420.50,
    available: 15420.50,
    pending: 0,
    type: 'savings'
  },
  {
    account: 'Credit Card',
    balance: -2847.32,
    available: 7152.68,
    pending: -156.90,
    type: 'credit'
  }
];

export const upcomingTransactions: UpcomingTransaction[] = [
  {
    id: '1',
    description: 'Salary Deposit',
    amount: 52000,
    date: '2024-01-31',
    category: 'Income',
    type: 'income',
    status: 'scheduled',
    account: 'Main Checking',
    isRecurring: true
  },
  {
    id: '2',
    description: 'Rent Payment',
    amount: -12000,
    date: '2024-01-15',
    category: 'Housing',
    type: 'expense',
    status: 'scheduled',
    account: 'Main Checking',
    isRecurring: true
  },
  {
    id: '3',
    description: 'Netflix Subscription',
    amount: -159,
    date: '2024-01-16',
    category: 'Entertainment',
    type: 'expense',
    status: 'scheduled',
    account: 'Credit Card',
    isRecurring: true
  },
  {
    id: '4',
    description: 'Car Insurance',
    amount: -2500,
    date: '2024-01-18',
    category: 'Insurance',
    type: 'expense',
    status: 'scheduled',
    account: 'Main Checking',
    isRecurring: true
  },
  {
    id: '5',
    description: 'Utility Bill',
    amount: -755,
    date: '2024-01-12',
    category: 'Utilities',
    type: 'expense',
    status: 'overdue',
    account: 'Main Checking'
  }
];

export const budgetCategories: BudgetCategory[] = [
  {
    name: 'Food & Dining',
    spent: 3420,
    budget: 4000,
    color: '#10b981',
    trend: 'up',
    daysLeft: 18
  },
  {
    name: 'Transportation',
    spent: 2100,
    budget: 2500,
    color: '#3b82f6',
    trend: 'neutral',
    daysLeft: 18
  },
  {
    name: 'Entertainment',
    spent: 1250,
    budget: 1000,
    color: '#ef4444',
    trend: 'up',
    daysLeft: 18
  },
  {
    name: 'Shopping',
    spent: 890,
    budget: 1500,
    color: '#8b5cf6',
    trend: 'down',
    daysLeft: 18
  },
  {
    name: 'Health & Fitness',
    spent: 340,
    budget: 800,
    color: '#f59e0b',
    trend: 'neutral',
    daysLeft: 18
  }
];

export const cashflowProjection: CashflowProjection[] = [
  { date: '2024-01-13', balance: 4256.78, income: 0, expenses: -755, netFlow: -755, isProjected: false },
  { date: '2024-01-15', balance: 3501.78, income: 0, expenses: -12000, netFlow: -12000, isProjected: true },
  { date: '2024-01-16', balance: -8498.22, income: 0, expenses: -159, netFlow: -159, isProjected: true },
  { date: '2024-01-18', balance: -8657.22, income: 0, expenses: -2500, netFlow: -2500, isProjected: true },
  { date: '2024-01-31', balance: -11157.22, income: 52000, expenses: 0, netFlow: 52000, isProjected: true },
  { date: '2024-02-01', balance: 40842.78, income: 0, expenses: 0, netFlow: 0, isProjected: true }
];

export const paydayInfo: PaydayInfo = {
  daysUntil: 18,
  amount: 52000,
  date: '2024-01-31',
  confidence: 'high'
};