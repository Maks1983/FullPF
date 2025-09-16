import React from 'react';
import { useCurrentPageData } from '../hooks/useCurrentPageData';
import { useModalState } from '../hooks/useModalState';
import { useFinancialCalculations } from '../hooks/useFinancialCalculations';
import CurrentPageHeader from './current/CurrentPageHeader';
import CriticalAlertsSection from './current/CriticalAlertsSection';
import DetailedModal from './current/DetailedModal';
import UpcomingPaymentsModal from './current/UpcomingPaymentsModal';
import CashflowProjectionChart from './current/CashflowProjectionChart';
import SpendingCategoriesCard from './current/SpendingCategoriesCard';
import RecentTransactionsCard from './current/RecentTransactionsCard';
import MoneyFlowInsights from './current/MoneyFlowInsights';
import SmartSuggestions from './current/SmartSuggestions';
import NetCashflowModal from './current/NetCashflowModal';
import FinancialAwarenessSummary from './current/FinancialAwarenessSummary';

const CurrentPage = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    isPaymentsModalOpen,
    setIsPaymentsModalOpen,
    isNetCashflowModalOpen,
    setIsNetCashflowModalOpen,
  } = useModalState();
  
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

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <CurrentPageHeader
        accounts={accounts}
        totalAvailable={totalAvailable}
        netLeftoverUntilPaycheck={netLeftoverUntilPaycheck}
        paycheckInfo={paycheckInfo}
        upcomingPayments={upcomingPayments}
        overdueCount={overdueCount}
        totalMonthlyIncome={totalMonthlyIncome}
        totalMonthlyExpenses={totalMonthlyExpenses}
        onViewDetails={() => setIsModalOpen(true)}
        onViewPayments={() => setIsPaymentsModalOpen(true)}
        onViewNetCashflow={() => setIsNetCashflowModalOpen(true)}
      />

      {/* Critical Alerts */}
      <CriticalAlertsSection
        criticalAlerts={criticalAlerts}
        overdueCount={overdueCount}
        isDeficitProjected={isDeficitProjected}
        daysUntilDeficit={daysUntilDeficit}
        highPriorityPayments={highPriorityPayments}
      />

      {/* Money Flow Insights - New Component */}
      <MoneyFlowInsights 
        monthlyIncome={totalMonthlyIncome}
        monthlyExpenses={totalMonthlyExpenses}
        spendingCategories={spendingCategories}
        todaySpending={todaySpending}
        recentTransactions={recentTransactions}
      />

      {/* Main Money Available Card - Top Position */}
      {/* Main Content Grid - Enhanced Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Money Status */}
        <div className="xl:col-span-2 space-y-6">
          {/* Additional summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          </div>
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

      {/* Smart Suggestions - New Component */}
      <SmartSuggestions 
        netLeftover={netLeftoverUntilPaycheck}
        savingsRate={savingsRate}
        spendingCategories={spendingCategories}
        overdueCount={overdueCount}
        daysUntilPaycheck={paycheckInfo.daysUntilPaycheck}
      />

      {/* Recent Transactions - Enhanced */}
      <RecentTransactionsCard transactions={recentTransactions} />

      {/* Financial Awareness Summary */}
      <FinancialAwarenessSummary
        totalMonthlyIncome={totalMonthlyIncome}
        totalMonthlyExpenses={totalMonthlyExpenses}
        biggestExpenseCategory={biggestExpenseCategory}
        savingsRate={savingsRate}
        paycheckDays={paycheckInfo.daysUntilPaycheck}
        netLeftoverUntilPaycheck={netLeftoverUntilPaycheck}
      />

      {/* Detailed Modal */}
      <DetailedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        upcomingPayments={upcomingPayments}
        spendingCategories={spendingCategories}
        monthlyIncome={totalMonthlyIncome}
        monthlyExpenses={totalMonthlyExpenses}
      />

      {/* Upcoming Payments Modal */}
      <UpcomingPaymentsModal
        isOpen={isPaymentsModalOpen}
        onClose={() => setIsPaymentsModalOpen(false)}
        payments={upcomingPayments}
        overdueCount={overdueCount}
      />

      <NetCashflowModal
        isOpen={isNetCashflowModalOpen}
        onClose={() => setIsNetCashflowModalOpen(false)}
        monthlyIncome={totalMonthlyIncome}
        monthlyExpenses={totalMonthlyExpenses}
        spendingCategories={spendingCategories}
        recentTransactions={recentTransactions}
      />
    </div>
  );
};

export default CurrentPage;