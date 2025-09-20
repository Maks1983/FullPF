import React, { Suspense } from 'react';
import { useCurrentPageLogic } from '../hooks/useCurrentPageLogic';
import ErrorBoundary from './common/ErrorBoundary';
import SkeletonLoader from './common/SkeletonLoader';
import AtAGlanceBanner from './current/AtAGlanceBanner';
import UpcomingPaymentsTimeline from './current/UpcomingPaymentsTimeline';
import CurrentPageModals from './current/modals/CurrentPageModals';
import CashflowProjectionChart from './current/CashflowProjectionChart';
import SpendingCategoriesCard from './current/SpendingCategoriesCard';
import SmartSuggestions from './current/SmartSuggestions';

// Lazy load heavy components
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
        handleCloseModal
  } = useCurrentPageLogic();

  const nextPayment = headerData.upcomingPayments
    .filter(payment => payment.status !== 'paid')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  return (
    <>
      <div
        className={`space-y-8 pb-10${modalManager.anyModalOpen ? ' pointer-events-none select-none' : ''}`}
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

        {/* Main Content Grid */}
        {/* Full Width Cashflow Chart */}
        <ErrorBoundary section="Cashflow Projection">
          <CashflowProjectionChart
            projections={cashflowProjections}
            daysUntilDeficit={daysUntilDeficit}
          />
        </ErrorBoundary>

        {/* Three Column Grid - All Similar Heights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Spending Categories */}
          <ErrorBoundary section="Spending Categories">
            <SpendingCategoriesCard
              categories={spendingCategories}
              todaySpending={todaySpending}
            />
          </ErrorBoundary>

          {/* Upcoming Payments */}
          <ErrorBoundary section="Upcoming Payments">
            <UpcomingPaymentsTimeline
              payments={headerData.upcomingPayments}
              limit={5}
            />
          </ErrorBoundary>

          {/* Smart Suggestions */}
          <ErrorBoundary section="Smart Suggestions">
            <SmartSuggestions
              netLeftover={suggestionsData.netLeftover}
              savingsRate={suggestionsData.savingsRate}
              spendingCategories={suggestionsData.spendingCategories}
              overdueCount={suggestionsData.overdueCount}
              daysUntilPaycheck={suggestionsData.daysUntilPaycheck}
              totalAvailable={suggestionsData.totalAvailable}
              monthlyExpenses={suggestionsData.monthlyExpenses}
            />
          </ErrorBoundary>
        </div>

        {/* Financial Awareness Summary - Full Width at Bottom */}
        <ErrorBoundary section="Financial Awareness">
          <Suspense fallback={<SkeletonLoader variant="card" />}>
            <AwarenessSection {...awarenessData} />
          </Suspense>
        </ErrorBoundary>
      </div>

      <CurrentPageModals
        modalManager={modalManager}
        isModalOpen={modalManager.isModalOpen}
        onCloseModal={handleCloseModal}
        isPaymentsModalOpen={modalManager.isPaymentsModalOpen}
        onCloseModal={handleCloseModal}
        onClosePaymentsModal={handleCloseModal}
        onCloseNetCashflowModal={handleCloseModal}
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