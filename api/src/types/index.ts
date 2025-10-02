export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  currency: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'loan';
  balance: number;
  currency: string;
  isActive: boolean;
  institution?: string;
  accountNumber?: string;
  routingNumber?: string;
  interestRate?: number;
  creditLimit?: number;
  minimumBalance?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId?: string;
  amount: number;
  description: string;
  date: Date;
  type: 'income' | 'expense' | 'transfer';
  status: 'pending' | 'completed' | 'cancelled';
  merchant?: string;
  location?: string;
  notes?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  category: 'emergency' | 'savings' | 'investment' | 'debt' | 'purchase' | 'other';
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  linkedAccountId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TransactionFilters extends PaginationQuery {
  accountId?: string;
  categoryId?: string;
  type?: 'income' | 'expense' | 'transfer';
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export interface DashboardData {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  netWorth: number;
  savingsRate: number;
  recentTransactions: Transaction[];
  accountSummary: {
    checking: number;
    savings: number;
    credit: number;
    investment: number;
  };
  monthlyTrends: {
    month: string;
    income: number;
    expenses: number;
    netFlow: number;
  }[];
  categoryBreakdown: {
    categoryId: string;
    categoryName: string;
    amount: number;
    percentage: number;
  }[];
  goalProgress: {
    goalId: string;
    goalName: string;
    progress: number;
    targetAmount: number;
    currentAmount: number;
  }[];
}

export interface AnalyticsData {
  cashflowTrend: {
    month: string;
    income: number;
    expenses: number;
    netFlow: number;
  }[];
  spendingByCategory: {
    categoryName: string;
    amount: number;
    percentage: number;
    trend: number;
  }[];
  netWorthHistory: {
    month: string;
    assets: number;
    liabilities: number;
    netWorth: number;
  }[];
  savingsRate: {
    month: string;
    rate: number;
  }[];
}