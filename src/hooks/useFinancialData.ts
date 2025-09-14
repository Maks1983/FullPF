import { useMemo } from 'react';
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
};