import { useMemo, useCallback, useState } from 'react';
import { useCurrentPageData } from './useCurrentPageData';
import { useFinancialCalculations } from './useFinancialCalculations';
import { useModalManager } from './useModalManager';
import { getFinancialHealthStatus } from '../utils/financial';
import type { TimeframeType } from '../types/financial';

export const useCurrentPageLogic = (timeframe: TimeframeType = '1M') => {
  const modalManager = useModalManager();

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
    totalMonthlyIncome: dataMonthlyIncome,
    totalMonthlyExpenses: dataMonthlyExpenses,
    criticalAlerts,
    isDeficitProjected,
    daysUntilDeficit,
    highPriorityPayments
  } = useCurrentPageData(timeframe);

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
    recentTransactions
  }), [
    totalMonthlyIncome,
    totalMonthlyExpenses,
    spendingCategories,
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

  // Modal handlers - simplified with the new modal manager
  const handleViewDetails = useCallback(() => {
    modalManager.openModal('details');
  }, [modalManager]);

  const handleViewPayments = useCallback(() => {
    modalManager.openModal('payments');
  }, [modalManager]);

  const handleViewNetCashflow = useCallback(() => {
    modalManager.openModal('netCashflow');
  }, [modalManager]);

  const handleCloseModal = useCallback(() => {
    modalManager.closeModal();
  }, [modalManager]);

  const handleClosePaymentsModal = useCallback(() => {
    modalManager.closeModal();
  }, [modalManager]);

  const handleCloseNetCashflowModal = useCallback(() => {
    modalManager.closeModal();
  }, [modalManager]);

  return {
    modalManager,
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
