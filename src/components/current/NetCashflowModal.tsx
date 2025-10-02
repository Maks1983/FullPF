import React from 'react';
import { X, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import type { SpendingCategory, RecentTransaction } from '../../types/current';

interface NetCashflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthlyIncome: number;
  monthlyExpenses: number;
  spendingCategories: SpendingCategory[];
  recentTransactions: RecentTransaction[];
}

const NetCashflowModal: React.FC<NetCashflowModalProps> = ({
  isOpen,
  onClose,
  monthlyIncome,
  monthlyExpenses,
  spendingCategories,
  recentTransactions
}) => {
  const titleId = React.useId();
  if (!isOpen) return null;

  const netCashflow = monthlyIncome - monthlyExpenses;
  const isPositive = netCashflow >= 0;
  const cashflowPercentage = Math.abs(netCashflow / monthlyIncome) * 100;
  
  // Calculate daily rates
  const dailyIncome = monthlyIncome / 30;
  const dailyExpenses = monthlyExpenses / 30;
  const dailyNet = dailyIncome - dailyExpenses;
  
  // Calculate recent flow (last 7 days)
  const recentIncome = recentTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const recentExpenses = Math.abs(recentTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0));
  const recentNet = recentIncome - recentExpenses;

  // Top expense categories for flow analysis
  const topExpenseCategories = spendingCategories
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
              {isPositive ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div>
              <h2 id={titleId} className="text-xl font-bold text-gray-900">Net Cashflow Analysis</h2>
              <p className="text-sm text-gray-600">
                {isPositive ? 'Positive' : 'Negative'} flow: NOK {Math.abs(netCashflow).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Cashflow Overview */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                NOK {monthlyIncome.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Monthly Income</p>
              <p className="text-xs text-gray-500">NOK {dailyIncome.toFixed(0)}/day</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                NOK {monthlyExpenses.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Monthly Expenses</p>
              <p className="text-xs text-gray-500">NOK {dailyExpenses.toFixed(0)}/day</p>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}NOK {netCashflow.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Net Cashflow</p>
              <p className="text-xs text-gray-500">
                {cashflowPercentage.toFixed(1)}% of income
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Money Flow Velocity */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <Activity className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900">Flow Velocity</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Daily Income Rate</span>
                  </div>
                  <span className="font-semibold text-green-600">NOK {dailyIncome.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-gray-600">Daily Burn Rate</span>
                  </div>
                  <span className="font-semibold text-red-600">NOK {dailyExpenses.toFixed(0)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Daily Net Flow</span>
                    <span className={`font-bold ${dailyNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {dailyNet >= 0 ? '+' : ''}NOK {dailyNet.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Flow (Last 7 Days) */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <h4 className="font-semibold text-gray-900">Recent Flow (7 Days)</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Money In</span>
                  <span className="font-semibold text-green-600">+NOK {recentIncome.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Money Out</span>
                  <span className="font-semibold text-red-600">-NOK {recentExpenses.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Recent Net</span>
                    <span className={`font-bold ${recentNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {recentNet >= 0 ? '+' : ''}NOK {recentNet.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Expense Flows */}
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-4">Top Money Outflows</h4>
            <div className="space-y-3">
              {topExpenseCategories.map((category, index) => {
                const dailyAmount = category.spent / 30;
                const flowPercentage = (category.spent / monthlyExpenses) * 100;
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <div>
                        <span className="font-medium text-gray-900">{category.name}</span>
                        <p className="text-xs text-gray-500">NOK {dailyAmount.toFixed(0)}/day</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900">
                        NOK {category.spent.toLocaleString()}
                      </span>
                      <p className="text-xs text-gray-500">{flowPercentage.toFixed(1)}% of expenses</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Flow Insights */}
          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
            <h4 className="font-semibold text-gray-900 mb-3">💡 Cashflow Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-900 mb-1">Flow Health</p>
                <p className="text-gray-700">
                  {isPositive 
                    ? `Strong positive flow - you're building wealth at NOK ${Math.abs(netCashflow).toLocaleString()}/month`
                    : `Negative flow - you're spending NOK ${Math.abs(netCashflow).toLocaleString()} more than earning`
                  }
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Flow Efficiency</p>
                <p className="text-gray-700">
                  {cashflowPercentage >= 20 
                    ? 'Excellent - high savings rate'
                    : cashflowPercentage >= 10 
                    ? 'Good - healthy savings rate'
                    : 'Room for improvement in expense management'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {isPositive ? 'Building wealth' : 'Spending more than earning'}
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
              Export Analysis
            </button>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetCashflowModal;



