import React from 'react';
import { useCurrentData } from '../hooks/useCurrentData';
import AccountBalanceCard from '../components/current/AccountBalanceCard';
import PaydayCountdown from '../components/current/PaydayCountdown';
import BudgetProgressCard from '../components/current/BudgetProgressCard';
import CashflowChart from '../components/current/CashflowChart';
import UpcomingTransactionsList from '../components/current/UpcomingTransactionsList';
import { Wallet, TrendingUp, AlertTriangle, Target } from 'lucide-react';

const CurrentPage = () => {
  const { balances, transactions, budgets, projections, payday, metrics } = useCurrentData();

  const quickStats = [
    {
      title: 'Total Liquid',
      value: `NOK ${metrics.totalLiquid.toLocaleString()}`,
      change: '+2.4%',
      trend: 'up' as const,
      icon: Wallet,
      color: 'blue' as const
    },
    {
      title: 'Net Worth',
      value: `NOK ${metrics.netWorth.toLocaleString()}`,
      change: '+1.8%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'green' as const
    },
    {
      title: 'Budget Health',
      value: `${metrics.budgetHealth}%`,
      change: metrics.budgetHealth >= 80 ? '+5%' : '-3%',
      trend: metrics.budgetHealth >= 80 ? 'up' as const : 'down' as const,
      icon: Target,
      color: metrics.budgetHealth >= 80 ? 'green' as const : 'red' as const
    },
    {
      title: 'Upcoming Expenses',
      value: `NOK ${metrics.upcomingExpenses.toLocaleString()}`,
      change: '-8.2%',
      trend: 'down' as const,
      icon: AlertTriangle,
      color: 'orange' as const
    }
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Current Financial Position</h1>
        <p className="text-gray-600 mt-1">Real-time view of your cash flow and upcoming obligations</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                <div className={`p-2 rounded-lg ${
                  stat.color === 'blue' ? 'bg-blue-50' :
                  stat.color === 'green' ? 'bg-green-50' :
                  stat.color === 'red' ? 'bg-red-50' : 'bg-orange-50'
                }`}>
                  <Icon className={`h-5 w-5 ${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'red' ? 'text-red-600' : 'text-orange-600'
                  }`} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} vs last month
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Account Balances & Payday Countdown */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Account Balance Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {balances.map((account, index) => (
            <AccountBalanceCard key={index} account={account} />
          ))}
        </div>
        
        {/* Payday Countdown */}
        <div className="lg:col-span-1">
          <PaydayCountdown 
            payday={payday} 
            projectedBalance={metrics.projectedBalance}
          />
        </div>
      </div>

      {/* Cashflow Projection */}
      <CashflowChart data={projections} />

      {/* Budget Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Budget Progress</h3>
          <p className="text-gray-600">Track your spending across categories</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {budgets.map((category, index) => (
              <BudgetProgressCard key={index} category={category} />
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Transactions */}
      <UpcomingTransactionsList transactions={transactions} />

      {/* Financial Health Alerts */}
      {(metrics.overdueAmount > 0 || metrics.projectedBalance < 0) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-red-900">Financial Health Alerts</h3>
          </div>
          <div className="space-y-3">
            {metrics.overdueAmount > 0 && (
              <div className="flex items-center justify-between p-3 bg-white rounded border border-red-200">
                <span className="text-red-900">Overdue payments require immediate attention</span>
                <span className="font-bold text-red-600">NOK {metrics.overdueAmount.toLocaleString()}</span>
              </div>
            )}
            {metrics.projectedBalance < 0 && (
              <div className="flex items-center justify-between p-3 bg-white rounded border border-red-200">
                <span className="text-red-900">Projected deficit before next payday</span>
                <span className="font-bold text-red-600">NOK {Math.abs(metrics.projectedBalance).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentPage;