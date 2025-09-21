import React, { Suspense } from 'react';
import { useState } from 'react';
import { useCurrentPageLogic } from '../hooks/useCurrentPageLogic';
import ErrorBoundary from './common/ErrorBoundary';
import SkeletonLoader from './common/SkeletonLoader';
import AtAGlanceBanner from './current/AtAGlanceBanner';
import CriticalAlertsSection from './current/CriticalAlertsSection';
import CurrentPageModals from './current/modals/CurrentPageModals';
import type { TimeframeType } from '../types/financial';

// Lazy load heavy components
const MoneyFlowSection = React.lazy(() => import('./current/sections/MoneyFlowSection'));
const SuggestionsSection = React.lazy(() => import('./current/sections/SuggestionsSection'));
const AwarenessSection = React.lazy(() => import('./current/sections/AwarenessSection'));

const CurrentPage = () => {
  const [timeframe, setTimeframe] = useState<TimeframeType>('1M');

  const {
    modalManager,
    headerData,
    alertsData,
    suggestionsData,
    awarenessData,
    cashflowProjections,
    spendingCategories,
    recentTransactions,
    daysUntilDeficit,
    totalMonthlyIncome,
    totalMonthlyExpenses,
    // Event handlers
    handleViewDetails,
    handleViewPayments,
    handleViewNetCashflow,
    handleCloseModal,
    handleClosePaymentsModal,
    handleCloseNetCashflowModal
  } = useCurrentPageLogic(timeframe);

  const nextPayment = headerData.upcomingPayments
    .filter(payment => payment.status !== 'paid')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  return (
    <>
      <div
        className={`space-y-6 pb-10${modalManager.anyModalOpen ? ' pointer-events-none select-none' : ''}`}
        aria-hidden={modalManager.anyModalOpen}
      >
        <AtAGlanceBanner
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          totalAvailable={headerData.totalAvailable}
          netLeftover={headerData.netLeftoverUntilPaycheck}
          daysUntilPaycheck={headerData.paycheckInfo.daysUntilPaycheck}
          deficitDays={daysUntilDeficit}
          nextPayment={nextPayment}
          monthlyIncome={headerData.totalMonthlyIncome}
          monthlyExpenses={headerData.totalMonthlyExpenses}
          overdueCount={headerData.overdueCount}
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
        overdueCount={headerData.overdueCount}
      />
    </>
  );
};

export default CurrentPage;
