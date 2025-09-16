import { useMemo } from 'react';
import { metricIcons } from '../theme/icons';
import type { Metric } from '../types/metrics';
import { useCentralizedFinancialData } from './useCentralizedData';
import type { TimeframeType } from '../types/financial';

export const useMetricsData = (timeframe: TimeframeType = '6M') => {
  const data = useCentralizedFinancialData(timeframe);
  
  return useMemo(() => {
    const currentNetWorth = data.history.netWorth[data.history.netWorth.length - 1]?.netWorth || 0;
    const previousNetWorth = data.history.netWorth[data.history.netWorth.length - 2]?.netWorth || 0;
    const netWorthChange = previousNetWorth ? ((currentNetWorth - previousNetWorth) / previousNetWorth * 100) : 0;

    const currentCashflow = data.history.cashflow[data.history.cashflow.length - 1]?.cashflow || 0;
    const previousCashflow = data.history.cashflow[data.history.cashflow.length - 2]?.cashflow || 0;
    const cashflowChange = previousCashflow ? ((currentCashflow - previousCashflow) / previousCashflow * 100) : 0;

    const investmentReturns = data.investments.reduce((sum, inv) => sum + (inv.value - inv.originalValue), 0);
    const investmentReturnPercent = ((investmentReturns / data.investments.reduce((sum, inv) => sum + inv.originalValue, 0)) * 100);

    const primaryMetrics: Metric[] = [
      { 
        title: 'Net Worth', 
        value: `NOK ${data.totals.netWorth.toLocaleString()}`, 
        change: `${netWorthChange >= 0 ? '+' : ''}${netWorthChange.toFixed(1)}%`, 
        trend: netWorthChange >= 0 ? 'up' as const : 'down' as const, 
        color: 'emerald' as const,
        icon: metricIcons.wallet,
        subtitle: 'Total wealth',
        sparklineData: data.history.netWorth.slice(-6).map(item => item.netWorth),
        priority: 'high' as const
      },
      { 
        title: 'Monthly Cashflow', 
        value: `NOK ${currentCashflow >= 0 ? '+' : ''}${currentCashflow.toLocaleString()}`, 
        change: `${cashflowChange >= 0 ? '+' : ''}${cashflowChange.toFixed(1)}%`, 
        trend: cashflowChange >= 0 ? 'up' as const : 'down' as const, 
        color: 'green' as const,
        icon: metricIcons.trending,
        subtitle: 'Income - Expenses',
        sparklineData: data.history.cashflow.slice(-6).map(item => item.cashflow),
        priority: 'high' as const
      },
      { 
        title: 'Investment Returns', 
        value: `NOK ${investmentReturns >= 0 ? '+' : ''}${investmentReturns.toLocaleString()}`, 
        change: `${investmentReturnPercent >= 0 ? '+' : ''}${investmentReturnPercent.toFixed(1)}%`, 
        trend: investmentReturns >= 0 ? 'up' as const : 'down' as const, 
        color: 'purple' as const,
        icon: metricIcons.trending,
        subtitle: 'YTD performance',
        sparklineData: data.history.investment.slice(-6).map(item => item.value),
        priority: 'high' as const
      }
    ];

    const secondaryMetrics: Metric[] = [
      { 
        title: 'Liquid Assets', 
        value: `NOK ${data.totals.liquidAssets.toLocaleString()}`, 
        change: '+4.2%', 
        trend: 'up' as const, 
        color: 'blue' as const,
        icon: metricIcons.savings,
        subtitle: 'Available funds',
        compact: true
      },
      { 
        title: 'Debt Paydown', 
        value: `NOK -${data.totals.totalDebts.toLocaleString()}`, 
        change: '-3.2%', 
        trend: 'down' as const, 
        color: 'red' as const,
        icon: metricIcons.debt,
        subtitle: 'Total liabilities',
        compact: true
      },
      { 
        title: 'Savings Rate', 
        value: `${data.totals.savingsRate.toFixed(1)}%`, 
        change: '+2.1%', 
        trend: 'up' as const, 
        color: 'indigo' as const,
        icon: metricIcons.savings,
        subtitle: 'Of income saved',
        compact: true
      }
    ];

    return { primaryMetrics, secondaryMetrics };
  }, [data]);
};