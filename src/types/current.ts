export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  availableBalance: number;
  currency: string;
  lastUpdated: string;
  status: 'active' | 'low' | 'overdrawn' | 'frozen';
  creditLimit?: number;
  interestRate?: number;
  minimumBalance?: number;
}

export interface DailyTransaction {
  id: string;
  accountId: string;
  description: string;
  amount: number;
  category: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  merchant?: string;
  location?: string;
  recurring?: boolean;
}

export interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  remaining: number;
  daysLeft: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
  icon: string;
}

export interface PaydayInfo {
  nextPayday: string;
  daysUntilPayday: number;
  expectedAmount: number;
  confidence: 'high' | 'medium' | 'low';
  projectedBalance: number;
  isDeficit: boolean;
}

export interface DailySpending {
  date: string;
  totalSpent: number;
  transactionCount: number;
  topCategory: string;
  budgetUtilization: number;
}

export interface CurrentPageData {
  accounts: Account[];
  todayTransactions: DailyTransaction[];
  recentTransactions: DailyTransaction[];
  budgetCategories: BudgetCategory[];
  paydayInfo: PaydayInfo;
  dailySpending: DailySpending[];
  totalNetWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}
</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">create</parameter>
<parameter name="path">src/data/currentData.ts</parameter>
<parameter name="file_text">import type { CurrentPageData } from '../types/current';

export const currentPageData: CurrentPageData = {
  accounts: [
    {
      id: '1',
      name: 'Main Checking',
      type: 'checking',
      balance: 2847.50,
      availableBalance: 2847.50,
      currency: 'NOK',
      lastUpdated: '2024-01-15T10:30:00Z',
      status: 'active',
      minimumBalance: 500
    },
    {
      id: '2',
      name: 'High Yield Savings',
      type: 'savings',
      balance: 15420.00,
      availableBalance: 15420.00,
      currency: 'NOK',
      lastUpdated: '2024-01-15T09:15:00Z',
      status: 'active',
      interestRate: 4.2
    },
    {
      id: '3',
      name: 'Credit Card',
      type: 'credit',
      balance: -1250.00,
      availableBalance: 8750.00,
      currency: 'NOK',
      lastUpdated: '2024-01-15T11:45:00Z',
      status: 'active',
      creditLimit: 10000,
      interestRate: 18.9
    }
  ],
  
  todayTransactions: [
    {
      id: 't1',
      accountId: '1',
      description: 'Morning Coffee',
      amount: -45.00,
      category: 'Food & Dining',
      timestamp: '2024-01-15T08:30:00Z',
      status: 'completed',
      merchant: 'Starbucks',
      location: 'Oslo City'
    },
    {
      id: 't2',
      accountId: '3',
      description: 'Grocery Shopping',
      amount: -320.50,
      category: 'Groceries',
      timestamp: '2024-01-15T12:15:00Z',
      status: 'pending',
      merchant: 'Rema 1000'
    },
    {
      id: 't3',
      accountId: '1',
      description: 'Gas Station',
      amount: -450.00,
      category: 'Transportation',
      timestamp: '2024-01-15T14:20:00Z',
      status: 'completed',
      merchant: 'Shell'
    },
    {
      id: 't4',
      accountId: '1',
      description: 'Salary Deposit',
      amount: 52000.00,
      category: 'Income',
      timestamp: '2024-01-15T06:00:00Z',
      status: 'completed',
      recurring: true
    }
  ],

  recentTransactions: [
    {
      id: 'r1',
      accountId: '1',
      description: 'Netflix Subscription',
      amount: -159.00,
      category: 'Entertainment',
      timestamp: '2024-01-14T10:00:00Z',
      status: 'completed',
      recurring: true
    },
    {
      id: 'r2',
      accountId: '2',
      description: 'Interest Payment',
      amount: 52.30,
      category: 'Income',
      timestamp: '2024-01-14T00:01:00Z',
      status: 'completed'
    },
    {
      id: 'r3',
      accountId: '3',
      description: 'Online Shopping',
      amount: -890.00,
      category: 'Shopping',
      timestamp: '2024-01-13T16:45:00Z',
      status: 'completed',
      merchant: 'Amazon'
    }
  ],

  budgetCategories: [
    {
      id: 'b1',
      name: 'Food & Dining',
      budgeted: 4000,
      spent: 2850,
      remaining: 1150,
      daysLeft: 16,
      trend: 'up',
      color: '#ef4444',
      icon: 'utensils'
    },
    {
      id: 'b2',
      name: 'Transportation',
      budgeted: 2500,
      spent: 1680,
      remaining: 820,
      daysLeft: 16,
      trend: 'stable',
      color: '#3b82f6',
      icon: 'car'
    },
    {
      id: 'b3',
      name: 'Entertainment',
      budgeted: 1500,
      spent: 1650,
      remaining: -150,
      daysLeft: 16,
      trend: 'up',
      color: '#8b5cf6',
      icon: 'film'
    },
    {
      id: 'b4',
      name: 'Shopping',
      budgeted: 3000,
      spent: 1890,
      remaining: 1110,
      daysLeft: 16,
      trend: 'down',
      color: '#10b981',
      icon: 'shopping-bag'
    }
  ],

  paydayInfo: {
    nextPayday: '2024-01-31',
    daysUntilPayday: 16,
    expectedAmount: 52000,
    confidence: 'high',
    projectedBalance: 48500,
    isDeficit: false
  },

  dailySpending: [
    { date: '2024-01-09', totalSpent: 1250, transactionCount: 8, topCategory: 'Groceries', budgetUtilization: 0.15 },
    { date: '2024-01-10', totalSpent: 890, transactionCount: 5, topCategory: 'Transportation', budgetUtilization: 0.12 },
    { date: '2024-01-11', totalSpent: 2100, transactionCount: 12, topCategory: 'Shopping', budgetUtilization: 0.28 },
    { date: '2024-01-12', totalSpent: 650, transactionCount: 6, topCategory: 'Food & Dining', budgetUtilization: 0.09 },
    { date: '2024-01-13', totalSpent: 1450, transactionCount: 9, topCategory: 'Entertainment', budgetUtilization: 0.19 },
    { date: '2024-01-14', totalSpent: 780, transactionCount: 4, topCategory: 'Food & Dining', budgetUtilization: 0.11 },
    { date: '2024-01-15', totalSpent: 815, transactionCount: 3, topCategory: 'Food & Dining', budgetUtilization: 0.11 }
  ],

  totalNetWorth: 17017.50,
  monthlyIncome: 52000,
  monthlyExpenses: 38500
};
</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">create</parameter>
<parameter name="path">src/hooks/useCurrentData.ts</parameter>
<parameter name="file_text">import { useMemo } from 'react';
import { currentPageData } from '../data/currentData';
import type { CurrentPageData } from '../types/current';

export const useCurrentData = () => {
  return useMemo(() => {
    const data = currentPageData;
    
    // Calculate derived metrics
    const totalBalance = data.accounts.reduce((sum, account) => {
      return sum + (account.type === 'credit' ? account.availableBalance : account.balance);
    }, 0);

    const todaySpending = data.todayTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const todayIncome = data.todayTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const netCashflow = todayIncome - todaySpending;

    const overBudgetCategories = data.budgetCategories.filter(cat => cat.remaining < 0);
    
    const budgetHealthScore = data.budgetCategories.reduce((score, cat) => {
      const utilization = cat.spent / cat.budgeted;
      if (utilization <= 0.7) return score + 25;
      if (utilization <= 0.9) return score + 15;
      if (utilization <= 1.0) return score + 5;
      return score;
    }, 0);

    // Account status summary
    const accountSummary = {
      total: data.accounts.length,
      active: data.accounts.filter(a => a.status === 'active').length,
      lowBalance: data.accounts.filter(a => 
        a.type !== 'credit' && a.minimumBalance && a.balance < a.minimumBalance
      ).length,
      overdrawn: data.accounts.filter(a => a.status === 'overdrawn').length
    };

    return {
      ...data,
      metrics: {
        totalBalance,
        todaySpending,
        todayIncome,
        netCashflow,
        overBudgetCategories: overBudgetCategories.length,
        budgetHealthScore,
        accountSummary
      }
    };
  }, []);
};
</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">create</parameter>
<parameter name="path">src/components/current/AccountBalanceCard.tsx</parameter>
<parameter name="file_text">import React from 'react';
import { CreditCard, Wallet, PiggyBank, AlertTriangle, Clock } from 'lucide-react';
import type { Account } from '../../types/current';

interface AccountBalanceCardProps {
  account: Account;
}

const AccountBalanceCard: React.FC<AccountBalanceCardProps> = ({ account }) => {
  const getAccountIcon = () => {
    switch (account.type) {
      case 'checking': return Wallet;
      case 'savings': return PiggyBank;
      case 'credit': return CreditCard;
      default: return Wallet;
    }
  };

  const getStatusColor = () => {
    switch (account.status) {
      case 'active': return 'text-green-600';
      case 'low': return 'text-yellow-600';
      case 'overdrawn': return 'text-red-600';
      case 'frozen': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getBalanceColor = () => {
    if (account.type === 'credit') {
      const utilization = Math.abs(account.balance) / (account.creditLimit || 1);
      if (utilization > 0.8) return 'text-red-600';
      if (utilization > 0.5) return 'text-yellow-600';
      return 'text-green-600';
    }
    
    if (account.minimumBalance && account.balance < account.minimumBalance) {
      return 'text-red-600';
    }
    
    return account.balance > 0 ? 'text-green-600' : 'text-red-600';
  };

  const formatBalance = (balance: number) => {
    return `${balance >= 0 ? '' : '-'}${account.currency} ${Math.abs(balance).toLocaleString()}`;
  };

  const Icon = getAccountIcon();
  const isLowBalance = account.type !== 'credit' && account.minimumBalance && account.balance < account.minimumBalance;
  const isHighCreditUtilization = account.type === 'credit' && account.creditLimit && 
    Math.abs(account.balance) / account.creditLimit > 0.8;

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border transition-all hover:shadow-md ${
      isLowBalance || isHighCreditUtilization ? 'border-red-200 bg-red-50' : 'border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            account.type === 'checking' ? 'bg-blue-100 text-blue-600' :
            account.type === 'savings' ? 'bg-green-100 text-green-600' :
            'bg-purple-100 text-purple-600'
          }`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{account.name}</h3>
            <p className="text-sm text-gray-600 capitalize">{account.type} Account</p>
          </div>
        </div>
        
        {(isLowBalance || isHighCreditUtilization) && (
          <AlertTriangle className="h-5 w-5 text-red-500" />
        )}
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-600 mb-1">
            {account.type === 'credit' ? 'Current Balance' : 'Available Balance'}
          </p>
          <p className={`text-2xl font-bold ${getBalanceColor()}`}>
            {formatBalance(account.type === 'credit' ? account.balance : account.availableBalance)}
          </p>
        </div>

        {account.type === 'credit' && account.creditLimit && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Credit Utilization</span>
              <span className="font-medium">
                {((Math.abs(account.balance) / account.creditLimit) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  Math.abs(account.balance) / account.creditLimit > 0.8 ? 'bg-red-500' :
                  Math.abs(account.balance) / account.creditLimit > 0.5 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${(Math.abs(account.balance) / account.creditLimit) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Available: {formatBalance(account.availableBalance)}
            </p>
          </div>
        )}

        {account.interestRate && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Interest Rate</span>
            <span className="font-medium">{account.interestRate}% APY</span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>Updated {new Date(account.lastUpdated).toLocaleTimeString()}</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()} bg-current bg-opacity-10`}>
            {account.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccountBalanceCard;
</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">create</parameter>
<parameter name="path">src/components/current/PaydayCountdown.tsx</parameter>
<parameter name="file_text">import React from 'react';
import { Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import type { PaydayInfo } from '../../types/current';

interface PaydayCountdownProps {
  paydayInfo: PaydayInfo;
  currentBalance: number;
}

const PaydayCountdown: React.FC<PaydayCountdownProps> = ({ paydayInfo, currentBalance }) => {
  const { daysUntilPayday, expectedAmount, projectedBalance, isDeficit, confidence } = paydayInfo;
  
  const progressPercentage = Math.max(0, Math.min(100, ((30 - daysUntilPayday) / 30) * 100));
  
  const getConfidenceColor = () => {
    switch (confidence) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getBalanceColor = () => {
    if (isDeficit) return 'text-red-600';
    if (projectedBalance < 5000) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border transition-all hover:shadow-md ${
      isDeficit ? 'border-red-200 bg-red-50' : 'border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Next Payday</h3>
            <p className="text-sm text-gray-600">
              {new Date(paydayInfo.nextPayday).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        
        {isDeficit && (
          <AlertTriangle className="h-5 w-5 text-red-500" />
        )}
      </div>

      {/* Countdown Circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke={isDeficit ? '#ef4444' : '#3b82f6'}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${progressPercentage * 3.14} 314`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${isDeficit ? 'text-red-600' : 'text-blue-600'}`}>
              {daysUntilPayday}
            </span>
            <span className="text-sm text-gray-600">days</span>
          </div>
        </div>
      </div>

      {/* Financial Projections */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Expected Amount</span>
          <div className="flex items-center space-x-2">
            <span className="font-semibold">NOK {expectedAmount.toLocaleString()}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor()} bg-current bg-opacity-10`}>
              {confidence}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Current Balance</span>
          <span className="font-semibold">NOK {currentBalance.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-sm font-medium text-gray-900">Projected Balance</span>
          <div className="flex items-center space-x-2">
            <span className={`font-bold ${getBalanceColor()}`}>
              NOK {projectedBalance.toLocaleString()}
            </span>
            {isDeficit ? (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingUp className="h-4 w-4 text-green-500" />
            )}
          </div>
        </div>

        {isDeficit && (
          <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              ⚠️ Projected deficit of NOK {Math.abs(projectedBalance).toLocaleString()}. 
              Consider reducing expenses or transferring from savings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaydayCountdown;
</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">create</parameter>
<parameter name="path">src/components/current/BudgetProgressCard.tsx</parameter>
<parameter name="file_text">import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import type { BudgetCategory } from '../../types/current';

interface BudgetProgressCardProps {
  categories: BudgetCategory[];
}

const BudgetProgressCard: React.FC<BudgetProgressCardProps> = ({ categories }) => {
  const overBudgetCount = categories.filter(cat => cat.remaining < 0).length;
  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const overallUtilization = (totalSpent / totalBudgeted) * 100;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      case 'stable': return Minus;
      default: return Minus;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-red-500';
      case 'down': return 'text-green-500';
      case 'stable': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border transition-all hover:shadow-md ${
      overBudgetCount > 0 ? 'border-red-200' : 'border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900">Budget Progress</h3>
          <p className="text-sm text-gray-600">
            {overallUtilization.toFixed(1)}% of monthly budget used
          </p>
        </div>
        {overBudgetCount > 0 && (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-sm font-medium">{overBudgetCount} over budget</span>
          </div>
        )}
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Overall Progress</span>
          <span className="font-medium">
            NOK {totalSpent.toLocaleString()} / {totalBudgeted.toLocaleString()}
          </span>
        </div>
        <div className="bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all ${
              overallUtilization > 100 ? 'bg-red-500' :
              overallUtilization > 80 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ width: `${Math.min(overallUtilization, 100)}%` }}
          />
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-4">
        {categories.map((category) => {
          const utilization = (category.spent / category.budgeted) * 100;
          const isOverBudget = category.remaining < 0;
          const TrendIcon = getTrendIcon(category.trend);

          return (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{category.name}</span>
                  <TrendIcon className={`h-4 w-4 ${getTrendColor(category.trend)}`} />
                </div>
                <div className="text-right">
                  <span className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
                    NOK {category.spent.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-600 ml-1">
                    / {category.budgeted.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    isOverBudget ? 'bg-red-500' :
                    utilization > 80 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(utilization, 100)}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs">
                <span className={`${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
                  {isOverBudget ? 
                    `Over by NOK ${Math.abs(category.remaining).toLocaleString()}` :
                    `NOK ${category.remaining.toLocaleString()} remaining`
                  }
                </span>
                <span className="text-gray-500">
                  {category.daysLeft} days left
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Budget Health Summary */}
      <div className="mt-6 pt-4 border-t">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">
              {categories.filter(c => c.remaining > 0).length}
            </p>
            <p className="text-xs text-gray-600">On Track</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">
              {categories.filter(c => c.remaining <= 0 && c.remaining >= -c.budgeted * 0.1).length}
            </p>
            <p className="text-xs text-gray-600">At Limit</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{overBudgetCount}</p>
            <p className="text-xs text-gray-600">Over Budget</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetProgressCard;
</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">create</parameter>
<parameter name="path">src/components/current/DailySpendingChart.tsx</parameter>
<parameter name="file_text">import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { DailySpending } from '../../types/current';

interface DailySpendingChartProps {
  data: DailySpending[];
  todaySpending: number;
}

const DailySpendingChart: React.FC<DailySpendingChartProps> = ({ data, todaySpending }) => {
  const maxSpending = Math.max(...data.map(d => d.totalSpent));
  const avgSpending = data.reduce((sum, d) => sum + d.totalSpent, 0) / data.length;
  const todayVsAvg = ((todaySpending - avgSpending) / avgSpending) * 100;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900">Daily Spending Trend</h3>
          <p className="text-sm text-gray-600">Last 7 days spending pattern</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            NOK {todaySpending.toLocaleString()}
          </p>
          <div className="flex items-center space-x-1">
            {todayVsAvg > 0 ? (
              <TrendingUp className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-500" />
            )}
            <span className={`text-sm font-medium ${
              todayVsAvg > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {Math.abs(todayVsAvg).toFixed(1)}% vs avg
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-32 mb-4">
        <div className="absolute inset-0 flex items-end justify-between space-x-1">
          {data.map((day, index) => {
            const height = (day.totalSpent / maxSpending) * 100;
            const isToday = index === data.length - 1;
            
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full rounded-t transition-all hover:opacity-80 cursor-pointer ${
                    isToday ? 'bg-blue-500' : 
                    day.totalSpent > avgSpending ? 'bg-red-400' : 'bg-green-400'
                  }`}
                  style={{ height: `${height}%` }}
                  title={`${new Date(day.date).toLocaleDateString()}: NOK ${day.totalSpent.toLocaleString()}`}
                />
              </div>
            );
          })}
        </div>
        
        {/* Average line */}
        <div 
          className="absolute left-0 right-0 border-t-2 border-dashed border-gray-400 opacity-50"
          style={{ bottom: `${(avgSpending / maxSpending) * 100}%` }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-gray-500 mb-4">
        {data.map((day) => (
          <span key={day.date} className="flex-1 text-center">
            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
          </span>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">
            NOK {avgSpending.toFixed(0)}
          </p>
          <p className="text-xs text-gray-600">Daily Average</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">
            {data.reduce((sum, d) => sum + d.transactionCount, 0)}
          </p>
          <p className="text-xs text-gray-600">Total Transactions</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">
            {(data.reduce((sum, d) => sum + d.budgetUtilization, 0) / data.length * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-gray-600">Avg Budget Use</p>
        </div>
      </div>
    </div>
  );
};

export default DailySpendingChart;
</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">create</parameter>
<parameter name="path">src/components/current/TransactionsList.tsx</parameter>
<parameter name="file_text">import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle, 
  XCircle,
  Repeat,
  MapPin,
  Filter
} from 'lucide-react';
import type { DailyTransaction } from '../../types/current';

interface TransactionsListProps {
  transactions: DailyTransaction[];
  title: string;
  showFilters?: boolean;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ 
  transactions, 
  title, 
  showFilters = false 
}) => {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'time' | 'amount'>('time');

  const filteredTransactions = transactions.filter(transaction => {
    switch (filter) {
      case 'income': return transaction.amount > 0;
      case 'expense': return transaction.amount < 0;
      case 'pending': return transaction.status === 'pending';
      default: return true;
    }
  }).sort((a, b) => {
    if (sortBy === 'amount') {
      return Math.abs(b.amount) - Math.abs(a.amount);
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'pending': return Clock;
      case 'failed': return XCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Food & Dining': 'bg-red-100 text-red-800',
      'Transportation': 'bg-blue-100 text-blue-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Shopping': 'bg-green-100 text-green-800',
      'Groceries': 'bg-orange-100 text-orange-800',
      'Income': 'bg-emerald-100 text-emerald-800',
      'Utilities': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">
              {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {showFilters && (
            <div className="flex items-center space-x-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expenses</option>
                <option value="pending">Pending</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="time">By Time</option>
                <option value="amount">By Amount</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No transactions found</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => {
            const StatusIcon = getStatusIcon(transaction.status);
            const isIncome = transaction.amount > 0;
            
            return (
              <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      isIncome ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {isIncome ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {transaction.description}
                        </h4>
                        {transaction.recurring && (
                          <Repeat className="h-4 w-4 text-blue-500" />
                        )}
                        <StatusIcon className={`h-4 w-4 ${getStatusColor(transaction.status)}`} />
                      </div>
                      
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                          {transaction.category}
                        </span>
                        
                        {transaction.merchant && (
                          <span>{transaction.merchant}</span>
                        )}
                        
                        {transaction.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{transaction.location}</span>
                          </div>
                        )}
                        
                        <span>
                          {new Date(transaction.timestamp).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-bold ${
                      isIncome ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isIncome ? '+' : '-'}NOK {Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {transaction.status}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TransactionsList;
</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">create</parameter>
<parameter name="path">src/pages/CurrentPage.tsx</parameter>
<parameter name="file_text">import React from 'react';
import { useCurrentData } from '../hooks/useCurrentData';
import AccountBalanceCard from '../components/current/AccountBalanceCard';
import PaydayCountdown from '../components/current/PaydayCountdown';
import BudgetProgressCard from '../components/current/BudgetProgressCard';
import DailySpendingChart from '../components/current/DailySpendingChart';
import TransactionsList from '../components/current/TransactionsList';
import { Wallet, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

const CurrentPage = () => {
  const { 
    accounts, 
    todayTransactions, 
    recentTransactions, 
    budgetCategories, 
    paydayInfo, 
    dailySpending,
    metrics 
  } = useCurrentData();

  const { 
    totalBalance, 
    todaySpending, 
    todayIncome, 
    netCashflow, 
    overBudgetCategories,
    budgetHealthScore,
    accountSummary 
  } = metrics;

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Current Overview</h1>
        <p className="text-gray-600 mt-1">
          Real-time view of your accounts, spending, and daily financial activity
        </p>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
            <Wallet className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            NOK {totalBalance.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Across {accountSummary.total} accounts
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Today's Spending</h3>
            <TrendingDown className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600">
            NOK {todaySpending.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {todayTransactions.filter(t => t.amount < 0).length} transactions
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Today's Income</h3>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">
            NOK {todayIncome.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {todayTransactions.filter(t => t.amount > 0).length} deposits
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Net Cashflow</h3>
            {netCashflow >= 0 ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
          </div>
          <p className={`text-2xl font-bold ${netCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {netCashflow >= 0 ? '+' : ''}NOK {netCashflow.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">Today's net flow</p>
        </div>
      </div>

      {/* Alerts Section */}
      {(accountSummary.lowBalance > 0 || overBudgetCategories > 0 || paydayInfo.isDeficit) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-900">Financial Alerts</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {accountSummary.lowBalance > 0 && (
              <div className="flex items-center space-x-2 text-red-800">
                <div className="w-2 h-2 bg-red-600 rounded-full" />
                <span>{accountSummary.lowBalance} account(s) below minimum balance</span>
              </div>
            )}
            {overBudgetCategories > 0 && (
              <div className="flex items-center space-x-2 text-red-800">
                <div className="w-2 h-2 bg-red-600 rounded-full" />
                <span>{overBudgetCategories} budget categories over limit</span>
              </div>
            )}
            {paydayInfo.isDeficit && (
              <div className="flex items-center space-x-2 text-red-800">
                <div className="w-2 h-2 bg-red-600 rounded-full" />
                <span>Projected deficit before next payday</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Account Balances */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Balances</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <AccountBalanceCard key={account.id} account={account} />
          ))}
        </div>
      </div>

      {/* Payday & Budget Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaydayCountdown 
          paydayInfo={paydayInfo} 
          currentBalance={totalBalance}
        />
        <BudgetProgressCard categories={budgetCategories} />
      </div>

      {/* Daily Spending Chart */}
      <DailySpendingChart 
        data={dailySpending} 
        todaySpending={todaySpending}
      />

      {/* Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionsList 
          transactions={todayTransactions}
          title="Today's Transactions"
          showFilters={true}
        />
        <TransactionsList 
          transactions={recentTransactions}
          title="Recent Activity"
        />
      </div>

      {/* Budget Health Score */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Budget Health Score</h3>
            <p className="text-gray-600">Based on spending patterns and budget adherence</p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${
              budgetHealthScore >= 80 ? 'text-green-600' :
              budgetHealthScore >= 60 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {budgetHealthScore}
            </div>
            <p className="text-sm text-gray-600">out of 100</p>
          </div>
        </div>
        
        <div className="mt-4 bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all ${
              budgetHealthScore >= 80 ? 'bg-green-500' :
              budgetHealthScore >= 60 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${budgetHealthScore}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default CurrentPage;
</parameter>
</invoke>
<invoke name="shell">
<parameter name="command">rm src/components/CurrentPage.tsx</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">str_replace</parameter>
<parameter name="path">src/App.tsx</parameter>
<parameter name="old_str">import CurrentPage from './components/CurrentPage';</parameter>
<parameter name="new_str">import CurrentPage from './pages/CurrentPage';</parameter>
</invoke>