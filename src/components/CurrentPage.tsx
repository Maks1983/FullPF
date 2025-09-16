import React from 'react';
import { useCurrentPageData } from '../hooks/useCurrentPageData';
import { AlertTriangle, Calendar, Clock, Plus, ArrowRight, TrendingUp, Eye, Zap } from 'lucide-react';

// Import existing components we'll reuse
import RecentTransactionsCard from './current/RecentTransactionsCard';
import UpcomingPaymentsModal from './current/UpcomingPaymentsModal';
import AccountBalanceModal from './current/AccountBalanceModal';

const CurrentPage = () => {
  const [isPaymentsModalOpen, setIsPaymentsModalOpen] = React.useState(false);
  const [isAccountBalanceModalOpen, setIsAccountBalanceModalOpen] = React.useState(false);
  
  const {
    accounts,
    upcomingPayments,
    recentTransactions,
    paycheckInfo,
    spendingCategories,
    totalAvailable,
    netLeftoverUntilPaycheck,
    overdueCount,
    todaySpending,
    criticalAlerts,
    isDeficitProjected,
    daysUntilDeficit
  } = useCurrentPageData();

  // Calculate key metrics
  const nextThreePayments = upcomingPayments
    .filter(p => p.status !== 'paid')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const overduePayments = upcomingPayments.filter(p => p.status === 'overdue');
  const overdueTotal = overduePayments.reduce((sum, p) => sum + Math.abs(p.amount), 0);

  const isSafeUntilPayday = netLeftoverUntilPaycheck >= 0;
  const last7DaysSpending = [1250, 890, 1450, 2100, 750, 1680, todaySpending]; // Mock data

  // Top 3 spending categories
  const topCategories = spendingCategories
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 3);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center space-x-3 mb-2">
          <Eye className="h-7 w-7 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Current Accounts</h1>
        </div>
        <p className="text-gray-600">
          Your day-to-day money situation right now
        </p>
      </div>

      {/* Top Row: Key Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Balance - Primary Card */}
        <div 
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer"
          onClick={() => setIsAccountBalanceModalOpen(true)}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Available Balance</h3>
              <div className="text-3xl font-bold text-gray-900">
                NOK {totalAvailable.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                as of today, across {accounts.length} accounts
              </p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                isSafeUntilPayday 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isSafeUntilPayday ? '✅ Safe until payday' : '❌ At risk'}
              </div>
            </div>
          </div>
          
          {/* Visual gauge */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Money health</span>
              <span>{isSafeUntilPayday ? 'Good' : 'Needs attention'}</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  isSafeUntilPayday ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.max(20, Math.min(100, (totalAvailable / 50000) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Left Until Payday */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Left Until Payday</h3>
              <div className={`text-3xl font-bold mb-1 ${
                netLeftoverUntilPaycheck >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {netLeftoverUntilPaycheck >= 0 ? '+' : ''}NOK {netLeftoverUntilPaycheck.toLocaleString()}
              </div>
              <div className={`text-sm font-medium ${
                isSafeUntilPayday ? 'text-green-600' : 'text-red-600'
              }`}>
                {isSafeUntilPayday 
                  ? '✅ Money lasts until payday' 
                  : `❌ Shortfall in ${daysUntilDeficit} days`
                }
              </div>
            </div>
            
            {/* Countdown donut */}
            <div className="relative">
              <div className="w-16 h-16">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                    fill="transparent"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    stroke={isSafeUntilPayday ? "#10b981" : "#ef4444"}
                    strokeWidth="3"
                    strokeDasharray={`${((30 - paycheckInfo.daysUntilPaycheck) / 30) * 100}, 100`}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-lg font-bold text-gray-900">
                    {paycheckInfo.daysUntilPaycheck}
                  </div>
                  <div className="text-xs text-gray-500">days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Payments & Overdue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Payments - 2/3 width */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Payments</h3>
            <button 
              onClick={() => setIsPaymentsModalOpen(true)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="space-y-3">
            {nextThreePayments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming payments</p>
            ) : (
              nextThreePayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{payment.description}</p>
                      <p className="text-sm text-gray-600">
                        Due: {new Date(payment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      NOK {Math.abs(payment.amount).toLocaleString()}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      payment.priority === 'high' ? 'bg-red-100 text-red-800' :
                      payment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {payment.priority}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Overdue Items - 1/3 width */}
        <div className={`bg-white p-6 rounded-xl shadow-sm border transition-all ${
          overdueCount > 0 ? 'border-red-200 bg-red-50' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className={`h-5 w-5 ${overdueCount > 0 ? 'text-red-600' : 'text-gray-400'}`} />
            <h3 className="text-lg font-semibold text-gray-900">Overdue Items</h3>
          </div>
          
          {overdueCount > 0 ? (
            <div 
              className="cursor-pointer hover:bg-red-100 p-3 rounded-lg transition-colors"
              onClick={() => setIsPaymentsModalOpen(true)}
            >
              <div className="text-2xl font-bold text-red-600 mb-1">
                {overdueCount}
              </div>
              <p className="text-sm text-red-700 mb-2">
                overdue bill{overdueCount > 1 ? 's' : ''}
              </p>
              <p className="text-lg font-semibold text-red-800">
                NOK {overdueTotal.toLocaleString()}
              </p>
              <p className="text-xs text-red-600 mt-2 flex items-center">
                Click to view <ArrowRight className="h-3 w-3 ml-1" />
              </p>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-2xl font-bold text-green-600 mb-1">✅</div>
              <p className="text-sm text-gray-600">No overdue bills</p>
              <p className="text-xs text-gray-500 mt-1">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions - Full Width */}
      <RecentTransactionsCard transactions={recentTransactions} />

      {/* Secondary Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Spending Awareness */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Daily Spending</h3>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          
          <div className="mb-4">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              NOK {todaySpending.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">spent today</p>
          </div>
          
          {/* Mini sparkline */}
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">Last 7 days</p>
            <div className="flex items-end space-x-1 h-8">
              {last7DaysSpending.map((amount, index) => (
                <div
                  key={index}
                  className="bg-blue-200 rounded-sm flex-1"
                  style={{ 
                    height: `${(amount / Math.max(...last7DaysSpending)) * 100}%`,
                    backgroundColor: index === last7DaysSpending.length - 1 ? '#3b82f6' : '#bfdbfe'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Categories</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View all
            </button>
          </div>
          
          <div className="space-y-3">
            {topCategories.map((category, index) => {
              const totalSpent = spendingCategories.reduce((sum, cat) => sum + cat.spent, 0);
              const percentage = (category.spent / totalSpent) * 100;
              
              return (
                <div key={category.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-900">{category.name}</span>
                    <span className="text-gray-600">{percentage.toFixed(0)}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: category.color
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    NOK {category.spent.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Premium Zone */}
      <div className="space-y-6">
        {/* Smart Suggestions - Premium unlock */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Zap className="h-6 w-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Smart Suggestions</h3>
              <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
                PREMIUM
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 opacity-75">
              <h4 className="font-medium text-gray-900 mb-2">💰 Optimize Spending</h4>
              <p className="text-sm text-gray-600">
                Shift NOK 2,000 from Checking → Savings to avoid overspending
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 opacity-75">
              <h4 className="font-medium text-gray-900 mb-2">📊 Savings Insight</h4>
              <p className="text-sm text-gray-600">
                You're on track to save 12% this month - great progress!
              </p>
            </div>
          </div>
          
          <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
            Unlock Smart Suggestions
          </button>
        </div>

        {/* Cashflow Projection - Premium depth */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">7-Day Cashflow Projection</h3>
            <span className="text-sm text-gray-600">Free preview</span>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-4">
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() + i);
              const isDeficitDay = i >= daysUntilDeficit && !isSafeUntilPayday;
              
              return (
                <div key={i} className="text-center">
                  <div className="text-xs text-gray-500 mb-1">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className={`w-full h-8 rounded flex items-center justify-center text-xs font-medium ${
                    isDeficitDay ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {isDeficitDay ? 'Risk' : 'Safe'}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Premium blur overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 right-6 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Premium: 30-day projections + what-if scenarios
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Upgrade for Full Projections
            </button>
          </div>
        </div>

        {/* Monthly Money Story - Premium narrative */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 relative">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Your Money Story</h3>
              <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                PREMIUM
              </span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 opacity-75">
            <p className="text-gray-700 leading-relaxed">
              "This month, you earned NOK 52,000, spent NOK 47,200, and saved 9%. 
              Your biggest expense was Groceries at NOK 8,500. You're on track until payday 
              and building good financial habits."
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              Premium: Personalized insights + historical comparisons
            </p>
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              Get Your Full Money Story
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <UpcomingPaymentsModal
        isOpen={isPaymentsModalOpen}
        onClose={() => setIsPaymentsModalOpen(false)}
        payments={upcomingPayments}
        overdueCount={overdueCount}
      />

      <AccountBalanceModal
        isOpen={isAccountBalanceModalOpen}
        onClose={() => setIsAccountBalanceModalOpen(false)}
        accounts={accounts}
      />
    </div>
  );
};

export default CurrentPage;