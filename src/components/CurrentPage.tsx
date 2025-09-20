import React, { Suspense } from 'react';
import { useCurrentPageLogic } from '../hooks/useCurrentPageLogic';
import ErrorBoundary from './common/ErrorBoundary';
import SkeletonLoader from './common/SkeletonLoader';
import AtAGlanceBanner from './current/AtAGlanceBanner';
import CurrentPageHeader from './current/CurrentPageHeader';
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
    handleCloseNetCashflowModal,
    // Modal state
    modalState
  } = useCurrentPageLogic();

  const isAnyModalOpen =
    modalState.isModalOpen ||
    modalState.isPaymentsModalOpen ||
    modalState.isNetCashflowModalOpen;

  const nextPayment = headerData.upcomingPayments
    .filter(payment => payment.status !== 'paid')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  return (
    <>
      <div
        className={`space-y-6 pb-10${isAnyModalOpen ? ' pointer-events-none select-none' : ''}`}
        aria-hidden={isAnyModalOpen}
        inert={isAnyModalOpen}
      >
        <AtAGlanceBanner
          totalAvailable={headerData.totalAvailable}
          daysUntilPaycheck={headerData.paycheckInfo.daysUntilPaycheck}
          nextPayment={nextPayment}
          deficitDays={daysUntilDeficit}
          netLeftover={headerData.netLeftoverUntilPaycheck}
        />

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <ErrorBoundary section="Page Header">
              <CurrentPageHeader
                {...headerData}
                onViewDetails={handleViewDetails}
                onViewPayments={handleViewPayments}
                onViewNetCashflow={handleViewNetCashflow}
              />
            </ErrorBoundary>

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

            <CollapsibleSection
              title="Insight dashboard"
              subtitle="Dive deeper when you have a moment"
              defaultOpen
              id="insights-section"
            >
              <ErrorBoundary section="Money Flow Insights">
                <Suspense fallback={<SkeletonLoader variant="card" height="200px" />}>
                  <InsightsSection {...insightsData} />
                </Suspense>
              </ErrorBoundary>
            </CollapsibleSection>

            <CollapsibleSection
              title="Financial awareness summary"
              subtitle="Monthly trends and readiness"
              id="awareness-section"
            >
              <ErrorBoundary section="Financial Awareness">
                <Suspense fallback={<SkeletonLoader variant="card" height="250px" />}>
                  <AwarenessSection {...awarenessData} />
                </Suspense>
              </ErrorBoundary>
            </CollapsibleSection>
          </div>

          <div className="space-y-6">
            <UpcomingPaymentsTimeline payments={headerData.upcomingPayments} />

            <ErrorBoundary section="Smart Suggestions">
              <Suspense fallback={<SkeletonLoader variant="card" height="300px" />}>
                <SuggestionsSection {...suggestionsData} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>

        <ErrorBoundary section="Recent Transactions">
          <Suspense fallback={<SkeletonLoader variant="table" count={5} />}>
            <TransactionsSection transactions={recentTransactions} />
          </Suspense>
        </ErrorBoundary>
      </div>

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
            totalAvailable={headerData.totalAvailable}
            netLeftoverUntilPaycheck={headerData.netLeftoverUntilPaycheck}
            daysUntilPaycheck={headerData.paycheckInfo.daysUntilPaycheck}
            todaySpending={todaySpending}
            overdueCount={headerData.overdueCount}
          />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default CurrentPage;
