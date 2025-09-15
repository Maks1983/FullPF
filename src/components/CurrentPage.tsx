import React from 'react';
import { useCurrentPageData } from '../hooks/useCurrentPageData';
import AvailableMoneyCard from './current/AvailableMoneyCard';
import UpcomingPaymentsCard from './current/UpcomingPaymentsCard';
import CashflowProjectionChart from './current/CashflowProjectionChart';
import SpendingCategoriesCard from './current/SpendingCategoriesCard';
import RecentTransactionsCard from './current/RecentTransactionsCard';
import { AlertTriangle, TrendingUp, TrendingDown, Clock } from 'lucide-react';

const CurrentPage = () => {
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
    highPriorityPayments
  } = useCurrentPageData();

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Current Accounts</h1>
        <p className="text-gray-600 mt-1">
          Operational day-to-day finances and immediately available money
        </p>
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-400 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800">
                {criticalAlerts} Critical Alert{criticalAlerts > 1 ? 's' : ''} Require Attention
              </h3>
              <div className="mt-2 text-sm text-red-700 space-y-1">
                {overdueCount > 0 && (
                  <p>• {overdueCount} overdue payment{overdueCount > 1 ? 's' : ''}</p>
                )}
                {isDeficitProjected && (
                  <p>• Projected deficit in {daysUntilDeficit} days</p>
                )}
                {highPriorityPayments > 0 && (
                  <p>• {highPriorityPayments} high-priority payment{highPriorityPayments > 1 ? 's' : ''} due soon</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Available Now</h3>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">
            NOK {totalAvailable.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">Immediately accessible</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Today's Spending</h3>
            <TrendingDown className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600">
            NOK {todaySpending.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">Spent today</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Until Paycheck</h3>
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {paycheckInfo.daysUntilPaycheck} days
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {new Date(paycheckInfo.nextPaycheckDate).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Net Leftover</h3>
            {netLeftoverUntilPaycheck >= 0 ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
          </div>
          <p className={`text-2xl font-bold ${
            netLeftoverUntilPaycheck >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            NOK {netLeftoverUntilPaycheck.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">After scheduled payments</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Money - Full Focus */}
        <div className="lg:col-span-2">
          <AvailableMoneyCard
            accounts={accounts}
            totalAvailable={totalAvailable}
            netLeftover={netLeftoverUntilPaycheck}
            paycheckInfo={paycheckInfo}
          />
        </div>

        {/* Upcoming Payments */}
        <UpcomingPaymentsCard
          payments={upcomingPayments}
          overdueCount={overdueCount}
        />

        {/* Spending Categories */}
        <SpendingCategoriesCard
          categories={spendingCategories}
          todaySpending={todaySpending}
        />
      </div>

      {/* Cashflow Projection - Full Width */}
      <CashflowProjectionChart
        projections={cashflowProjections}
        daysUntilDeficit={daysUntilDeficit}
      />

      {/* Recent Transactions */}
      <RecentTransactionsCard transactions={recentTransactions} />

      {/* Financial Health Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Financial Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${
              criticalAlerts === 0 ? 'text-green-600' : 
              criticalAlerts <= 2 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {criticalAlerts === 0 ? '✓' : criticalAlerts}
            </div>
            <p className="text-sm text-gray-600">
              {criticalAlerts === 0 ? 'No Critical Issues' : 'Critical Alerts'}
            </p>
          </div>
          
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${
              isDeficitProjected ? 'text-red-600' : 'text-green-600'
            }`}>
              {isDeficitProjected ? daysUntilDeficit : '✓'}
            </div>
            <p className="text-sm text-gray-600">
              {isDeficitProjected ? 'Days Until Deficit' : 'No Deficit Projected'}
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {paycheckInfo.daysUntilPaycheck}
            </div>
            <p className="text-sm text-gray-600">Days Until Paycheck</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentPage;
</parameter>
</invoke>