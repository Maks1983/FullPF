import React, { Suspense } from 'react';
import { useCurrentPageLogic } from '../hooks/useCurrentPageLogic';
import ErrorBoundary from './common/ErrorBoundary';
import SkeletonLoader from './common/SkeletonLoader';
import AtAGlanceBanner from './current/AtAGlanceBanner';
import CriticalAlertsSection from './current/CriticalAlertsSection';
import UpcomingPaymentsTimeline from './current/UpcomingPaymentsTimeline';
import CollapsibleSection from './common/CollapsibleSection';
import CurrentPageModals from './current/modals/CurrentPageModals';

// Lazy load heavy components
const MoneyFlowSection = React.lazy(() => import('./current/sections/MoneyFlowSection'));
const InsightsSection = React.lazy(() => import('./current/sections/InsightsSection'));
const SuggestionsSection = React.lazy(() => import('./current/sections/SuggestionsSection'));
const TransactionsSection = React.lazy(() => import('./current/sections/TransactionsSection'));
const AwarenessSection = React.lazy(() => import('./current/sections/AwarenessSection'));

const CurrentPage = () => {
  const {
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
    todaySpending,
    dailyAverageSpending,
    totalMonthlyIncome,
    totalMonthlyExpenses,
    // Event handlers
    handleViewDetails,
    handleViewPayments,
    handleViewNetCashflow,
    handleCloseModal,
    handleClosePaymentsModal,
    handleCloseNetCashflowModal
  } = useCurrentPageLogic();

  const nextPayment = headerData.upcomingPayments
    .filter(payment => payment.status !== 'paid')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  return (
    <>
      <div
        className={`space-y-6 pb-10${modalManager.anyModalOpen ? ' pointer-events-none select-none' : ''}`}
        aria-hidden={modalManager.anyModalOpen}
        inert={modalManager.anyModalOpen}
      >
        <AtAGlanceBanner
          totalAvailable={headerData.totalAvailable}
          netLeftover={headerData.netLeftoverUntilPaycheck}
          daysUntilPaycheck={headerData.paycheckInfo.daysUntilPaycheck}
          deficitDays={daysUntilDeficit}
          nextPayment={nextPayment}
          monthlyIncome={headerData.totalMonthlyIncome}
          monthlyExpenses={headerData.totalMonthlyExpenses}
          overdueCount={headerData.overdueCount}
          todaySpending={todaySpending}
          healthStatus={headerData.healthStatus}
          onViewDetails={handleViewDetails}
          onViewPayments={handleViewPayments}
          onViewNetCashflow={handleViewNetCashflow}
        />

        <ErrorBoundary section="Critical Alerts">
          <CriticalAlertsSection {...alertsData} />
        </ErrorBoundary>

        <ErrorBoundary section="Money Flow">
          <Suspense fallback={<SkeletonLoader variant="chart" />}>
            <MoneyFlowSection
              cashflowProjections={cashflowProjections}
              spendingCategories={spendingCategories}
              daysUntilDeficit={daysUntilDeficit}
              todaySpending={todaySpending}
              dailyAverageSpending={dailyAverageSpending}
              netLeftover={headerData.netLeftoverUntilPaycheck}
              monthlyIncome={totalMonthlyIncome}
              monthlyExpenses={totalMonthlyExpenses}
            />
          </Suspense>
        </ErrorBoundary>

        <div className="grid gap-6 lg:grid-cols-2">
          <ErrorBoundary section="Upcoming Payments">
            <UpcomingPaymentsTimeline
              payments={headerData.upcomingPayments}
              overdueCount={headerData.overdueCount}
            />
          </ErrorBoundary>

          <ErrorBoundary section="Smart Suggestions">
            <Suspense fallback={<SkeletonLoader variant="card" />}>
              <SuggestionsSection {...suggestionsData} />
            </Suspense>
          </ErrorBoundary>
        </div>

        <ErrorBoundary section="Financial Awareness">
          <Suspense fallback={<SkeletonLoader variant="card" />}>
            <AwarenessSection
              totalMonthlyIncome={totalMonthlyIncome}
              totalMonthlyExpenses={totalMonthlyExpenses}
              biggestExpenseCategory={awarenessData.biggestExpenseCategory}
              savingsRate={awarenessData.savingsRate}
              paycheckDays={awarenessData.paycheckDays}
              netLeftoverUntilPaycheck={awarenessData.netLeftoverUntilPaycheck}
            />
          </Suspense>
        </ErrorBoundary>
      </div>

      <CurrentPageModals
        modalManager={modalManager}
        headerData={headerData}
        alertsData={alertsData}
        insightsData={insightsData}
        suggestionsData={suggestionsData}
        awarenessData={awarenessData}
        cashflowProjections={cashflowProjections}
        spendingCategories={spendingCategories}
        recentTransactions={recentTransactions}
        onCloseModal={handleCloseModal}
        onClosePaymentsModal={handleClosePaymentsModal}
        onCloseNetCashflowModal={handleCloseNetCashflowModal}
      />
    </>
  );
};

export default CurrentPage;