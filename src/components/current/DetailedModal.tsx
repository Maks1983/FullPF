import React from 'react';
import { X, ArrowUpRight, ArrowDownRight, Calendar, AlertTriangle, CheckCircle, Clock, CreditCard, Wallet, TrendingDown, TrendingUp, Target, DollarSign, Zap, Bell, PiggyBank } from 'lucide-react';
import type { CurrentAccount, UpcomingPayment, SpendingCategory } from '../../types/current';

interface DetailedModalProps {
  isOpen: boolean;
  onClose: () => void;
  upcomingPayments: UpcomingPayment[];
  spendingCategories: SpendingCategory[];
  monthlyIncome: number;
  monthlyExpenses: number;
}

const DetailedModal: React.FC<DetailedModalProps> = ({
  isOpen,
  onClose,
  upcomingPayments,
  spendingCategories,
  monthlyIncome,
  monthlyExpenses
}) => {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'categories' | 'projections'>('overview');
  const [showInsights, setShowInsights] = React.useState(true);

  if (!isOpen) return null;

  const netFlow = monthlyIncome - monthlyExpenses;
  const totalUpcoming = upcomingPayments.filter(p => p.status !== 'paid').reduce((sum, p) => sum + Math.abs(p.amount), 0);
  const netAvailable = 19017.50; // This would come from props
  const overduePayments = upcomingPayments.filter(p => p.status === 'overdue');
  const overBudgetCategories = spendingCategories.filter(cat => cat.isOverBudget);
  
  // Calculate daily burn rate and projections
  const dailyBurnRate = monthlyExpenses / 30;
  const daysUntilEmpty = netAvailable / dailyBurnRate;
  const nextPaycheckDays = 16; // This would come from props
  const isProjectedShortfall = daysUntilEmpty < nextPaycheckDays;

  // Sort payments by due date and priority
  const sortedPayments = [...upcomingPayments]
    .filter(p => p.status !== 'paid')
    .sort((a, b) => {
      if (a.status === 'overdue' && b.status !== 'overdue') return -1;
      if (b.status === 'overdue' && a.status !== 'overdue') return 1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  // Generate dynamic insights
  const generateInsights = () => {
    const insights = [];
    
    if (overduePayments.length > 0) {
      insights.push({
        type: 'urgent',
        icon: AlertTriangle,
        title: `${overduePayments.length} Overdue Payment${overduePayments.length > 1 ? 's' : ''}`,
        message: `Pay immediately to avoid late fees and credit damage`,
        action: 'Pay Now',
        color: 'red'
      });
    }
    
    if (isProjectedShortfall) {
      insights.push({
        type: 'warning',
        icon: TrendingDown,
        title: 'Money Runs Out Early',
        message: `At current spending rate, funds depleted in ${Math.floor(daysUntilEmpty)} days (${nextPaycheckDays - Math.floor(daysUntilEmpty)} days before payday)`,
        action: 'Reduce Spending',
        color: 'red'
      });
    }
    
    if (overBudgetCategories.length > 0) {
      const worstCategory = overBudgetCategories.reduce((worst, cat) => 
        Math.abs(cat.remaining) > Math.abs(worst.remaining) ? cat : worst
      );
      insights.push({
        type: 'improvement',
        icon: Target,
        title: `${worstCategory.name} Over Budget`,
        message: `Cut NOK ${Math.abs(worstCategory.remaining).toLocaleString()} to get back on track`,
        action: 'Adjust Budget',
        color: 'yellow'
      });
    }
    
    if (netFlow > 0 && !isProjectedShortfall) {
      insights.push({
        type: 'opportunity',
        icon: PiggyBank,
        title: 'Surplus Available',
        message: `You could save NOK ${Math.floor(netFlow * 0.8).toLocaleString()} this month`,
        action: 'Auto-Save',
        color: 'green'
      });
    }
    
    return insights.slice(0, 3); // Show top 3 insights
  };

  const insights = generateInsights();

  const getPaymentIcon = (category: string) => {
    const icons = {
      'Housing': '🏠',
      'Utilities': '⚡',
      'Debt': '💳',
      'Insurance': '🛡️',
      'Entertainment': '🎬',
      'Transportation': '🚗'
    };
    return icons[category] || '💰';
  };

  const getInsightColor = (color: string) => {
    const colors = {
      red: 'bg-red-50 border-red-200 text-red-800',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      blue: 'bg-blue-50 border-blue-200 text-blue-800'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Hero Section - Always Visible */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Financial Overview</h2>
                <p className="text-sm text-gray-600">Complete picture of your money situation</p>
              </div>
              
              {/* Hero Numbers */}
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${netAvailable >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    NOK {netAvailable.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Net Available</p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {nextPaycheckDays} days
                  </div>
                  <p className="text-sm text-gray-600">Until Payday</p>
                </div>
                
                <div className="text-center">
                  <div className={`text-2xl font-bold ${isProjectedShortfall ? 'text-red-600' : 'text-green-600'}`}>
                    {Math.floor(daysUntilEmpty)} days
                  </div>
                  <p className="text-sm text-gray-600">Money Lasts</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Critical Alerts */}
        {(overduePayments.length > 0 || isProjectedShortfall) && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <div className="flex items-center space-x-2 text-red-600 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Critical Issues Need Attention</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {overduePayments.length > 0 && (
                <div className="bg-red-100 p-3 rounded">
                  <p className="font-medium text-red-800">{overduePayments.length} Overdue Payment{overduePayments.length > 1 ? 's' : ''}</p>
                  <p className="text-red-700">Total: NOK {overduePayments.reduce((sum, p) => sum + Math.abs(p.amount), 0).toLocaleString()}</p>
                </div>
              )}
              {isProjectedShortfall && (
                <div className="bg-red-100 p-3 rounded">
                  <p className="font-medium text-red-800">Projected Shortfall</p>
                  <p className="text-red-700">{nextPaycheckDays - Math.floor(daysUntilEmpty)} days short before payday</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actionable Insights */}
        {showInsights && insights.length > 0 && (
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <h3 className="font-semibold text-gray-900">Smart Recommendations</h3>
              </div>
              <button 
                onClick={() => setShowInsights(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Hide
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <div key={index} className={`p-4 rounded-lg border ${getInsightColor(insight.color)}`}>
                    <div className="flex items-start space-x-3">
                      <Icon className="h-5 w-5 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{insight.title}</h4>
                        <p className="text-sm mb-3">{insight.message}</p>
                        <button className="text-sm font-medium hover:underline">
                          {insight.action} →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {[
              { key: 'overview', label: 'Income & Payments', icon: Wallet },
              { key: 'categories', label: 'Spending Categories', icon: CreditCard },
              { key: 'projections', label: 'Projections', icon: TrendingUp }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Income Section */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <ArrowDownRight className="h-4 w-4 mr-2 text-green-600" />
                  Income Sources
                </h4>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Monthly Salary</span>
                    <span className="font-semibold text-green-600">NOK {monthlyIncome.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Next paycheck: <span className="font-medium">January 31, 2024</span> ({nextPaycheckDays} days)
                  </div>
                </div>
              </div>

              {/* Upcoming Payments */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <ArrowUpRight className="h-4 w-4 mr-2 text-red-600" />
                  Upcoming Payments ({sortedPayments.length})
                </h4>
                <div className="space-y-3">
                  {sortedPayments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className={`p-4 rounded-lg border ${
                      payment.status === 'overdue' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{getPaymentIcon(payment.category)}</span>
                          <div>
                            <h5 className="font-medium text-gray-900">{payment.description}</h5>
                            <div className="flex items-center space-x-3 text-sm text-gray-600">
                              <span>Due: {new Date(payment.dueDate).toLocaleDateString()}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                payment.priority === 'high' ? 'bg-red-100 text-red-800' :
                                payment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {payment.priority}
                              </span>
                              {payment.status === 'overdue' && (
                                <span className="text-red-600 font-medium">
                                  {payment.daysOverdue} days overdue
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            NOK {Math.abs(payment.amount).toLocaleString()}
                          </p>
                          <button className={`mt-1 px-3 py-1 text-xs font-medium rounded-lg ${
                            payment.status === 'overdue' 
                              ? 'bg-red-600 text-white hover:bg-red-700' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}>
                            {payment.status === 'overdue' ? 'Pay Now' : 'Schedule'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              {overBudgetCategories.length > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-yellow-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {overBudgetCategories.length} categor{overBudgetCategories.length > 1 ? 'ies are' : 'y is'} over budget
                    </span>
                  </div>
                </div>
              )}
              
              {spendingCategories.map((category, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
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
                  
                  <div className="bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        category.isOverBudget ? 'bg-red-500' :
                        category.percentUsed > 80 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(category.percentUsed, 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm">
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
                  
                  {/* Daily spending rate for this category */}
                  <div className="mt-2 text-xs text-gray-500">
                    Daily rate: NOK {(category.spent / 30).toFixed(0)} • 
                    {category.isOverBudget ? 
                      ` Reduce by NOK ${Math.ceil(Math.abs(category.remaining) / (30 - new Date().getDate()))} per day` :
                      ` NOK ${Math.floor(category.remaining / (30 - new Date().getDate()))} per day remaining`
                    }
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Projections Tab */}
          {activeTab === 'projections' && (
            <div className="space-y-6">
              {/* Spending Velocity */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <TrendingDown className="h-4 w-4 mr-2 text-blue-600" />
                  Spending Velocity
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Daily Burn Rate</p>
                    <p className="text-xl font-bold text-blue-600">NOK {dailyBurnRate.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Money Lasts</p>
                    <p className={`text-xl font-bold ${isProjectedShortfall ? 'text-red-600' : 'text-green-600'}`}>
                      {Math.floor(daysUntilEmpty)} days
                    </p>
                  </div>
                </div>
                <div className="mt-3 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${isProjectedShortfall ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min((daysUntilEmpty / nextPaycheckDays) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {isProjectedShortfall ? 
                    `⚠️ Will run short ${nextPaycheckDays - Math.floor(daysUntilEmpty)} days before payday` :
                    `✅ Will last until payday with NOK ${((daysUntilEmpty - nextPaycheckDays) * dailyBurnRate).toFixed(0)} to spare`
                  }
                </p>
              </div>

              {/* Scenario Planning */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-purple-600" />
                  What-If Scenarios
                </h4>
                <div className="space-y-3">
                  {overBudgetCategories.length > 0 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-800">
                        💡 If you stick to all budgets: Save NOK {overBudgetCategories.reduce((sum, cat) => sum + Math.abs(cat.remaining), 0).toLocaleString()}
                      </p>
                    </div>
                  )}
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">
                      🍽️ Skip dining out (NOK 500/week): Extend money by 3.5 days
                    </p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm font-medium text-purple-800">
                      🚗 Use public transport: Save NOK 200/week, extend by 1.4 days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="flex space-x-3">
            {overduePayments.length > 0 && (
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                Pay Overdue Bills
              </button>
            )}
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Set Spending Alert
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Auto-Save Surplus
            </button>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
              Export Data
            </button>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedModal;