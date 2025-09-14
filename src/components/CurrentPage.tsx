import React, { useState } from 'react';
import { useCurrentData } from '../hooks/useCurrentData';
import AccountBalanceCard from './current/AccountBalanceCard';
import PaydayCountdown from './current/PaydayCountdown';
import BudgetProgressCard from './current/BudgetProgressCard';
import DailySpendingChart from './current/DailySpendingChart';
import TransactionsList from './current/TransactionsList';
import { Wallet, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

const CurrentPage = () => {
  const { 
    accounts, 
    todayTransactions, 
    recentTransactions, 
    budgetCategories, 
    paydayInfo, 
    dailySpending,
    metrics 
  } = useCurrentData();

  const { 
    totalBalance, 
    todaySpending, 
    todayIncome, 
    netCashflow, 
    overBudgetCategories,
    budgetHealthScore,
    accountSummary 
  } = metrics;

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Current Overview</h1>
        <p className="text-gray-600 mt-1">
          Real-time view of your accounts, spending, and daily financial activity
        </p>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
            <Wallet className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            NOK {totalBalance.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Across {accountSummary.total} accounts
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Today's Spending</h3>
            <TrendingDown className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600">
            NOK {todaySpending.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {todayTransactions.filter(t => t.amount < 0).length} transactions
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Today's Income</h3>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">
            NOK {todayIncome.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {todayTransactions.filter(t => t.amount > 0).length} deposits
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Net Cashflow</h3>
            {netCashflow >= 0 ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
          </div>
          <p className={`text-2xl font-bold ${netCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {netCashflow >= 0 ? '+' : ''}NOK {netCashflow.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">Today's net flow</p>
        </div>
      </div>

      {/* Alerts Section */}
      {(accountSummary.lowBalance > 0 || overBudgetCategories > 0 || paydayInfo.isDeficit) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-900">Financial Alerts</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {accountSummary.lowBalance > 0 && (
              <div className="flex items-center space-x-2 text-red-800">
                <div className="w-2 h-2 bg-red-600 rounded-full" />
                <span>{accountSummary.lowBalance} account(s) below minimum balance</span>
              </div>
            )}
            {overBudgetCategories > 0 && (
              <div className="flex items-center space-x-2 text-red-800">
                <div className="w-2 h-2 bg-red-600 rounded-full" />
                <span>{overBudgetCategories} budget categories over limit</span>
              </div>
            )}
            {paydayInfo.isDeficit && (
              <div className="flex items-center space-x-2 text-red-800">
                <div className="w-2 h-2 bg-red-600 rounded-full" />
                <span>Projected deficit before next payday</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Account Balances */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Balances</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <AccountBalanceCard key={account.id} account={account} />
          ))}
        </div>
      </div>

      {/* Payday & Budget Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaydayCountdown 
          paydayInfo={paydayInfo} 
          currentBalance={totalBalance}
        />
        <BudgetProgressCard categories={budgetCategories} />
      </div>

      {/* Daily Spending Chart */}
      <DailySpendingChart 
        data={dailySpending} 
        todaySpending={todaySpending}
      />

      {/* Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionsList 
          transactions={todayTransactions}
          title="Today's Transactions"
          showFilters={true}
        />
        <TransactionsList 
          transactions={recentTransactions}
          title="Recent Activity"
        />
      </div>

      {/* Budget Health Score */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Budget Health Score</h3>
            <p className="text-gray-600">Based on spending patterns and budget adherence</p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${
              budgetHealthScore >= 80 ? 'text-green-600' :
              budgetHealthScore >= 60 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {budgetHealthScore}
            </div>
            <p className="text-sm text-gray-600">out of 100</p>
          </div>
        </div>
        
        <div className="mt-4 bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all ${
              budgetHealthScore >= 80 ? 'bg-green-500' :
              budgetHealthScore >= 60 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${budgetHealthScore}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default CurrentPage;