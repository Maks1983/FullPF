import React, { Suspense } from 'react';
import { useCurrentPageLogic } from '../hooks/useCurrentPageLogic';
import ErrorBoundary from './common/ErrorBoundary';
import SkeletonLoader from './common/SkeletonLoader';
import CurrentPageHeader from './current/CurrentPageHeader';
import CriticalAlertsSection from './current/CriticalAlertsSection';
import CurrentPageModals from './current/modals/CurrentPageModals';

// Lazy load heavy components
const MoneyFlowSection = React.lazy(() => import('./current/sections/MoneyFlowSection'));
const InsightsSection = React.lazy(() => import('./current/sections/InsightsSection'));
const SuggestionsSection = React.lazy(() => import('./current/sections/SuggestionsSection'));
const TransactionsSection = React.lazy(() => import('./current/sections/TransactionsSection'));
const AwarenessSection = React.lazy(() => import('./current/sections/AwarenessSection'));

const CurrentPage = () => {
  const {
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
    // Modal state
    modalState
  } = useCurrentPageLogic();

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <ErrorBoundary section="Page Header">
        <CurrentPageHeader
          {...headerData}
          onViewDetails={handleViewDetails}
          onViewPayments={handleViewPayments}
          onViewNetCashflow={handleViewNetCashflow}
        />
      </ErrorBoundary>

      {/* Critical Alerts */}
      <ErrorBoundary section="Critical Alerts">
        <CriticalAlertsSection {...alertsData} />
      </ErrorBoundary>

      {/* Money Flow Insights - New Component */}
      <ErrorBoundary section="Money Flow Insights">
        <Suspense fallback={<SkeletonLoader variant="card" height="200px" />}>
          <InsightsSection {...insightsData} />
        </Suspense>
      </ErrorBoundary>

      {/* Money Flow Section */}
      <ErrorBoundary section="Money Flow">
        <Suspense fallback={<SkeletonLoader variant="chart" />}>
          <MoneyFlowSection
            cashflowProjections={cashflowProjections}
            spendingCategories={spendingCategories}
            daysUntilDeficit={daysUntilDeficit}
            todaySpending={insightsData.todaySpending}
          />
        </Suspense>
      </ErrorBoundary>

      {/* Smart Suggestions - New Component */}
      <ErrorBoundary section="Smart Suggestions">
        <Suspense fallback={<SkeletonLoader variant="card" height="300px" />}>
          <SuggestionsSection {...suggestionsData} />
        </Suspense>
      </ErrorBoundary>

      {/* Recent Transactions - Enhanced */}
      <ErrorBoundary section="Recent Transactions">
        <Suspense fallback={<SkeletonLoader variant="table" count={5} />}>
          <TransactionsSection transactions={recentTransactions} />
        </Suspense>
      </ErrorBoundary>

      {/* Financial Awareness Summary */}
      <ErrorBoundary section="Financial Awareness">
        <Suspense fallback={<SkeletonLoader variant="card" height="250px" />}>
          <AwarenessSection {...awarenessData} />
        </Suspense>
      </ErrorBoundary>

      {/* All Modals */}
      <ErrorBoundary section="Modals">
        <Suspense fallback={null}>
          <CurrentPageModals
            isModalOpen={modalState.isModalOpen}
            onCloseModal={handleCloseModal}
            isPaymentsModalOpen={modalState.isPaymentsModalOpen}
            onClosePaymentsModal={handleClosePaymentsModal}
            isNetCashflowModalOpen={modalState.isNetCashflowModalOpen}
            onCloseNetCashflowModal={handleCloseNetCashflowModal}
            upcomingPayments={headerData.upcomingPayments}
            spendingCategories={spendingCategories}
            recentTransactions={recentTransactions}
            monthlyIncome={headerData.totalMonthlyIncome}
            monthlyExpenses={headerData.totalMonthlyExpenses}
            overdueCount={headerData.overdueCount}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default CurrentPage;