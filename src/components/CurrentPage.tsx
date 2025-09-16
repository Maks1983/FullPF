import React from 'react';
import { useCurrentPageData } from '../hooks/useCurrentPageData';
import { useModalState } from '../hooks/useModalState';
import { useFinancialCalculations } from '../hooks/useFinancialCalculations';

// Components
import CurrentPageHeader from './current/CurrentPageHeader';
import CriticalAlertsSection from './current/CriticalAlertsSection';
import MoneyFlowInsights from './current/MoneyFlowInsights';
import CashflowProjectionChart from './current/CashflowProjectionChart';
import SpendingCategoriesCard from './current/SpendingCategoriesCard';
import SmartSuggestions from './current/SmartSuggestions';
import RecentTransactionsCard from './current/RecentTransactionsCard';
import FinancialAwarenessSummary from './current/FinancialAwarenessSummary';

// Modals
import DetailedModal from './current/DetailedModal';
import UpcomingPaymentsModal from './current/UpcomingPaymentsModal';
import NetCashflowModal from './current/NetCashflowModal';

const CurrentPage = () => {
  // Data hooks
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

  // Modal state management
  const {
    isDetailedModalOpen,
    isPaymentsModalOpen,
    isNetCashflowModalOpen,
    openDetailedModal,
    closeDetailedModal,
    openPaymentsModal,
    closePaymentsModal,
    openNetCashflowModal,
    closeNetCashflowModal,
  } = useModalState();

  // Financial calculations
  const totalMonthlyIncome = 52000; // This would come from data
  const {
    totalMonthlyExpenses,
    savingsRate,
    biggestExpenseCategory,
    dailyAverageSpending
  } = useFinancialCalculations(totalMonthlyIncome, spendingCategories);

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header with 3 Cards */}
      <CurrentPageHeader
        accounts={accounts}
        totalAvailable={totalAvailable}
        netLeftover={netLeftoverUntilPaycheck}
        paycheckInfo={paycheckInfo}
        upcomingPayments={upcomingPayments}
        overdueCount={overdueCount}
        monthlyIncome={totalMonthlyIncome}
        monthlyExpenses={totalMonthlyExpenses}
        onOpenDetailedModal={openDetailedModal}
        onOpenPaymentsModal={openPaymentsModal}
        onOpenNetCashflowModal={openNetCashflowModal}
      />

      {/* Critical Alerts Banner */}
      <CriticalAlertsSection
        criticalAlerts={criticalAlerts}
        overdueCount={overdueCount}
        isDeficitProjected={isDeficitProjected}
        daysUntilDeficit={daysUntilDeficit}
        highPriorityPayments={highPriorityPayments}
      />

      {/* Money Flow Insights */}
      <MoneyFlowInsights 
        monthlyIncome={totalMonthlyIncome}
        monthlyExpenses={totalMonthlyExpenses}
        spendingCategories={spendingCategories}
        todaySpending={todaySpending}
        recentTransactions={recentTransactions}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Money Status */}
        <div className="xl:col-span-2 space-y-6">
          {/* Cashflow Projection - Full Width */}
          <CashflowProjectionChart
            projections={cashflowProjections}
            daysUntilDeficit={daysUntilDeficit}
          />
        </div>

        {/* Right Column - Payments & Spending */}
        <div className="space-y-6">
          {/* Spending Categories */}
          <SpendingCategoriesCard
            categories={spendingCategories}
            todaySpending={todaySpending}
          />
        </div>
      </div>

      {/* Smart Suggestions */}
      <SmartSuggestions 
        netLeftover={netLeftoverUntilPaycheck}
        savingsRate={savingsRate}
        spendingCategories={spendingCategories}
        overdueCount={overdueCount}
        daysUntilPaycheck={paycheckInfo.daysUntilPaycheck}
      />

      {/* Recent Transactions */}
      <RecentTransactionsCard transactions={recentTransactions} />

      {/* Financial Awareness Summary */}
      <FinancialAwarenessSummary
        totalMonthlyIncome={totalMonthlyIncome}
        totalMonthlyExpenses={totalMonthlyExpenses}
        savingsRate={savingsRate}
        biggestExpenseCategory={biggestExpenseCategory}
        paycheckInfo={paycheckInfo}
        netLeftoverUntilPaycheck={netLeftoverUntilPaycheck}
      />

      {/* Modals */}
      <DetailedModal
        isOpen={isDetailedModalOpen}
        onClose={closeDetailedModal}
        upcomingPayments={upcomingPayments}
        spendingCategories={spendingCategories}
        monthlyIncome={totalMonthlyIncome}
        monthlyExpenses={totalMonthlyExpenses}
      />

      <UpcomingPaymentsModal
        isOpen={isPaymentsModalOpen}
        onClose={closePaymentsModal}
        payments={upcomingPayments}
        overdueCount={overdueCount}
      />

      <NetCashflowModal
        isOpen={isNetCashflowModalOpen}
        onClose={closeNetCashflowModal}
        monthlyIncome={totalMonthlyIncome}
        monthlyExpenses={totalMonthlyExpenses}
        spendingCategories={spendingCategories}
        recentTransactions={recentTransactions}
      />
    </div>
  );
};

export default CurrentPage;