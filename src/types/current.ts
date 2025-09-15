export interface CurrentAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  availableBalance: number;
  currency: string;
  lastUpdated: string;
  status: 'active' | 'low' | 'overdrawn' | 'frozen';
}

export interface UpcomingPayment {
  id: string;
  dueDate: string;
  description: string;
  amount: number;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'scheduled' | 'overdue' | 'paid';
  isRecurring: boolean;
  daysOverdue?: number;
}

export interface RecentTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  merchant?: string;
  status: 'completed' | 'pending';
}

export interface PaycheckInfo {
  nextPaycheckDate: string;
  daysUntilPaycheck: number;
  estimatedAmount: number;
}

export interface SpendingCategory {
  name: string;
  spent: number;
  budget: number;
  percentUsed: number;
  remaining: number;
  isOverBudget: boolean;
  color: string;
}

export interface CashflowProjection {
  date: string;
  projectedBalance: number;
  netFlow: number;
}

export interface MoneyRecommendation {
  id: string;
  type: 'save' | 'invest' | 'pay_debt' | 'emergency' | 'spend';
  title: string;
  description: string;
  amount: number;
  priority: 'high' | 'medium' | 'low';
  impact: string;
  action: string;
}