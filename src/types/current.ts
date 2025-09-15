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

export interface UpcomingTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  isRecurring: boolean;
}

export interface OverduePayment {
  id: string;
  date: string;
  description: string;
  amount: number;
  daysOverdue: number;
  category: string;
}

export interface RecentTransaction {
  id: string;
  date: string;
  account: string;
  transactionType: 'income' | 'expense' | 'transfer';
  description: string;
  amount: number;
  category: string;
}

export interface CategoryData {
  name: string;
  amount: number;
  type: 'income' | 'expense';
  color: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  cashflow: number;
}

export interface PaydayInfo {
  nextPaydayDate: string;
  daysUntilPayday: number;
  currentSaldo: number;
  remainingPayments: number;
  remainingPaymentsTotal: number;
  netLeftover: number;
}

export interface CurrentPageData {
  paydayInfo: PaydayInfo;
  upcomingTransactions: UpcomingTransaction[];
  overduePayments: OverduePayment[];
  categoryData: CategoryData[];
  monthlyData: MonthlyData[];
  recentTransactions: RecentTransaction[];
}