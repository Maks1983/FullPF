import { useMemo, useCallback, useState } from 'react';
import { useCurrentPageData } from './useCurrentPageData';
import { useFinancialCalculations } from './useFinancialCalculations';
import { getFinancialHealthStatus } from '../utils/financial';

type ModalKey = 'details' | 'payments' | 'netCashflow' | null;

export const useCurrentPageLogic = () => {
  const [activeModal, setActiveModal] = useState<ModalKey>(null);

  const isModalOpen = activeModal === 'details';
  const isPaymentsModalOpen = activeModal === 'payments';
  const isNetCashflowModalOpen = activeModal === 'netCashflow';

  const setIsModalOpen = useCallback((open: boolean) => {
    setActiveModal(prev => (open ? 'details' : prev === 'details' ? null : prev));
  }, []);

  const setIsPaymentsModalOpen = useCallback((open: boolean) => {
    setActiveModal(prev => (open ? 'payments' : prev === 'payments' ? null : prev));
  }, []);

  const setIsNetCashflowModalOpen = useCallback((open: boolean) => {
    setActiveModal(prev => (open ? 'netCashflow' : prev === 'netCashflow' ? null : prev));
  }, []);

  const modalState = {
    isModalOpen,
    setIsModalOpen,
    isPaymentsModalOpen,
    setIsPaymentsModalOpen,
    isNetCashflowModalOpen,
    setIsNetCashflowModalOpen,
  };

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
    totalMonthlyIncome: dataMonthlyIncome,
    totalMonthlyExpenses: dataMonthlyExpenses,
    criticalAlerts,
    isDeficitProjected,
    daysUntilDeficit,
    highPriorityPayments
  } = useCurrentPageData();

  const {
    totalMonthlyExpenses: calculatedMonthlyExpenses,
    savingsRate,
    biggestExpenseCategory,
    dailyAverageSpending,
  } = useFinancialCalculations(spendingCategories, dataMonthlyIncome);

  const totalMonthlyIncome = dataMonthlyIncome;
  const totalMonthlyExpenses = dataMonthlyExpenses ?? calculatedMonthlyExpenses;

  const headerData = useMemo(() => {
    const healthStatus = totalMonthlyIncome > 0
      ? getFinancialHealthStatus(netLeftoverUntilPaycheck, totalMonthlyIncome)
      : undefined;

    return {
      accounts,
      totalAvailable,
      netLeftoverUntilPaycheck,
      paycheckInfo,
      upcomingPayments,
      overdueCount,
      totalMonthlyIncome,
      totalMonthlyExpenses,
      healthStatus,
    };
  }, [
    accounts,
    totalAvailable,
    netLeftoverUntilPaycheck,
    paycheckInfo,
    upcomingPayments,
    overdueCount,
    totalMonthlyIncome,
    totalMonthlyExpenses
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
    daysUntilPaycheck: paycheckInfo.daysUntilPaycheck,
    totalAvailable,
    monthlyExpenses: totalMonthlyExpenses
  }), [
    netLeftoverUntilPaycheck,
    savingsRate,
    spendingCategories,
    overdueCount,
    paycheckInfo.daysUntilPaycheck,
    totalAvailable,
    totalMonthlyExpenses
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

  const handleViewDetails = useCallback(() => {
    setActiveModal('details');
  }, []);

  const handleViewPayments = useCallback(() => {
    setActiveModal('payments');
  }, []);

  const handleViewNetCashflow = useCallback(() => {
    setActiveModal('netCashflow');
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveModal(prev => (prev === 'details' ? null : prev));
  }, []);

  const handleClosePaymentsModal = useCallback(() => {
    setActiveModal(prev => (prev === 'payments' ? null : prev));
  }, []);

  const handleCloseNetCashflowModal = useCallback(() => {
    setActiveModal(prev => (prev === 'netCashflow' ? null : prev));
  }, []);

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
    dailyAverageSpending,
    todaySpending,
    totalMonthlyIncome,
    totalMonthlyExpenses,
    // Event handlers
    handleViewDetails,
    handleViewPayments,
    handleViewNetCashflow,
    handleCloseModal,
    handleClosePaymentsModal,
    handleCloseNetCashflowModal,
  };
};
