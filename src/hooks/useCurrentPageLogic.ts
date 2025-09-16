import { useMemo, useCallback } from 'react';
import { useCurrentPageData } from './useCurrentPageData';
import { useFinancialCalculations } from './useFinancialCalculations';
import { useModalState } from './useModalState';
import { formatCurrency, getFinancialHealthStatus } from '../utils/financial';

export const useCurrentPageLogic = () => {
  const modalState = useModalState();
  
  const {
    accounts,
    upcomingPayments,
    recentTransactions,
    paycheckInfo,
    cashflowProjections,
    spendingCategories,
    totalAvailable,
    netLeftoverUntilPaycheck,
    overdueCount,
    todaySpending,
    criticalAlerts,
    isDeficitProjected,
    daysUntilDeficit,
    highPriorityPayments
  } = useCurrentPageData();

  const {
    totalMonthlyIncome,
    totalMonthlyExpenses,
    savingsRate,
    biggestExpenseCategory,
  } = useFinancialCalculations(spendingCategories);

  // Memoize derived data
  const headerData = useMemo(() => {
    const healthStatus = getFinancialHealthStatus(netLeftoverUntilPaycheck, totalMonthlyIncome);
    
    return {
      accounts,
      totalAvailable,
      netLeftoverUntilPaycheck,
      paycheckInfo,
      upcomingPayments,
      overdueCount,
      totalMonthlyIncome,
      totalMonthlyExpenses,
      healthStatus
    };
  }, [
    accounts,
    totalAvailable,
    netLeftoverUntilPaycheck,
    paycheckInfo,
    upcomingPayments,
    overdueCount,
    totalMonthlyIncome,
    totalMonthlyExpenses,
    netLeftoverUntilPaycheck
  ]);

  const alertsData = useMemo(() => ({
    criticalAlerts,
    overdueCount,
    isDeficitProjected,
    daysUntilDeficit,
    highPriorityPayments
  }), [
    criticalAlerts,
    overdueCount,
    isDeficitProjected,
    daysUntilDeficit,
    highPriorityPayments
  ]);

  const insightsData = useMemo(() => ({
    monthlyIncome: totalMonthlyIncome,
    monthlyExpenses: totalMonthlyExpenses,
    spendingCategories,
    todaySpending,
    recentTransactions
  }), [
    totalMonthlyIncome,
    totalMonthlyExpenses,
    spendingCategories,
    todaySpending,
    recentTransactions
  ]);

  const suggestionsData = useMemo(() => ({
    netLeftover: netLeftoverUntilPaycheck,
    savingsRate,
    spendingCategories,
    overdueCount,
    daysUntilPaycheck: paycheckInfo.daysUntilPaycheck
  }), [
    netLeftoverUntilPaycheck,
    savingsRate,
    spendingCategories,
    overdueCount,
    paycheckInfo.daysUntilPaycheck
  ]);

  const awarenessData = useMemo(() => ({
    totalMonthlyIncome,
    totalMonthlyExpenses,
    biggestExpenseCategory,
    savingsRate,
    paycheckDays: paycheckInfo.daysUntilPaycheck,
    netLeftoverUntilPaycheck
  }), [
    totalMonthlyIncome,
    totalMonthlyExpenses,
    biggestExpenseCategory,
    savingsRate,
    paycheckInfo.daysUntilPaycheck,
    netLeftoverUntilPaycheck
  ]);

  // Memoized event handlers
  const handleViewDetails = useCallback(() => {
    modalState.setIsModalOpen(true);
  }, [modalState]);

  const handleViewPayments = useCallback(() => {
    modalState.setIsPaymentsModalOpen(true);
  }, [modalState]);

  const handleViewNetCashflow = useCallback(() => {
    modalState.setIsNetCashflowModalOpen(true);
  }, [modalState]);

  const handleCloseModal = useCallback(() => {
    modalState.setIsModalOpen(false);
  }, [modalState]);

  const handleClosePaymentsModal = useCallback(() => {
    modalState.setIsPaymentsModalOpen(false);
  }, [modalState]);

  const handleCloseNetCashflowModal = useCallback(() => {
    modalState.setIsNetCashflowModalOpen(false);
  }, [modalState]);

  return {
    modalState,
    headerData,
    alertsData,
    insightsData,
    suggestionsData,
    awarenessData,
    cashflowProjections,
    spendingCategories,
    recentTransactions,
    daysUntilDeficit,
    // Event handlers
    handleViewDetails,
    handleViewPayments,
    handleViewNetCashflow,
    handleCloseModal,
    handleClosePaymentsModal,
    handleCloseNetCashflowModal,
  };
};