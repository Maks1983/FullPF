import { useMemo, useCallback } from 'react';
import { useCurrentPageData } from './useCurrentPageData';
import { useFinancialCalculations } from './useFinancialCalculations';
import { useModalState } from './useModalState';
import { useFinancialData } from './useFinancialData';
import { useMetricsData } from './useMetricsData';
import type { TimeframeType } from '../types/financial';

/**
 * Consolidated hook for all financial data and calculations
 * Provides a single API for financial components
 */
export const useConsolidatedFinancial = (timeframe?: TimeframeType) => {
  // Current page specific data
  const currentPageData = useCurrentPageData();
  const financialCalculations = useFinancialCalculations(currentPageData.spendingCategories);
  const modalState = useModalState();
  
  // Dashboard data (if timeframe provided)
  const dashboardData = timeframe ? useFinancialData(timeframe) : null;
  const metricsData = dashboardData ? useMetricsData(dashboardData.cashflowData, dashboardData.netWorthData) : null;
  
  // Consolidated refresh function
  const refreshAllData = useCallback(async () => {
    await Promise.all([
      currentPageData.refreshData(),
      // Add other refresh functions as needed
    ]);
  }, [currentPageData]);
  
  // Memoized combined state
  const consolidatedState = useMemo(() => ({
    // Current page data
    current: {
      ...currentPageData,
      calculations: financialCalculations,
      modals: modalState,
    },
    
    // Dashboard data (if available)
    dashboard: dashboardData ? {
      ...dashboardData,
      metrics: metricsData,
    } : null,
    
    // Global actions
    actions: {
      refreshAll: refreshAllData,
    },
  }), [currentPageData, financialCalculations, modalState, dashboardData, metricsData, refreshAllData]);
  
  return consolidatedState;
};

/**
 * Hook specifically for current page with all required data
 */
export const useCurrentPageFinancial = () => {
  const consolidated = useConsolidatedFinancial();
  return consolidated.current;
};

/**
 * Hook specifically for dashboard with all required data
 */
export const useDashboardFinancial = (timeframe: TimeframeType) => {
  const consolidated = useConsolidatedFinancial(timeframe);
  return {
    ...consolidated.dashboard!,
    actions: consolidated.actions,
  };
};