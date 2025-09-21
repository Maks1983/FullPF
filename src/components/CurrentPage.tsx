import React, { Suspense } from 'react';
import { useCurrentPageLogic } from '../hooks/useCurrentPageLogic';
import ErrorBoundary from './common/ErrorBoundary';
import SkeletonLoader from './common/SkeletonLoader';
import AtAGlanceBanner from './current/AtAGlanceBanner';
import CriticalAlertsSection from './current/CriticalAlertsSection';
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
              upcomingPayments={headerData.upcomingPayments}
            />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary section="Smart Suggestions">
          <Suspense fallback={<SkeletonLoader variant="card" />}>
            <SuggestionsSection {...suggestionsData} />
          </Suspense>
        </ErrorBoundary>

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
        isModalOpen={modalManager.isModalOpen}
        onCloseModal={handleCloseModal}
        isPaymentsModalOpen={modalManager.isPaymentsModalOpen}
        onClosePaymentsModal={handleClosePaymentsModal}
        isNetCashflowModalOpen={modalManager.isNetCashflowModalOpen}
        onCloseNetCashflowModal={handleCloseNetCashflowModal}
        upcomingPayments={headerData.upcomingPayments}
        spendingCategories={spendingCategories}
        recentTransactions={recentTransactions}
        monthlyIncome={totalMonthlyIncome}
        monthlyExpenses={totalMonthlyExpenses}
        totalAvailable={headerData.totalAvailable}
        netLeftoverUntilPaycheck={headerData.netLeftoverUntilPaycheck}
        daysUntilPaycheck={headerData.paycheckInfo.daysUntilPaycheck}
        todaySpending={todaySpending}
        overdueCount={headerData.overdueCount}
      />
    </>
  );
};

export default CurrentPage;
