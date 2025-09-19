import React from 'react';
import { ArrowUpRight, TrendingUp, PieChart, Calendar } from 'lucide-react';
import type { SpendingCategory, RecentTransaction } from '../../types/current';

interface MoneyFlowInsightsProps {
  monthlyIncome: number;
  monthlyExpenses: number;
  spendingCategories: SpendingCategory[];
  todaySpending: number;
  recentTransactions: RecentTransaction[];
}

const MoneyFlowInsights: React.FC<MoneyFlowInsightsProps> = ({
  monthlyIncome,
  monthlyExpenses,
  spendingCategories,
  todaySpending,
  recentTransactions
}) => {
  const categories = spendingCategories ?? [];
  const transactions = recentTransactions ?? [];

  const netFlow = monthlyIncome - monthlyExpenses;
  const dailyAverageSpending = monthlyExpenses > 0 ? monthlyExpenses / 30 : 0;
  const isSpendingHighToday = dailyAverageSpending > 0
    ? todaySpending > dailyAverageSpending * 1.5
    : todaySpending > 0;

  const topSpendingCategory = categories.reduce<SpendingCategory | undefined>((currentMax, category) => {
    if (!currentMax || category.spent > currentMax.spent) {
      return category;
    }
    return currentMax;
  }, undefined);

  const overBudgetCategories = categories.filter(category => category.isOverBudget);

  const expenseTransactions = transactions.filter(transaction => transaction.amount < 0);
  const incomeTransactions = transactions.filter(transaction => transaction.amount > 0);

  const frequentMerchants = expenseTransactions.reduce<Record<string, number>>((accumulator, transaction) => {
    if (transaction.merchant) {
      accumulator[transaction.merchant] = (accumulator[transaction.merchant] || 0) + 1;
    }
    return accumulator;
  }, {});

  const mostFrequentMerchant = Object.entries(frequentMerchants)
    .sort(([, countA], [, countB]) => countB - countA)[0];

  const largestExpense = expenseTransactions.length > 0
    ? Math.min(...expenseTransactions.map(transaction => transaction.amount))
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <TrendingUp className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Money Flow Insights</h3>
        <span className="text-sm text-gray-500">Understanding where your money goes</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <ArrowUpRight className="h-4 w-4 mr-2 text-green-600" />
            Monthly Money Flow
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Money In</span>
              <span className="font-semibold text-green-600">+NOK {monthlyIncome.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Money Out</span>
              <span className="font-semibold text-red-600">-NOK {monthlyExpenses.toLocaleString()}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Net Flow</span>
                <span className={`font-bold ${netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {netFlow >= 0 ? '+' : ''}NOK {netFlow.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Today's spending</span>
              <span className={isSpendingHighToday ? 'text-red-600 font-medium' : 'text-gray-700'}>
                NOK {todaySpending.toLocaleString()} {dailyAverageSpending > 0 && (
                  <span className="text-gray-500">
                    (avg {Math.round(dailyAverageSpending).toLocaleString()})
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <PieChart className="h-4 w-4 mr-2 text-purple-600" />
            Spending Patterns
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Biggest Category</p>
              <p className="font-semibold text-purple-600">{topSpendingCategory?.name ?? 'No data yet'}</p>
              <p className="text-xs text-gray-500">
                {topSpendingCategory ? `NOK ${topSpendingCategory.spent.toLocaleString()} spent` : 'Connect accounts to see category totals'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Daily Average</p>
              <p className="font-semibold text-gray-900">NOK {Math.round(dailyAverageSpending).toLocaleString()}</p>
              <p className={`text-xs ${isSpendingHighToday ? 'text-red-500' : 'text-green-500'}`}>
                Today: NOK {todaySpending.toLocaleString()} {isSpendingHighToday ? '(Above average)' : '(On track)'}
              </p>
            </div>
            {overBudgetCategories.length > 0 ? (
              <div>
                <p className="text-sm text-red-600 font-medium">Over Budget</p>
                <p className="text-xs text-red-500">
                  {overBudgetCategories.length} categor{overBudgetCategories.length > 1 ? 'ies' : 'y'} over limit
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-green-600 font-medium">Within Budget</p>
                <p className="text-xs text-green-500">All tracked categories are within set limits</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-orange-600" />
            Recent Activity
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Recent Transactions</p>
              <p className="font-semibold text-gray-900">{transactions.length} in last 5 days</p>
              <p className="text-xs text-gray-500">
                {incomeTransactions.length} income, {expenseTransactions.length} expenses
              </p>
            </div>
            {mostFrequentMerchant && (
              <div>
                <p className="text-sm text-gray-600">Most Frequent</p>
                <p className="font-semibold text-orange-600">{mostFrequentMerchant[0]}</p>
                <p className="text-xs text-gray-500">{mostFrequentMerchant[1]} transaction{mostFrequentMerchant[1] > 1 ? 's' : ''}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Largest Recent Expense</p>
              <p className="font-semibold text-red-600">
                {expenseTransactions.length > 0
                  ? `NOK ${Math.abs(largestExpense).toLocaleString()}`
                  : 'No expenses recorded'}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MoneyFlowInsights;
