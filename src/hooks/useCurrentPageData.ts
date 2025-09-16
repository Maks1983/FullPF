import { useMemo, useCallback } from 'react';
import { mockCurrentPageData } from '../data/currentPageData';
import type { CurrentPageData } from '../types/current';
import { FINANCIAL_THRESHOLDS } from '../constants/financial';

export const useCurrentPageData = (): CurrentPageData & {
  criticalAlerts: number;
  isDeficitProjected: boolean;
  daysUntilDeficit: number;
  highPriorityPayments: number;
  refreshData: () => Promise<void>;
} => {
  // Memoized data processing
  const processedData = useMemo(() => {
    const data = mockCurrentPageData;
    
    // Calculate critical alerts
    const lowBalanceAccounts = data.accounts.filter(acc => 
      acc.type !== 'credit' && 
      acc.minimumBalance && 
      acc.balance < acc.minimumBalance
    ).length;
    
    const highCreditUtilization = data.accounts.filter(acc => 
      acc.type === 'credit' && acc.creditLimit && 
      (Math.abs(acc.balance) / acc.creditLimit) > (FINANCIAL_THRESHOLDS.CREDIT_UTILIZATION_WARNING / 100)
    ).length;
    
    const criticalAlerts = data.overdueCount + lowBalanceAccounts + highCreditUtilization;
    
    // Check if deficit is projected
    const isDeficitProjected = data.netLeftoverUntilPaycheck < 0;
    
    // Find days until deficit
    const deficitProjection = data.cashflowProjections.find(proj => proj.projectedBalance < 0);
    const daysUntilDeficit = deficitProjection ? 
      Math.ceil((new Date(deficitProjection.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 
      999;
    
    // Count high priority payments
    const highPriorityPayments = data.upcomingPayments.filter(payment => 
      payment.priority === 'high' && payment.status !== 'paid'
    ).length;
    
    return {
      ...data,
      criticalAlerts,
      isDeficitProjected,
      daysUntilDeficit,
      highPriorityPayments
    };
  }, []);
  
  // Memoized refresh function
  const refreshData = useCallback(async () => {
    // Simulate API call - in real app this would fetch fresh data
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In real implementation, this would trigger a re-fetch
    console.log('Data refreshed');
  }, []);
  
  return {
    ...processedData,
    refreshData,
  };
};