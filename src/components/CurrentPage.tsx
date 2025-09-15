import React, { useState } from 'react';
import { useCurrentPageData } from '../hooks/useCurrentPageData';
import AvailableMoneyCard from './current/AvailableMoneyCard';
import UpcomingPaymentsCard from './current/UpcomingPaymentsCard';
import CashflowProjectionChart from './current/CashflowProjectionChart';
import SpendingCategoriesCard from './current/SpendingCategoriesCard';
import RecentTransactionsCard from './current/RecentTransactionsCard';
import SmartSuggestions from './current/SmartSuggestions';
import { AlertTriangle, TrendingUp, TrendingDown, Clock, Eye, ChevronDown, ChevronUp } from 'lucide-react';

const CurrentPage = () => {
  const [showInsights, setShowInsights] = useState(false);
  
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

  // Calculate insights for awareness
  const totalMonthlyIncome = 52000;
  const totalMonthlyExpenses = spendingCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const savingsRate = ((totalMonthlyIncome - totalMonthlyExpenses) / totalMonthlyIncome) * 100;
  
  // Get top 3 spending categories or overspending ones
  const priorityCategories = spendingCategories
    .filter(cat => cat.isOverBudget)
    .concat(
      spendingCategories
        .filter(cat => !cat.isOverBudget)
        .sort((a, b) => b.spent - a.spent)
    )
    .slice(0, 3);

  // Get next 5 priority payments
  const priorityPayments = upcomingPayments
    .filter(payment => payment.status !== 'paid')
    .sort((a, b) => {
      // Sort overdue first, then by priority, then by due date
      if (a.status === 'overdue' && b.status !== 'overdue') return -1;
      if (b.status === 'overdue' && a.status !== 'overdue') return 1;
      
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 5);

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <Eye className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Money Right Now</h1>
            <p className="text-gray-600 mt-1">
              Financial position until your next paycheck
            </p>
          </div>
        </div>
      </div>

      {/* Snapshot Cards - 4 Essential Items */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Money Available */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Money Available</span>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">NOK {totalAvailable.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Ready to use right now</p>
        </div>

        {/* Projected Balance After Bills */}
        <div className={`bg-white p-6 rounded-xl shadow-sm border ${
          netLeftoverUntilPaycheck < 0 ? 'border-red-200 bg-red-50' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">After Expected Bills</span>
            {netLeftoverUntilPaycheck < 0 ? (
              <TrendingDown className="h-4 w-4 text-red-600" />
            ) : (
              <TrendingUp className="h-4 w-4 text-green-600" />
            )}
          </div>
          <p className={`text-2xl font-bold ${netLeftoverUntilPaycheck >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            NOK {netLeftoverUntilPaycheck.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Projected balance until payday</p>
        </div>

        {/* Next Paycheck */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Next Paycheck</span>
            <Clock className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-600">{paycheckInfo.daysUntilPaycheck} days</p>
          <p className="text-xs text-gray-500">NOK {paycheckInfo.expectedAmount.toLocaleString()} expected</p>
        </div>

        {/* Critical Alerts */}
        <div className={`bg-white p-6 rounded-xl shadow-sm border ${
          criticalAlerts > 0 ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Critical Alerts</span>
            {criticalAlerts > 0 ? (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            ) : (
              <div className="h-4 w-4 bg-green-500 rounded-full" />
            )}
          </div>
          <p className={`text-2xl font-bold ${criticalAlerts > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {criticalAlerts > 0 ? criticalAlerts : '✓'}
          </p>
          <p className="text-xs text-gray-500">
            {criticalAlerts > 0 ? 'Issues need attention' : 'All good'}
          </p>
        </div>
      </div>

      {/* Critical Alerts Details - Only show if there are alerts */}
      {criticalAlerts > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-red-800 mb-2">
                🚨 {criticalAlerts} Critical Alert{criticalAlerts > 1 ? 's' : ''} Need Your Attention
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-red-700">
                {overdueCount > 0 && (
                  <div className="bg-red-100 p-3 rounded">
                    <p className="font-medium">💳 Overdue Payments</p>
                    <p>{overdueCount} payment{overdueCount > 1 ? 's' : ''} past due</p>
                  </div>
                )}
                {isDeficitProjected && (
                  <div className="bg-red-100 p-3 rounded">
                    <p className="font-medium">📉 Money Running Low</p>
                    <p>Deficit projected in {daysUntilDeficit} days</p>
                  </div>
                )}
                {highPriorityPayments > 0 && (
                  <div className="bg-red-100 p-3 rounded">
                    <p className="font-medium">⚡ Urgent Bills</p>
                    <p>{highPriorityPayments} high-priority payment{highPriorityPayments > 1 ? 's' : ''} due soon</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Cashflow Projection Chart - Clean Visual */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">7-Day Money Flow</h3>
              {isDeficitProjected && (
                <span className="text-sm text-red-600 font-medium">
                  ⚠️ Deficit in {daysUntilDeficit} days
                </span>
              )}
            </div>
            <CashflowProjectionChart
              projections={cashflowProjections}
              daysUntilDeficit={daysUntilDeficit}
            />
          </div>

          {/* Recent Transactions - Top 5 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <span className="text-sm text-gray-500">Last 5 transactions</span>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentTransactions.slice(0, 5).map((transaction) => {
                const isIncome = transaction.amount > 0;
                return (
                  <div key={transaction.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{transaction.category}</span>
                          {transaction.merchant && <span>• {transaction.merchant}</span>}
                          <span>• {new Date(transaction.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className={`font-bold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                        {isIncome ? '+' : '-'}NOK {Math.abs(transaction.amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Payments - Next 5 Priority */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Payments</h3>
                <span className="text-sm text-gray-500">Next {priorityPayments.length} priority</span>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {priorityPayments.map((payment) => {
                const daysUntilDue = Math.ceil((new Date(payment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={payment.id} className={`p-4 ${payment.status === 'overdue' ? 'bg-red-50' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{payment.description}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            payment.priority === 'high' ? 'bg-red-100 text-red-800' :
                            payment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {payment.priority}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {payment.status === 'overdue' ? (
                            <span className="text-red-600 font-medium">
                              {payment.daysOverdue} days overdue
                            </span>
                          ) : (
                            <span className={
                              daysUntilDue <= 3 ? 'text-red-600 font-medium' : 
                              daysUntilDue <= 7 ? 'text-yellow-600' : 'text-gray-600'
                            }>
                              {daysUntilDue > 0 ? `Due in ${daysUntilDue} days` : 'Due today'}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">
                        NOK {Math.abs(payment.amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spending Categories - Top 3 or Overspending */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Spending Watch</h3>
                <span className="text-sm text-gray-500">Priority categories</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {priorityCategories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium text-gray-900">{category.name}</span>
                      {category.isOverBudget && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`font-semibold ${category.isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
                        NOK {category.spent.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-600 ml-1">
                        / {category.budget.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        category.isOverBudget ? 'bg-red-500' :
                        category.percentUsed > 80 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(category.percentUsed, 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className={`${category.isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
                      {category.isOverBudget ? 
                        `Over by NOK ${Math.abs(category.remaining).toLocaleString()}` :
                        `NOK ${category.remaining.toLocaleString()} remaining`
                      }
                    </span>
                    <span className="text-gray-500">
                      {category.percentUsed.toFixed(1)}% used
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Insights & Suggestions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <button
          onClick={() => setShowInsights(!showInsights)}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">Smart Insights & Suggestions</h3>
              <p className="text-sm text-gray-600">Personalized tips to improve your finances</p>
            </div>
          </div>
          {showInsights ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>
        
        {showInsights && (
          <div className="border-t border-gray-200 p-6">
            <SmartSuggestions 
              netLeftover={netLeftoverUntilPaycheck}
              savingsRate={savingsRate}
              spendingCategories={spendingCategories}
              overdueCount={overdueCount}
              daysUntilPaycheck={paycheckInfo.daysUntilPaycheck}
            />
            
            {/* Key Metrics Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">📊 Your Financial Snapshot</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{savingsRate.toFixed(1)}%</p>
                  <p className="text-gray-600">Savings Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {spendingCategories.reduce((max, cat) => cat.spent > max.spent ? cat : max, spendingCategories[0])?.name}
                  </p>
                  <p className="text-gray-600">Biggest Expense</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">NOK {todaySpending.toLocaleString()}</p>
                  <p className="text-gray-600">Today's Spending</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentPage;