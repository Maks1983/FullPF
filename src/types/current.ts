export interface CurrentAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  availableBalance: number;
  currency: string;
  lastUpdated: string;
  status: 'active' | 'low' | 'overdrawn' | 'frozen';
  creditLimit?: number;
  minimumBalance?: number;
  overdraftLimit?: number;
}

export interface UpcomingPayment {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  category: string;
  status: 'scheduled' | 'overdue' | 'paid';
  isRecurring: boolean;
  accountId: string;
  daysOverdue?: number;
  priority: 'high' | 'medium' | 'low';
}

export interface RecentTransaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  accountId: string;
  status: 'completed' | 'pending';
  merchant?: string;
}

export interface PaycheckInfo {
  nextPaycheckDate: string;
  daysUntilPaycheck: number;
  expectedAmount: number;
  isEstimated: boolean;
}

export interface CashflowProjection {
  date: string;
  projectedBalance: number;
  scheduledIncome: number;
  scheduledExpenses: number;
  netFlow: number;
}

export interface SpendingCategory {
  name: string;
  spent: number;
  budget: number;
  remaining: number;
  percentUsed: number;
  color: string;
  isOverBudget: boolean;
}

export interface CurrentPageData {
  accounts: CurrentAccount[];
  upcomingPayments: UpcomingPayment[];
  recentTransactions: RecentTransaction[];
  paycheckInfo: PaycheckInfo;
  cashflowProjections: CashflowProjection[];
  spendingCategories: SpendingCategory[];
  totalAvailable: number;
  netLeftoverUntilPaycheck: number;
  overdueCount: number;
  totalMonthlyIncome: number;
  totalMonthlyExpenses: number;
}

