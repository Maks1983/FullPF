import React from 'react';
import { useCurrentPageLogic } from '../hooks/useCurrentPageLogic';
import CurrentPageHeader from './current/CurrentPageHeader';
import CriticalAlertsSection from './current/CriticalAlertsSection';
import MoneyFlowSection from './current/sections/MoneyFlowSection';
import InsightsSection from './current/sections/InsightsSection';
import SuggestionsSection from './current/sections/SuggestionsSection';
import TransactionsSection from './current/sections/TransactionsSection';
import AwarenessSection from './current/sections/AwarenessSection';
import CurrentPageModals from './current/modals/CurrentPageModals';

const CurrentPage = () => {
  const {
    modalState,
    headerData,
    alertsData,
    insightsData,
    suggestionsData,
    awarenessData,
    cashflowProjections,
    spendingCategories,
    recentTransactions,
    daysUntilDeficit
  } = useCurrentPageLogic();

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <CurrentPageHeader
        {...headerData}
        onViewDetails={() => modalState.setIsModalOpen(true)}
        onViewPayments={() => modalState.setIsPaymentsModalOpen(true)}
        onViewNetCashflow={() => modalState.setIsNetCashflowModalOpen(true)}
      />

      {/* Critical Alerts */}
      <CriticalAlertsSection {...alertsData} />

      {/* Money Flow Insights - New Component */}
      <InsightsSection {...insightsData} />

      {/* Money Flow Section */}
      <MoneyFlowSection
        cashflowProjections={cashflowProjections}
        spendingCategories={spendingCategories}
        daysUntilDeficit={daysUntilDeficit}
        todaySpending={insightsData.todaySpending}
      />

      {/* Smart Suggestions - New Component */}
      <SuggestionsSection {...suggestionsData} />

      {/* Recent Transactions - Enhanced */}
      <TransactionsSection transactions={recentTransactions} />

      {/* Financial Awareness Summary */}
      <AwarenessSection {...awarenessData} />

      {/* All Modals */}
      <CurrentPageModals
        isModalOpen={modalState.isModalOpen}
        onCloseModal={() => modalState.setIsModalOpen(false)}
        isPaymentsModalOpen={modalState.isPaymentsModalOpen}
        onClosePaymentsModal={() => modalState.setIsPaymentsModalOpen(false)}
        isNetCashflowModalOpen={modalState.isNetCashflowModalOpen}
        onCloseNetCashflowModal={() => modalState.setIsNetCashflowModalOpen(false)}
        upcomingPayments={headerData.upcomingPayments}
        spendingCategories={spendingCategories}
        recentTransactions={recentTransactions}
        monthlyIncome={headerData.totalMonthlyIncome}
        monthlyExpenses={headerData.totalMonthlyExpenses}
        overdueCount={headerData.overdueCount}
      />
    </div>
  );
};

export default CurrentPage;