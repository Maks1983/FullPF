import React from 'react';
import { useCurrentPageData } from '../hooks/useCurrentPageData';
import PaydayCountdownCard from './current/PaydayCountdownCard';
import UpcomingTransactionsTable from './current/UpcomingTransactionsTable';
import OverduePaymentsTable from './current/OverduePaymentsTable';
import CategoryChartsCard from './current/CategoryChartsCard';
import MonthlyOverviewChart from './current/MonthlyOverviewChart';
import LatestTransactionsTable from './current/LatestTransactionsTable';

const CurrentPage = () => {
  const {
    paydayInfo,
    upcomingTransactions,
    overduePayments,
    categoryData,
    monthlyData,
    recentTransactions
  } = useCurrentPageData();

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Current Overview</h1>
        <p className="text-gray-600 mt-1">
          Quick snapshot of finances until next payday
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Payday Countdown */}
        <div className="lg:col-span-1">
          <PaydayCountdownCard paydayInfo={paydayInfo} />
        </div>

        {/* Right Columns - Tables */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Transactions */}
          <UpcomingTransactionsTable transactions={upcomingTransactions} />
          
          {/* Overdue Payments */}
          <OverduePaymentsTable payments={overduePayments} />
        </div>
      </div>

      {/* Category Charts */}
      <CategoryChartsCard categories={categoryData} />

      {/* Monthly Overview */}
      <MonthlyOverviewChart monthlyData={monthlyData} />

      {/* Latest Transactions */}
      <LatestTransactionsTable transactions={recentTransactions} />
    </div>
  );
};

export default CurrentPage;