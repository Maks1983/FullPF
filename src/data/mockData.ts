// Mock data for the financial dashboard
import type { CashflowData, NetWorthData, PortfolioData, HealthScoreData } from '../types/financial';
import type { Goal } from '../types/financial';

// Enhanced mock data with proper typing
export const allCashflowData = {
  '1M': [
    { month: 'Dec', income: 52000, expenses: 44000, predicted: false },
  ],
  '3M': [
    { month: 'Oct', income: 52000, expenses: 42000, predicted: false },
    { month: 'Nov', income: 54000, expenses: 41000, predicted: false },
    { month: 'Dec', income: 52000, expenses: 44000, predicted: false },
  ],
  '6M': [
    { month: 'Jul', income: 52000, expenses: 40000, predicted: false },
    { month: 'Aug', income: 55000, expenses: 41500, predicted: false },
    { month: 'Sep', income: 52000, expenses: 43000, predicted: false },
    { month: 'Oct', income: 52000, expenses: 42000, predicted: false },
    { month: 'Nov', income: 54000, expenses: 41000, predicted: false },
    { month: 'Dec', income: 52000, expenses: 44000, predicted: false },
  ],
  '1Y': [
    { month: 'Jan', income: 48000, expenses: 38000, predicted: false },
    { month: 'Feb', income: 49000, expenses: 39000, predicted: false },
    { month: 'Mar', income: 51000, expenses: 40000, predicted: false },
    { month: 'Apr', income: 50000, expenses: 41000, predicted: false },
    { month: 'May', income: 53000, expenses: 42000, predicted: false },
    { month: 'Jun', income: 52000, expenses: 41000, predicted: false },
    { month: 'Jul', income: 52000, expenses: 40000, predicted: false },
    { month: 'Aug', income: 55000, expenses: 41500, predicted: false },
    { month: 'Sep', income: 52000, expenses: 43000, predicted: false },
    { month: 'Oct', income: 52000, expenses: 42000, predicted: false },
    { month: 'Nov', income: 54000, expenses: 41000, predicted: false },
    { month: 'Dec', income: 52000, expenses: 44000, predicted: false },
  ],
  'ALL': [
    { month: 'Jan', income: 48000, expenses: 38000, predicted: false },
    { month: 'Feb', income: 49000, expenses: 39000, predicted: false },
    { month: 'Mar', income: 51000, expenses: 40000, predicted: false },
    { month: 'Apr', income: 50000, expenses: 41000, predicted: false },
    { month: 'May', income: 53000, expenses: 42000, predicted: false },
    { month: 'Jun', income: 52000, expenses: 41000, predicted: false },
    { month: 'Jul', income: 52000, expenses: 40000, predicted: false },
    { month: 'Aug', income: 55000, expenses: 41500, predicted: false },
    { month: 'Sep', income: 52000, expenses: 43000, predicted: false },
    { month: 'Oct', income: 52000, expenses: 42000, predicted: false },
    { month: 'Nov', income: 54000, expenses: 41000, predicted: false },
    { month: 'Dec', income: 52000, expenses: 44000, predicted: false },
    { month: 'Jan+1', income: 53000, expenses: 41500, predicted: true },
    { month: 'Feb+1', income: 52000, expenses: 42000, predicted: true },
  ]
} as const satisfies Record<string, CashflowData[]>;

export const portfolioData: PortfolioData[] = [
  { name: 'Savings', value: 144612, color: '#10b981', performance: '+4.2%' },
  { name: 'Stocks', value: 85000, color: '#3b82f6', performance: '+12.8%' },
  { name: 'Real Estate', value: 24890, color: '#8b5cf6', performance: '+8.5%' },
  { name: 'Crypto', value: 18500, color: '#f59e0b', performance: '+28.7%' },
  { name: 'Bonds', value: 12000, color: '#6366f1', performance: '+3.1%' },
];

export const allNetWorthData = {
  '1M': [
    { month: 'Dec', assets: 285000, liabilities: 38450, netWorth: 246550 },
  ],
  '3M': [
    { month: 'Oct', assets: 280000, liabilities: 40000, netWorth: 240000 },
    { month: 'Nov', assets: 282500, liabilities: 39200, netWorth: 243300 },
    { month: 'Dec', assets: 285000, liabilities: 38450, netWorth: 246550 },
  ],
  '6M': [
    { month: 'Jul', assets: 270000, liabilities: 42000, netWorth: 228000 },
    { month: 'Aug', assets: 273000, liabilities: 41500, netWorth: 231500 },
    { month: 'Sep', assets: 276000, liabilities: 41000, netWorth: 235000 },
    { month: 'Oct', assets: 280000, liabilities: 40000, netWorth: 240000 },
    { month: 'Nov', assets: 282500, liabilities: 39200, netWorth: 243300 },
    { month: 'Dec', assets: 285000, liabilities: 38450, netWorth: 246550 },
  ],
  '1Y': [
    { month: 'Jan', assets: 250000, liabilities: 45000, netWorth: 205000 },
    { month: 'Feb', assets: 252000, liabilities: 44500, netWorth: 207500 },
    { month: 'Mar', assets: 255000, liabilities: 44000, netWorth: 211000 },
    { month: 'Apr', assets: 258000, liabilities: 43500, netWorth: 214500 },
    { month: 'May', assets: 262000, liabilities: 43000, netWorth: 219000 },
    { month: 'Jun', assets: 266000, liabilities: 42500, netWorth: 223500 },
    { month: 'Jul', assets: 270000, liabilities: 42000, netWorth: 228000 },
    { month: 'Aug', assets: 273000, liabilities: 41500, netWorth: 231500 },
    { month: 'Sep', assets: 276000, liabilities: 41000, netWorth: 235000 },
    { month: 'Oct', assets: 280000, liabilities: 40000, netWorth: 240000 },
    { month: 'Nov', assets: 282500, liabilities: 39200, netWorth: 243300 },
    { month: 'Dec', assets: 285000, liabilities: 38450, netWorth: 246550 },
  ],
  'ALL': [
    { month: 'Jan', assets: 250000, liabilities: 45000, netWorth: 205000 },
    { month: 'Feb', assets: 252000, liabilities: 44500, netWorth: 207500 },
    { month: 'Mar', assets: 255000, liabilities: 44000, netWorth: 211000 },
    { month: 'Apr', assets: 258000, liabilities: 43500, netWorth: 214500 },
    { month: 'May', assets: 262000, liabilities: 43000, netWorth: 219000 },
    { month: 'Jun', assets: 266000, liabilities: 42500, netWorth: 223500 },
    { month: 'Jul', assets: 270000, liabilities: 42000, netWorth: 228000 },
    { month: 'Aug', assets: 273000, liabilities: 41500, netWorth: 231500 },
    { month: 'Sep', assets: 276000, liabilities: 41000, netWorth: 235000 },
    { month: 'Oct', assets: 280000, liabilities: 40000, netWorth: 240000 },
    { month: 'Nov', assets: 282500, liabilities: 39200, netWorth: 243300 },
    { month: 'Dec', assets: 285000, liabilities: 38450, netWorth: 246550 },
  ]
} as const satisfies Record<string, NetWorthData[]>;

export const healthScoreData: HealthScoreData[] = [
  { month: 'Jul', score: 78 },
  { month: 'Aug', score: 80 },
  { month: 'Sep', score: 82 },
  { month: 'Oct', score: 83 },
  { month: 'Nov', score: 84 },
  { month: 'Dec', score: 85 },
];

export const smartInsightsData = [
  {
    type: 'opportunity' as const,
    title: 'Investment Opportunity',
    message: 'Your cash reserves are 15% above optimal. Consider investing NOK 20,000.',
    impact: 'High',
    action: 'Invest Now',
    color: 'green' as const
  },
  {
    type: 'warning' as const,
    title: 'Budget Alert',
    message: 'Entertainment spending is 20% over budget this month.',
    impact: 'Medium',
    action: 'Review Budget',
    color: 'yellow' as const
  },
  {
    type: 'achievement' as const,
    title: 'Goal Achievement',
    message: 'Emergency fund is now 85% complete! Great progress.',
    impact: 'Positive',
    action: 'View Goal',
    color: 'blue' as const
  }
];

export const goalsData = [
  {
    name: 'Emergency Fund',
    current: 82000,
    target: 120000,
    deadline: '2024-06-30',
    onTrack: true,
    monthlyContribution: 5000,
    projectedCompletion: '2024-05-15'
  },
  {
    name: 'House Down Payment',
    current: 45000,
    target: 100000,
    deadline: '2025-12-31',
    onTrack: true,
    monthlyContribution: 3000,
    projectedCompletion: '2025-10-20'
  },
  {
    name: 'Retirement Fund',
    current: 125000,
    target: 500000,
    deadline: '2040-12-31',
    onTrack: false,
    monthlyContribution: 2000,
    projectedCompletion: '2045-03-15'
  }
];

export const recentActivitiesData = [
  {
    id: 1,
    type: 'income' as const,
    description: 'Salary Deposit',
    amount: 52000,
    date: '2 days ago'
  },
  {
    id: 2,
    type: 'expense' as const,
    description: 'Grocery Shopping',
    amount: -1485,
    date: '3 days ago'
  },
  {
    id: 3,
    type: 'transfer' as const,
    description: 'Auto-save Transfer',
    amount: 2500,
    date: '5 days ago'
  }
];

// Financial constants from mock data
export const MOCK_FINANCIAL_VALUES = {
  CURRENT_NET_WORTH: 246552,
  MONTHLY_INCOME: 52000,
  MONTHLY_EXPENSES: 44000,
  FINANCIAL_HEALTH_SCORE: 85,
  PREVIOUS_HEALTH_SCORE: 82,
  INVESTMENT_RETURNS: 24890,
  LIQUID_ASSETS: 144612,
  TOTAL_DEBT: 38450,
  SAVINGS_RATE: 28.5,
} as const;