export interface CashflowData {
  month: string;
  income: number;
  expenses: number;
  cashflow: number;
  predicted?: boolean;
}

export interface NetWorthData {
  month: string;
  assets: number;
  liabilities: number;
  netWorth: number;
}

export interface PortfolioData {
  name: string;
  value: number;
  color: string;
  performance: string;
}

export interface HealthScoreData {
  month: string;
  score: number;
}

export interface Goal {
  name: string;
  current: number;
  target: number;
  deadline: string;
  onTrack: boolean;
  monthlyContribution: number;
  projectedCompletion: string;
}

export type TimeframeType = '1M' | '3M' | '6M' | '1Y' | 'ALL';
</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">create</parameter>
<parameter name="path">src/types/insights.ts</parameter>
<parameter name="file_text">export type InsightType = 'opportunity' | 'warning' | 'achievement';

export interface SmartInsight {
  type: InsightType;
  title: string;
  message: string;
  impact: string;
  action: string;
  color: 'green' | 'yellow' | 'blue' | 'red';
}
</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">create</parameter>
<parameter name="path">src/types/activities.ts</parameter>
<parameter name="file_text">export type ActivityType = 'income' | 'expense' | 'transfer';

export interface RecentActivity {
  id: number;
  type: ActivityType;
  description: string;
  amount: number;
  date: string;
}
</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">create</parameter>
<parameter name="path">src/types/metrics.ts</parameter>
<parameter name="file_text">import { DivideIcon as LucideIcon } from 'lucide-react';
import type { ColorKey } from '../theme/colors';

export interface Metric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  color: ColorKey;
  subtitle?: string;
  sparklineData?: number[];
  compact?: boolean;
  priority?: 'high' | 'medium' | 'low';
}
</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">create</parameter>
<parameter name="path">src/context/DashboardContext.tsx</parameter>
<parameter name="file_text">import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { TimeframeType } from '../types/financial';

interface DashboardContextType {
  timeframe: TimeframeType;
  setTimeframe: (timeframe: TimeframeType) => void;
  refreshing: boolean;
  setRefreshing: (refreshing: boolean) => void;
  handleRefresh: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [timeframe, setTimeframe] = useState<TimeframeType>('6M');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const value = {
    timeframe,
    setTimeframe,
    refreshing,
    setRefreshing,
    handleRefresh,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">create</parameter>
<parameter name="path">src/hooks/useMetricsData.ts</parameter>
<parameter name="file_text">import { useMemo } from 'react';
import { metricIcons } from '../theme/icons';
import type { Metric } from '../types/metrics';
import type { CashflowData, NetWorthData } from '../types/financial';

export const useMetricsData = (cashflowData: CashflowData[], netWorthData: NetWorthData[]) => {
  return useMemo(() => {
    const currentNetWorth = netWorthData[netWorthData.length - 1]?.netWorth || 0;
    const previousNetWorth = netWorthData[netWorthData.length - 2]?.netWorth || 0;
    const netWorthChange = previousNetWorth ? ((currentNetWorth - previousNetWorth) / previousNetWorth * 100) : 0;

    const currentCashflow = cashflowData[cashflowData.length - 1]?.cashflow || 0;
    const previousCashflow = cashflowData[cashflowData.length - 2]?.cashflow || 0;
    const cashflowChange = previousCashflow ? ((currentCashflow - previousCashflow) / previousCashflow * 100) : 0;

    const primaryMetrics: Metric[] = [
      { 
        title: 'Net Worth', 
        value: 'NOK 246,552', 
        change: `+${netWorthChange.toFixed(1)}%`, 
        trend: netWorthChange >= 0 ? 'up' as const : 'down' as const, 
        color: 'emerald' as const,
        icon: metricIcons.wallet,
        subtitle: 'Total wealth',
        sparklineData: netWorthData.slice(-6).map(item => item.netWorth),
        priority: 'high' as const
      },
      { 
        title: 'Monthly Cashflow', 
        value: `NOK +${currentCashflow.toLocaleString()}`, 
        change: `+${cashflowChange.toFixed(1)}%`, 
        trend: cashflowChange >= 0 ? 'up' as const : 'down' as const, 
        color: 'green' as const,
        icon: metricIcons.trending,
        subtitle: 'Income - Expenses',
        sparklineData: cashflowData.slice(-6).map(item => item.cashflow),
        priority: 'high' as const
      },
      { 
        title: 'Investment Returns', 
        value: 'NOK +24,890', 
        change: '+12.4%', 
        trend: 'up' as const, 
        color: 'purple' as const,
        icon: metricIcons.trending,
        subtitle: 'YTD performance',
        sparklineData: [22000, 21500, 23000, 24000, 24500, 24890],
        priority: 'high' as const
      }
    ];

    const secondaryMetrics: Metric[] = [
      { 
        title: 'Liquid Assets', 
        value: 'NOK 144,612', 
        change: '+4.2%', 
        trend: 'up' as const, 
        color: 'blue' as const,
        icon: metricIcons.savings,
        subtitle: 'Available funds',
        compact: true
      },
      { 
        title: 'Debt Paydown', 
        value: 'NOK -38,450', 
        change: '-3.2%', 
        trend: 'down' as const, 
        color: 'red' as const,
        icon: metricIcons.debt,
        subtitle: 'Total liabilities',
        compact: true
      },
      { 
        title: 'Savings Rate', 
        value: '28.5%', 
        change: '+2.1%', 
        trend: 'up' as const, 
        color: 'indigo' as const,
        icon: metricIcons.savings,
        subtitle: 'Of income saved',
        compact: true
      }
    ];

    return { primaryMetrics, secondaryMetrics };
  }, [cashflowData, netWorthData]);
};
</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">str_replace</parameter>
<parameter name="path">src/hooks/useFinancialData.ts</parameter>
<parameter name="old_str">import { useMemo } from 'react';
import { metricIcons } from '../theme/icons';
import { 
  allCashflowData, 
  portfolioData, 
  allNetWorthData,
  healthScoreData,
  smartInsightsData,
  goalsData,
  recentActivitiesData
} from '../data/mockData';

// TODO: Replace with real API calls
// Example with React Query:
// export const useFinancialData = (timeframe: string) => {
//   const { data: cashflowData } = useQuery(['cashflow', timeframe], () => 
//     api.getCashflowData(timeframe)
//   );
//   const { data: portfolioData } = useQuery(['portfolio'], () => 
//     api.getPortfolioData()
//   );
//   // ... etc
// };

export const useFinancialData = (timeframe: string) => {
  return useMemo(() => {
    const selectedCashflowData = allCashflowData[timeframe] || allCashflowData['6M'];
    const selectedNetWorthData = allNetWorthData[timeframe] || allNetWorthData['6M'];

    const cashflowData = selectedCashflowData.map(item => ({
      ...item,
      cashflow: item.income - item.expenses
    }));

    return {
      cashflowData,
      portfolioData,
      netWorthData: selectedNetWorthData,
      healthScoreData,
      smartInsights: smartInsightsData,
      goals: goalsData,
      recentActivities: recentActivitiesData
    };
  }, [timeframe]);
};

export const useMetricsData = (cashflowData: any[], netWorthData: any[]) => {
  return useMemo(() => {
    const currentNetWorth = netWorthData[netWorthData.length - 1]?.netWorth || 0;
    const previousNetWorth = netWorthData[netWorthData.length - 2]?.netWorth || 0;
    const netWorthChange = previousNetWorth ? ((currentNetWorth - previousNetWorth) / previousNetWorth * 100) : 0;

    const currentCashflow = cashflowData[cashflowData.length - 1]?.cashflow || 0;
    const previousCashflow = cashflowData[cashflowData.length - 2]?.cashflow || 0;
    const cashflowChange = previousCashflow ? ((currentCashflow - previousCashflow) / previousCashflow * 100) : 0;

    const primaryMetrics = [
      { 
        title: 'Net Worth', 
        value: 'NOK 246,552', 
        change: `+${netWorthChange.toFixed(1)}%`, 
        trend: netWorthChange >= 0 ? 'up' as const : 'down' as const, 
        color: 'emerald' as const,
        icon: metricIcons.wallet,
        subtitle: 'Total wealth',
        sparklineData: netWorthData.slice(-6).map(item => item.netWorth),
        priority: 'high' as const
      },
      { 
        title: 'Monthly Cashflow', 
        value: `NOK +${currentCashflow.toLocaleString()}`, 
        change: `+${cashflowChange.toFixed(1)}%`, 
        trend: cashflowChange >= 0 ? 'up' as const : 'down' as const, 
        color: 'green' as const,
        icon: metricIcons.trending,
        subtitle: 'Income - Expenses',
        sparklineData: cashflowData.slice(-6).map(item => item.cashflow),
        priority: 'high' as const
      },
      { 
        title: 'Investment Returns', 
        value: 'NOK +24,890', 
        change: '+12.4%', 
        trend: 'up' as const, 
        color: 'purple' as const,
        icon: metricIcons.trending,
        subtitle: 'YTD performance',
        sparklineData: [22000, 21500, 23000, 24000, 24500, 24890],
        priority: 'high' as const
      }
    ];

    const secondaryMetrics = [
      { 
        title: 'Liquid Assets', 
        value: 'NOK 144,612', 
        change: '+4.2%', 
        trend: 'up' as const, 
        color: 'blue' as const,
        icon: metricIcons.savings,
        subtitle: 'Available funds'
      },
      { 
        title: 'Debt Paydown', 
        value: 'NOK -38,450', 
        change: '-3.2%', 
        trend: 'down' as const, 
        color: 'red' as const,
        icon: metricIcons.debt,
        subtitle: 'Total liabilities'
      },
      { 
        title: 'Savings Rate', 
        value: '28.5%', 
        change: '+2.1%', 
        trend: 'up' as const, 
        color: 'indigo' as const,
        icon: metricIcons.savings,
        subtitle: 'Of income saved'
      }
    ];

    return { primaryMetrics, secondaryMetrics };
  }, [cashflowData, netWorthData]);
};</parameter>
<parameter name="new_str">import { useMemo } from 'react';
import { 
  allCashflowData, 
  portfolioData, 
  allNetWorthData,
  healthScoreData,
  smartInsightsData,
  goalsData,
  recentActivitiesData
} from '../data/mockData';
import type { TimeframeType } from '../types/financial';

// TODO: Replace with real API calls
// Example with React Query:
// export const useFinancialData = (timeframe: TimeframeType) => {
//   const { data: cashflowData } = useQuery(['cashflow', timeframe], () => 
//     api.getCashflowData(timeframe)
//   );
//   const { data: portfolioData } = useQuery(['portfolio'], () => 
//     api.getPortfolioData()
//   );
//   // ... etc
// };

export const useFinancialData = (timeframe: TimeframeType) => {
  return useMemo(() => {
    const selectedCashflowData = allCashflowData[timeframe] || allCashflowData['6M'];
    const selectedNetWorthData = allNetWorthData[timeframe] || allNetWorthData['6M'];

    const cashflowData = selectedCashflowData.map(item => ({
      ...item,
      cashflow: item.income - item.expenses
    }));

    return {
      cashflowData,
      portfolioData,
      netWorthData: selectedNetWorthData,
      healthScoreData,
      smartInsights: smartInsightsData,
      goals: goalsData,
      recentActivities: recentActivitiesData
    };
  }, [timeframe]);
};</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">create</parameter>
<parameter name="path">src/data/insights.ts</parameter>
<parameter name="file_text">import type { SmartInsight } from '../types/insights';

export const smartInsightsData: SmartInsight[] = [
  {
    type: 'opportunity',
    title: 'Investment Opportunity',
    message: 'Your cash reserves are 15% above optimal. Consider investing NOK 20,000.',
    impact: 'High',
    action: 'Invest Now',
    color: 'green'
  },
  {
    type: 'warning',
    title: 'Budget Alert',
    message: 'Entertainment spending is 20% over budget this month.',
    impact: 'Medium',
    action: 'Review Budget',
    color: 'yellow'
  },
  {
    type: 'achievement',
    title: 'Goal Achievement',
    message: 'Emergency fund is now 85% complete! Great progress.',
    impact: 'Positive',
    action: 'View Goal',
    color: 'blue'
  }
];
</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">create</parameter>
<parameter name="path">src/data/activities.ts</parameter>
<parameter name="file_text">import type { RecentActivity } from '../types/activities';

export const recentActivitiesData: RecentActivity[] = [
  {
    id: 1,
    type: 'income',
    description: 'Salary Deposit',
    amount: 52000,
    date: '2 days ago'
  },
  {
    id: 2,
    type: 'expense',
    description: 'Grocery Shopping',
    amount: -1485,
    date: '3 days ago'
  },
  {
    id: 3,
    type: 'transfer',
    description: 'Auto-save Transfer',
    amount: 2500,
    date: '5 days ago'
  }
];
</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">str_replace</parameter>
<parameter name="path">src/data/mockData.ts</parameter>
<parameter name="old_str">export const smartInsightsData = [
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
];</parameter>
<parameter name="new_str">import type { Goal } from '../types/financial';

export const goalsData: Goal[] = [
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

// Re-export from domain-specific files
export { smartInsightsData } from './insights';
export { recentActivitiesData } from './activities';</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">str_replace</parameter>
<parameter name="path">src/theme/icons.ts</parameter>
<parameter name="old_str">// Centralized icon theme system
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  Activity, 
  PiggyBank, 
  CreditCard, 
  Target,
  AlertTriangle,
  Award
} from 'lucide-react';

// Activity type icons
export const activityIcons = {
  income: TrendingUp,
  expense: TrendingDown,
  transfer: ArrowUpRight,
} as const;

// Smart insight type icons
export const insightIcons = {
  opportunity: TrendingUp,
  warning: AlertTriangle,
  achievement: Award,
} as const;

// Metric category icons
export const metricIcons = {
  wallet: Wallet,
  trending: TrendingUp,
  activity: Activity,
  savings: PiggyBank,
  debt: CreditCard,
  target: Target,
  warning: AlertTriangle,
  achievement: Award
} as const;

export type ActivityIconKey = keyof typeof activityIcons;
export type InsightIconKey = keyof typeof insightIcons;
export type MetricIconKey = keyof typeof metricIcons;</parameter>
<parameter name="new_str">// Centralized icon theme system
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  Activity, 
  PiggyBank, 
  CreditCard, 
  Target,
  AlertTriangle,
  Award
} from 'lucide-react';
import type { ActivityType } from '../types/activities';
import type { InsightType } from '../types/insights';

// Activity type icons
export const activityIcons: Record<ActivityType, typeof TrendingUp> = {
  income: TrendingUp,
  expense: TrendingDown,
  transfer: ArrowUpRight,
};

// Smart insight type icons
export const insightIcons: Record<InsightType, typeof TrendingUp> = {
  opportunity: TrendingUp,
  warning: AlertTriangle,
  achievement: Award,
};

// Metric category icons
export const metricIcons = {
  wallet: Wallet,
  trending: TrendingUp,
  activity: Activity,
  savings: PiggyBank,
  debt: CreditCard,
  target: Target,
  warning: AlertTriangle,
  achievement: Award
} as const;

export type MetricIconKey = keyof typeof metricIcons;</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">create</parameter>
<parameter name="path">src/pages/DashboardPage.tsx</parameter>
<parameter name="file_text">import React, { Suspense } from 'react';
import { useFinancialData } from '../hooks/useFinancialData';
import { useMetricsData } from '../hooks/useMetricsData';
import { useDashboard } from '../context/DashboardContext';
import { activityIcons, insightIcons } from '../theme/icons';

// Import refactored components
import DashboardHeader from '../components/dashboard/DashboardHeader';
import FinancialHealthScore from '../components/dashboard/FinancialHealthScore';
import MetricsGrid from '../components/dashboard/MetricsGrid';
import SmartInsights from '../components/dashboard/SmartInsights';
import GoalsSection from '../components/dashboard/GoalsSection';
import QuickActions from '../components/dashboard/QuickActions';

// Lazy load heavy components
const ChartsSection = React.lazy(() => import('../components/dashboard/ChartsSection'));

const DashboardPage = () => {
  const { timeframe, setTimeframe, refreshing, handleRefresh } = useDashboard();

  // Use custom hooks for data management
  const { 
    cashflowData, 
    portfolioData, 
    netWorthData, 
    healthScoreData, 
    smartInsights, 
    goals, 
    recentActivities 
  } = useFinancialData(timeframe);
  
  const { primaryMetrics, secondaryMetrics } = useMetricsData(cashflowData, netWorthData);

  // Financial health score data
  const financialHealthScore = 85;
  const previousScore = 82;

  // Enhanced smart insights with icons from theme
  const enhancedSmartInsights = smartInsights.map(insight => ({
    ...insight,
    icon: insightIcons[insight.type]
  }));

  // Enhanced recent activities with icons from theme
  const enhancedRecentActivities = recentActivities.map(activity => ({
    ...activity,
    icon: activityIcons[activity.type]
  }));

  return (
    <div className="space-y-8 pb-8">
      {/* Enhanced Header with Actions */}
      <DashboardHeader 
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      {/* Financial Health Score */}
      <FinancialHealthScore 
        score={financialHealthScore}
        previousScore={previousScore}
        healthScoreData={healthScoreData}
      />

      {/* Primary and Secondary Metrics */}
      <MetricsGrid 
        primaryMetrics={primaryMetrics}
        secondaryMetrics={secondaryMetrics}
      />

      {/* Smart Insights */}
      <SmartInsights insights={enhancedSmartInsights} />

      {/* Charts Section */}
      <Suspense fallback={
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      }>
        <ChartsSection 
          cashflowData={cashflowData}
          portfolioData={portfolioData}
          netWorthData={netWorthData}
          timeframe={timeframe}
        />
      </Suspense>

      {/* Goals Tracking */}
      <GoalsSection goals={goals} />

      {/* Quick Actions & Recent Activity */}
      <QuickActions recentActivities={enhancedRecentActivities} />
    </div>
  );
};

export default DashboardPage;
</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">str_replace</parameter>
<parameter name="path">src/components/dashboard/DashboardHeader.tsx</parameter>
<parameter name="old_str">import React from 'react';
import { RefreshCw, Plus } from 'lucide-react';

interface DashboardHeaderProps {
  timeframe: string;
  setTimeframe: (timeframe: string) => void;
  refreshing: boolean;
  onRefresh: () => void;
}</parameter>
<parameter name="new_str">import React from 'react';
import { RefreshCw, Plus } from 'lucide-react';
import type { TimeframeType } from '../../types/financial';

interface DashboardHeaderProps {
  timeframe: TimeframeType;
  setTimeframe: (timeframe: TimeframeType) => void;
  refreshing: boolean;
  onRefresh: () => void;
}</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">str_replace</parameter>
<parameter name="path">src/components/dashboard/DashboardHeader.tsx</parameter>
<parameter name="old_str">        {/* Time Range Selector */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {['1M', '3M', '6M', '1Y', 'ALL'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                timeframe === period
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {period}
            </button>
          ))}</parameter>
<parameter name="new_str">        {/* Time Range Selector */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                timeframe === period
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {period}
            </button>
          ))}</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">create</parameter>
<parameter name="path">src/pages/AssetsPage.tsx</parameter>
<parameter name="file_text">// Move from src/components/AssetsPage.tsx to src/pages/AssetsPage.tsx
// This file will be moved in the next step
</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">str_replace</parameter>
<parameter name="path">src/App.tsx</parameter>
<parameter name="old_str">import DashboardPage from './components/DashboardPage';
import CurrentPage from './components/CurrentPage';
import SavingsPage from './components/SavingsPage';
import DebtsPage from './components/DebtsPage';
import InvestmentsPage from './components/InvestmentsPage';
import AssetsPage from './components/AssetsPage';
import LiabilitiesPage from './components/LiabilitiesPage';
import NetWorthPage from './components/NetWorthPage';</parameter>
<parameter name="new_str">import { DashboardProvider } from './context/DashboardContext';
import DashboardPage from './pages/DashboardPage';
import CurrentPage from './components/CurrentPage';
import SavingsPage from './components/SavingsPage';
import DebtsPage from './components/DebtsPage';
import InvestmentsPage from './components/InvestmentsPage';
import AssetsPage from './components/AssetsPage';
import LiabilitiesPage from './components/LiabilitiesPage';
import NetWorthPage from './components/NetWorthPage';</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">str_replace</parameter>
<parameter name="path">src/App.tsx</parameter>
<parameter name="old_str">  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage />;
      case 'current': return <CurrentPage />;
      case 'savings': return <SavingsPage />;
      case 'debts': return <DebtsPage />;
      case 'investments': return <InvestmentsPage />;
      case 'assets': return <AssetsPage />;
      case 'liabilities': return <LiabilitiesPage />;
      case 'networth': return <NetWorthPage />;
      default: return <DashboardPage />;
    }
  };</parameter>
<parameter name="new_str">  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return (
        <DashboardProvider>
          <DashboardPage />
        </DashboardProvider>
      );
      case 'current': return <CurrentPage />;
      case 'savings': return <SavingsPage />;
      case 'debts': return <DebtsPage />;
      case 'investments': return <InvestmentsPage />;
      case 'assets': return <AssetsPage />;
      case 'liabilities': return <LiabilitiesPage />;
      case 'networth': return <NetWorthPage />;
      default: return (
        <DashboardProvider>
          <DashboardPage />
        </DashboardProvider>
      );
    }
  };</parameter>
</invoke>
<invoke name="str_replace_editor">
<parameter name="command">str_replace</parameter>
<parameter name="path">src/components/common/SmartInsightCard.tsx</parameter>
<parameter name="old_str">import React from 'react';
import { colors } from '../../theme/colors';

interface SmartInsightCardProps {
  type: 'opportunity' | 'warning' | 'achievement';
  title: string;
  message: string;
  impact: string;
  action: string;
  icon: React.ElementType;
  color: ColorKey;
}</parameter>
<parameter name="new_str">import React from 'react';
import { colors, type ColorKey } from '../../theme/colors';
import type { InsightType } from '../../types/insights';

interface SmartInsightCardProps {
  type: InsightType;
  title: string;
  message: string;
  impact: string;
  action: string;
  icon: React.ElementType;
  color: ColorKey;
}</parameter>
</invoke>
<invoke name="shell">
<parameter name="command">rm src/components/DashboardPage.tsx</parameter>
</invoke>
<invoke name="shell">
<parameter name="command">rm src/pages/AssetsPage.tsx</parameter>
</invoke>