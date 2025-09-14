export interface CurrentBalance {
  account: string;
  balance: number;
  available: number;
  pending: number;
  type: 'checking' | 'savings' | 'credit';
}

export interface UpcomingTransaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense' | 'transfer';
  status: 'scheduled' | 'pending' | 'overdue';
  account: string;
  isRecurring?: boolean;
}

export interface BudgetCategory {
  name: string;
  spent: number;
  budget: number;
  color: string;
  trend: 'up' | 'down' | 'neutral';
  daysLeft: number;
}

export interface CashflowProjection {
  date: string;
  balance: number;
  income: number;
  expenses: number;
  netFlow: number;
  isProjected: boolean;
}

export interface PaydayInfo {
  daysUntil: number;
  amount: number;
  date: string;
  confidence: 'high' | 'medium' | 'low';
}