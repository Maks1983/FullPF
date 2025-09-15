import React from 'react';
import { useCurrentPageData } from '../hooks/useCurrentPageData';
import AvailableMoneyCard from './current/AvailableMoneyCard';
import UpcomingPaymentsCard from './current/UpcomingPaymentsCard';
import CashflowProjectionChart from './current/CashflowProjectionChart';
import SpendingCategoriesCard from './current/SpendingCategoriesCard';
import RecentTransactionsCard from './current/RecentTransactionsCard';
import MoneyFlowInsights from './current/MoneyFlowInsights';
import FinancialHealthCheck from './current/FinancialHealthCheck';
import SmartSuggestions from './current/SmartSuggestions';
import { AlertTriangle, TrendingUp, TrendingDown, Clock, Eye, Brain, Heart, Calendar } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

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

  // Calculate insights for awareness
  const totalMonthlyIncome = 52000; // This would come from data
  const totalMonthlyExpenses = spendingCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const savingsRate = ((totalMonthlyIncome - totalMonthlyExpenses) / totalMonthlyIncome) * 100;
  const biggestExpenseCategory = spendingCategories.reduce((max, cat) => 
    cat.spent > max.spent ? cat : max, spendingCategories[0]);
  const dailyAverageSpending = totalMonthlyExpenses / 30;

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header with Financial Awareness Focus */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <Eye className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Money Right Now</h1>
            <p className="text-gray-600 mt-1">
              Complete awareness of your day-to-day finances and what's happening with your money
            </p>
          </div>
        </div>
        
        {/* Comprehensive Money Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AvailableMoneyCard
            accounts={accounts}
            totalAvailable={totalAvailable}
            netLeftover={netLeftoverUntilPaycheck}
            paycheckInfo={paycheckInfo}
            upcomingPayments={upcomingPayments}
          />
          
          {/* Upcoming Payments Card */}
          <div className={`bg-gradient-to-br from-slate-700 to-slate-800 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group relative ${
            overdueCount > 0 ? 'ring-2 ring-red-400' : ''
          }`}>
            <div className="text-center">
              <div className="text-sm text-slate-300 mb-1">
                Payments until next payday
              </div>
              
              <div className="text-sm text-slate-400 mb-2">
                {upcomingPayments.filter(p => p.status !== 'paid').length} payments
              </div>
              
              {/* Circular progress indicator */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        stroke="#475569"
                        strokeWidth="2.5"
                        fill="transparent"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        stroke={overdueCount > 0 ? "#ef4444" : "#3b82f6"}
                        strokeWidth="2.5"
                        strokeDasharray={`${Math.min((upcomingPayments.filter(p => p.status !== 'paid').length / 10) * 100, 100)}, 100`}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-3xl font-bold text-white">
                        {overdueCount > 0 ? overdueCount : upcomingPayments.filter(p => p.status !== 'paid').length}
                      </div>
                      <div className="text-sm text-slate-300">
                        {overdueCount > 0 ? 'overdue' : 'pending'}
                      </div>
                      <div className="text-sm text-slate-400">
                        payments
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`text-4xl font-bold mb-3 ${
                overdueCount > 0 ? 'text-red-400' : 'text-white'
              }`}>
                NOK {upcomingPayments
                  .filter(p => p.status !== 'paid')
                  .reduce((sum, p) => sum + Math.abs(p.amount), 0)
                  .toLocaleString('no-NO', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })}
              </div>
              
              <div className="text-sm text-slate-400">
                Next due: {upcomingPayments
                  .filter(p => p.status !== 'paid')
                  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]
                  ?.dueDate ? new Date(upcomingPayments
                    .filter(p => p.status !== 'paid')
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]
                    .dueDate).toLocaleDateString() : 'None'}
              </div>
            </div>

            <div className="flex items-center justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-slate-400 mr-2">View details</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>
          </div>
          
          {/* Account Balances Card */}
          <div className={`bg-gradient-to-br from-slate-700 to-slate-800 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group relative`}>
            <div className="text-center">
              <div className="text-sm text-slate-300 mb-1">
                Total account balances
              </div>
              
              <div className="text-sm text-slate-400 mb-2">
                {accounts.length} accounts
              </div>
              
              {/* Circular progress indicator */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        stroke="#475569"
                        strokeWidth="2.5"
                        fill="transparent"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        strokeDasharray={`${Math.min((accounts.filter(acc => acc.status === 'active').length / accounts.length) * 100, 100)}, 100`}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-3xl font-bold text-white">
                        {accounts.filter(acc => acc.status === 'active').length}
                      </div>
                      <div className="text-sm text-slate-300">
                        active
                      </div>
                      <div className="text-sm text-slate-400">
                        accounts
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-4xl font-bold mb-3 text-white">
                NOK {accounts
                  .reduce((sum, acc) => sum + (acc.type === 'credit' ? acc.availableBalance : acc.balance), 0)
                  .toLocaleString('no-NO', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })}
              </div>
              
              <div className="text-sm text-slate-400">
                {accounts.filter(acc => acc.type !== 'credit').length} deposit • {accounts.filter(acc => acc.type === 'credit').length} credit
              </div>
            </div>

            <div className="flex items-center justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-slate-400 mr-2">View details</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alerts Banner - Enhanced */}
      {criticalAlerts > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg shadow-sm">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-400 mr-3 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-red-800 mb-2">
                🚨 {criticalAlerts} Critical Alert{criticalAlerts > 1 ? 's' : ''} Need Your Attention
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-red-700">
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

      {/* Financial Health Check - New Component */}
      <FinancialHealthCheck 
        totalAvailable={totalAvailable}
        netLeftover={netLeftoverUntilPaycheck}
        savingsRate={savingsRate}
        overdueCount={overdueCount}
        biggestExpense={biggestExpenseCategory}
        daysUntilPaycheck={paycheckInfo.daysUntilPaycheck}
      />

      {/* Money Flow Insights - New Component */}
      <MoneyFlowInsights 
        monthlyIncome={totalMonthlyIncome}
        monthlyExpenses={totalMonthlyExpenses}
        spendingCategories={spendingCategories}
        todaySpending={todaySpending}
        recentTransactions={recentTransactions}
      />

      {/* Main Money Available Card - Top Position */}
      {/* Main Content Grid - Enhanced Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Money Status */}
        <div className="xl:col-span-2 space-y-6">
          {/* Additional summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          </div>
          {/* Cashflow Projection - Full Width */}
          <CashflowProjectionChart
            projections={cashflowProjections}
            daysUntilDeficit={daysUntilDeficit}
          />
        </div>

        {/* Right Column - Payments & Spending */}
        <div className="space-y-6">
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
      </div>

      {/* Smart Suggestions - New Component */}
      <SmartSuggestions 
        netLeftover={netLeftoverUntilPaycheck}
        savingsRate={savingsRate}
        spendingCategories={spendingCategories}
        overdueCount={overdueCount}
        daysUntilPaycheck={paycheckInfo.daysUntilPaycheck}
      />

      {/* Recent Transactions - Enhanced */}
      <RecentTransactionsCard transactions={recentTransactions} />

      {/* Financial Awareness Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-6 w-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Your Money Story This Month</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              NOK {totalMonthlyIncome.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Money Coming In</p>
            <p className="text-xs text-gray-500 mt-1">Your total income this month</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              NOK {totalMonthlyExpenses.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Money Going Out</p>
            <p className="text-xs text-gray-500 mt-1">Your total expenses this month</p>
          </div>
          
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${
              totalMonthlyIncome - totalMonthlyExpenses > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              NOK {(totalMonthlyIncome - totalMonthlyExpenses).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Net Result</p>
            <p className="text-xs text-gray-500 mt-1">
              {totalMonthlyIncome - totalMonthlyExpenses > 0 ? 'Money saved' : 'Overspent'} this month
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">💡 Key Insights About Your Money</h4>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Your biggest expense category is <strong>{biggestExpenseCategory?.name}</strong> at NOK {biggestExpenseCategory?.spent.toLocaleString()}</li>
            <li>• You're saving <strong>{savingsRate.toFixed(1)}%</strong> of your income {savingsRate >= 20 ? '(Excellent!)' : savingsRate >= 10 ? '(Good)' : '(Could improve)'}</li>
            <li>• You have <strong>{paycheckInfo.daysUntilPaycheck} days</strong> until your next paycheck</li>
            <li>• Your money will {netLeftoverUntilPaycheck >= 0 ? 'last until payday' : 'run short before payday'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CurrentPage;