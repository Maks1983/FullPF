import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, PieChart, Calendar, Star, Lock } from 'lucide-react';
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
  // Calculate insights
  const netFlow = monthlyIncome - monthlyExpenses;
  const dailyAverageSpending = monthlyExpenses / 30;
  const isSpendingHighToday = todaySpending > dailyAverageSpending * 1.5;
  
  // Find spending patterns
  const topSpendingCategory = spendingCategories.reduce((max, cat) => 
    cat.spent > max.spent ? cat : max, spendingCategories[0]);
  
  const overBudgetCategories = spendingCategories.filter(cat => cat.isOverBudget);
  
  // Recent transaction insights
  const recentExpenses = recentTransactions.filter(t => t.amount < 0);
  const recentIncome = recentTransactions.filter(t => t.amount > 0);
  const frequentMerchants = recentExpenses.reduce((acc, t) => {
    if (t.merchant) {
      acc[t.merchant] = (acc[t.merchant] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const mostFrequentMerchant = Object.entries(frequentMerchants)
    .sort(([,a], [,b]) => b - a)[0];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <TrendingUp className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Money Flow Insights</h3>
        <span className="text-sm text-gray-500">Understanding where your money goes</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expenses Flow */}
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
          </div>
        </div>

        {/* Spending Patterns */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <PieChart className="h-4 w-4 mr-2 text-purple-600" />
            Spending Patterns
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Biggest Category</p>
              <p className="font-semibold text-purple-600">{topSpendingCategory?.name}</p>
              <p className="text-xs text-gray-500">NOK {topSpendingCategory?.spent.toLocaleString()} spent</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Daily Average</p>
              <p className="font-semibold text-gray-900">NOK {dailyAverageSpending.toFixed(0)}</p>
              <p className={`text-xs ${isSpendingHighToday ? 'text-red-500' : 'text-green-500'}`}>
                Today: NOK {todaySpending.toLocaleString()} 
                {isSpendingHighToday ? ' (Above average)' : ' (Normal)'}
              </p>
            </div>
            {overBudgetCategories.length > 0 && (
              <div>
                <p className="text-sm text-red-600 font-medium">Over Budget</p>
                <p className="text-xs text-red-500">
                  {overBudgetCategories.length} categor{overBudgetCategories.length > 1 ? 'ies' : 'y'} over limit
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Insights */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-orange-600" />
            Recent Activity
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Recent Transactions</p>
              <p className="font-semibold text-gray-900">{recentTransactions.length} in last 5 days</p>
              <p className="text-xs text-gray-500">
                {recentIncome.length} income, {recentExpenses.length} expenses
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
                NOK {Math.abs(Math.min(...recentExpenses.map(t => t.amount))).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MoneyFlowInsights;