import React, { useState } from 'react';
import { 
  Wallet, 
  Calendar, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CreditCard,
  PiggyBank,
  Zap,
  Target,
  ArrowRight,
  CheckCircle2,
  XCircle,
  DollarSign
} from 'lucide-react';

const CurrentPage = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7days');

  // Mock data - in real app this would come from API/hooks
  const currentBalance = 19017.50;
  const projectedBalance = -8608;
  const daysUntilPaycheck = 16;
  const todaySpending = 485.50;
  const overduePayments = 1;

  const accounts = [
    { name: 'Checking', balance: 2847.50, type: 'primary' },
    { name: 'Savings', balance: 8420.00, type: 'savings' },
    { name: 'Credit Available', balance: 8750.00, type: 'credit' }
  ];

  const urgentActions = [
    { 
      id: 1, 
      type: 'overdue', 
      title: 'Credit Card Payment Overdue', 
      amount: 1250, 
      daysOverdue: 3,
      priority: 'critical'
    },
    { 
      id: 2, 
      type: 'upcoming', 
      title: 'Rent Payment Due', 
      amount: 12000, 
      daysUntil: 5,
      priority: 'high'
    },
    { 
      id: 3, 
      type: 'budget', 
      title: 'Entertainment Budget Exceeded', 
      amount: 150, 
      category: 'Entertainment',
      priority: 'medium'
    }
  ];

  const quickInsights = [
    {
      icon: TrendingDown,
      title: 'Deficit Alert',
      message: 'You\'ll run short in 5 days',
      action: 'View cashflow',
      color: 'red'
    },
    {
      icon: Target,
      title: 'Spending Goal',
      message: 'NOK 1,200 left for the week',
      action: 'Track spending',
      color: 'blue'
    },
    {
      icon: Zap,
      title: 'Quick Win',
      message: 'Cancel unused subscriptions',
      action: 'Save NOK 300/month',
      color: 'green'
    }
  ];

  const getBalanceColor = (balance) => {
    if (balance < 0) return 'text-red-600';
    if (balance < 5000) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 border-red-300 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header with Money Status */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Your Money Right Now</h1>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <p className="text-sm text-gray-600">Available Today</p>
              <p className={`text-3xl font-bold ${getBalanceColor(currentBalance)}`}>
                NOK {currentBalance.toLocaleString()}
              </p>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <p className="text-sm text-gray-600">After Bills</p>
              <p className={`text-3xl font-bold ${getBalanceColor(projectedBalance)}`}>
                NOK {projectedBalance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Critical Actions Bar */}
        {urgentActions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                Needs Your Attention
              </h2>
              <span className="text-sm text-gray-500">{urgentActions.length} items</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {urgentActions.map((action) => (
                <div key={action.id} className={`p-4 rounded-xl border-2 ${getPriorityColor(action.priority)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm">{action.title}</h3>
                    {action.type === 'overdue' && <XCircle className="h-4 w-4 text-red-500" />}
                    {action.type === 'upcoming' && <Clock className="h-4 w-4 text-orange-500" />}
                    {action.type === 'budget' && <TrendingUp className="h-4 w-4 text-yellow-500" />}
                  </div>
                  <p className="text-lg font-bold">NOK {action.amount.toLocaleString()}</p>
                  <p className="text-xs">
                    {action.daysOverdue && `${action.daysOverdue} days overdue`}
                    {action.daysUntil && `Due in ${action.daysUntil} days`}
                    {action.category && `Over budget in ${action.category}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Account Balances */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Wallet className="h-5 w-5 text-blue-500 mr-2" />
                Your Accounts
              </h2>
              <div className="space-y-4">
                {accounts.map((account, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      {account.type === 'primary' && <CreditCard className="h-5 w-5 text-blue-500" />}
                      {account.type === 'savings' && <PiggyBank className="h-5 w-5 text-green-500" />}
                      {account.type === 'credit' && <DollarSign className="h-5 w-5 text-purple-500" />}
                      <span className="font-medium text-gray-900">{account.name}</span>
                    </div>
                    <span className={`font-bold ${getBalanceColor(account.balance)}`}>
                      NOK {account.balance.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Snapshot</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Spent Today</span>
                  <span className="font-bold text-red-600">NOK {todaySpending.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Days to Paycheck</span>
                  <span className="font-bold text-blue-600">{daysUntilPaycheck} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Overdue Items</span>
                  <span className="font-bold text-red-600">{overduePayments}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Cashflow Visualization */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Money Flow</h2>
              <select 
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1"
              >
                <option value="7days">Next 7 Days</option>
                <option value="14days">Next 2 Weeks</option>
                <option value="30days">Next Month</option>
              </select>
            </div>
            
            {/* Simple Balance Trend Visualization */}
            <div className="space-y-4">
              <div className="h-48 bg-gradient-to-b from-blue-50 to-red-50 rounded-xl p-4 flex items-end justify-between">
                {[19000, 17500, 15000, 12000, 8000, 3000, -2000].map((balance, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2">
                    <div 
                      className={`w-8 rounded-t ${balance > 0 ? 'bg-green-400' : 'bg-red-400'}`}
                      style={{ height: `${Math.abs(balance) / 200}px` }}
                    ></div>
                    <span className="text-xs text-gray-600">
                      {index === 0 ? 'Today' : `+${index}d`}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
                <p className="text-red-800 font-medium">
                  ⚠️ Balance goes negative in 6 days
                </p>
                <p className="text-red-600 text-sm">Consider moving money or delaying payments</p>
              </div>
            </div>
          </div>

          {/* Right Column - Smart Insights */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                Smart Insights
              </h2>
              <div className="space-y-4">
                {quickInsights.map((insight, index) => {
                  const Icon = insight.icon;
                  return (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="flex items-start space-x-3">
                        <Icon className={`h-5 w-5 mt-0.5 ${
                          insight.color === 'red' ? 'text-red-500' :
                          insight.color === 'blue' ? 'text-blue-500' :
                          'text-green-500'
                        }`} />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm">{insight.title}</h3>
                          <p className="text-gray-600 text-sm">{insight.message}</p>
                          <button className="text-blue-600 text-sm font-medium mt-1 flex items-center hover:text-blue-700">
                            {insight.action}
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors text-sm font-medium">
                  Add Income
                </button>
                <button className="p-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium">
                  Log Expense
                </button>
                <button className="p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors text-sm font-medium">
                  Transfer Money
                </button>
                <button className="p-3 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors text-sm font-medium">
                  Pay Bill
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { desc: 'Grocery Store', amount: -485.50, time: '2 hours ago', category: 'Food' },
              { desc: 'Salary Deposit', amount: 52000, time: '2 days ago', category: 'Income' },
              { desc: 'Netflix', amount: -159, time: '3 days ago', category: 'Entertainment' }
            ].map((transaction, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 text-sm">{transaction.desc}</span>
                  <span className={`font-bold text-sm ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount > 0 ? '+' : ''}NOK {Math.abs(transaction.amount).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{transaction.category}</span>
                  <span>{transaction.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentPage;