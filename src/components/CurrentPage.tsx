import React from 'react';
import { useCurrentPageData } from '../hooks/useCurrentPageData';
import AvailableMoneyCard from './current/AvailableMoneyCard';
import MoneyRecommendationsCard from './current/MoneyRecommendationsCard';
import CashflowProjectionChart from './current/CashflowProjectionChart';
import UpcomingPaymentsCard from './current/UpcomingPaymentsCard';
import RecentTransactionsCard from './current/RecentTransactionsCard';
import SpendingCategoriesCard from './current/SpendingCategoriesCard';

const CurrentPage = () => {
  const {
    accounts,
    upcomingPayments,
    recentTransactions,
    paycheckInfo,
    spendingCategories,
    cashflowProjections,
    recommendations,
    totalAvailable,
    netLeftover,
    overdueCount,
    daysUntilDeficit,
    todaySpending
  } = useCurrentPageData();

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Current Financial Status</h1>
        <p className="text-gray-600 mt-1">
          Quick snapshot of your finances until next payday ({paycheckInfo.daysUntilPaycheck} days)
        </p>
      </div>

      {/* Top Row - Available Money & Smart Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AvailableMoneyCard 
          accounts={accounts}
          totalAvailable={totalAvailable}
          netLeftover={netLeftover}
          paycheckInfo={paycheckInfo}
        />
        <MoneyRecommendationsCard recommendations={recommendations} />
      </div>

      {/* Cashflow Projection */}
      <CashflowProjectionChart 
        projections={cashflowProjections}
        daysUntilDeficit={daysUntilDeficit}
      />

      {/* Middle Row - Payments & Spending */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UpcomingPaymentsCard 
          payments={upcomingPayments}
          overdueCount={overdueCount}
        />
        <SpendingCategoriesCard 
          categories={spendingCategories}
          todaySpending={todaySpending}
        />
      </div>

      {/* Recent Transactions */}
      <RecentTransactionsCard transactions={recentTransactions} />
    </div>
  );
};

export default CurrentPage;