import { useMemo, useCallback } from 'react';
import { useCurrentPageData } from './useCurrentPageData';
import { useFinancialCalculations } from './useFinancialCalculations';
import { useModalState } from './useModalState';
import { getFinancialHealthStatus } from '../utils/financial';

export const useCurrentPageLogic = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    isPaymentsModalOpen,
    setIsPaymentsModalOpen,
    isNetCashflowModalOpen,
    setIsNetCashflowModalOpen,
  } = useModalState();
  
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
    setIsPaymentsModalOpen(false);
    setIsNetCashflowModalOpen(false);
    setIsModalOpen(true);
  }, [setIsModalOpen, setIsPaymentsModalOpen, setIsNetCashflowModalOpen]);

  const handleViewPayments = useCallback(() => {
    setIsModalOpen(false);
    setIsNetCashflowModalOpen(false);
    setIsPaymentsModalOpen(true);
  }, [setIsModalOpen, setIsPaymentsModalOpen, setIsNetCashflowModalOpen]);

  const handleViewNetCashflow = useCallback(() => {
    setIsModalOpen(false);
    setIsPaymentsModalOpen(false);
    setIsNetCashflowModalOpen(true);
  }, [setIsModalOpen, setIsPaymentsModalOpen, setIsNetCashflowModalOpen]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  const handleClosePaymentsModal = useCallback(() => {
    setIsPaymentsModalOpen(false);
  }, [setIsPaymentsModalOpen]);

  const handleCloseNetCashflowModal = useCallback(() => {
    setIsNetCashflowModalOpen(false);
  }, [setIsNetCashflowModalOpen]);

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
