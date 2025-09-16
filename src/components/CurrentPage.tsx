import React, { Suspense } from 'react';
import { useCurrentPageFinancial } from '../hooks/useConsolidatedFinancial';
import ErrorBoundary from './common/ErrorBoundary';
import CardSkeleton from './common/CardSkeleton';
import ResponsiveGrid from './common/ResponsiveGrid';
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
import { RESPONSIVE_CLASSES } from '../constants/responsive';

const CurrentPage = () => {
  // Error boundary wrapper for the entire page
  const renderWithErrorBoundary = (component: React.ReactNode) => (
    <ErrorBoundary>{component}</ErrorBoundary>
  );

  // Use consolidated hook for all financial data
  const financial = useCurrentPageFinancial();
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
    highPriorityPayments,
    monthlyIncome,
    monthlyExpenses,
    savingsRate,
  } = financial;
  
  const {
    totalMonthlyIncome,
    totalMonthlyExpenses,
    biggestExpenseCategory,
  } = financial.calculations;
  
  const {
    isModalOpen,
    setIsModalOpen,
    isPaymentsModalOpen,
    setIsPaymentsModalOpen,
    isNetCashflowModalOpen,
    setIsNetCashflowModalOpen,
  } = financial.modals;

  return (
    <div className={`space-y-8 pb-8 ${RESPONSIVE_CLASSES.paddingResponsive}`}>
      {/* Page Header */}
      {renderWithErrorBoundary(
        <Suspense fallback={
          <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </ResponsiveGrid>
        }>
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
        </Suspense>
      )}

      {/* Critical Alerts */}
      {renderWithErrorBoundary(
        <CriticalAlertsSection
          criticalAlerts={criticalAlerts}
          overdueCount={overdueCount}
          isDeficitProjected={isDeficitProjected}
          daysUntilDeficit={daysUntilDeficit}
          highPriorityPayments={highPriorityPayments}
        />
      )}

      {/* Money Flow Insights - New Component */}
      {renderWithErrorBoundary(
        <Suspense fallback={<CardSkeleton className="h-64" />}>
          <MoneyFlowInsights 
            monthlyIncome={totalMonthlyIncome}
            monthlyExpenses={totalMonthlyExpenses}
            spendingCategories={spendingCategories}
            todaySpending={todaySpending}
            recentTransactions={recentTransactions}
          />
        </Suspense>
      )}

      {/* Main Money Available Card - Top Position */}
      {/* Main Content Grid - Enhanced Layout */}
      <ResponsiveGrid 
        columns={{ mobile: 1, desktop: 2, wide: 3 }}
        gap="lg"
        className="xl:grid-cols-3"
      >
        {/* Left Column - Money Status */}
        <div className="xl:col-span-2 space-y-6">
          {/* Additional summary cards */}
          <ResponsiveGrid columns={{ mobile: 1, tablet: 2 }} gap="md" />
          {/* Cashflow Projection - Full Width */}
          {renderWithErrorBoundary(
            <Suspense fallback={<CardSkeleton className="h-80" />}>
              <CashflowProjectionChart
                projections={cashflowProjections}
                daysUntilDeficit={daysUntilDeficit}
              />
            </Suspense>
          )}
        </div>

        {/* Right Column - Payments & Spending */}
        <div className="space-y-6">
          {/* Spending Categories */}
          {renderWithErrorBoundary(
            <Suspense fallback={<CardSkeleton className="h-96" />}>
              <SpendingCategoriesCard
                categories={spendingCategories}
                todaySpending={todaySpending}
              />
            </Suspense>
          )}
        </div>
      </ResponsiveGrid>

      {/* Smart Suggestions - New Component */}
      {renderWithErrorBoundary(
        <Suspense fallback={<CardSkeleton className="h-64" />}>
          <SmartSuggestions 
            netLeftover={netLeftoverUntilPaycheck}
            savingsRate={savingsRate}
            spendingCategories={spendingCategories}
            overdueCount={overdueCount}
            daysUntilPaycheck={paycheckInfo.daysUntilPaycheck}
          />
        </Suspense>
      )}

      {/* Recent Transactions - Enhanced */}
      {renderWithErrorBoundary(
        <Suspense fallback={<CardSkeleton className="h-80" />}>
          <RecentTransactionsCard transactions={recentTransactions} />
        </Suspense>
      )}

      {/* Financial Awareness Summary */}
      {renderWithErrorBoundary(
        <FinancialAwarenessSummary
          totalMonthlyIncome={monthlyIncome}
          totalMonthlyExpenses={monthlyExpenses}
          biggestExpenseCategory={biggestExpenseCategory}
          savingsRate={savingsRate}
          paycheckDays={paycheckInfo.daysUntilPaycheck}
          netLeftoverUntilPaycheck={netLeftoverUntilPaycheck}
        />
      )}

      {/* Detailed Modal */}
      <DetailedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        upcomingPayments={upcomingPayments}
        spendingCategories={spendingCategories}
        monthlyIncome={monthlyIncome}
        monthlyExpenses={monthlyExpenses}
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
        monthlyIncome={monthlyIncome}
        monthlyExpenses={monthlyExpenses}
        spendingCategories={spendingCategories}
        recentTransactions={recentTransactions}
      />
    </div>
  );
};

export default CurrentPage;