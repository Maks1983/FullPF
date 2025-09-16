import React from 'react';
import { X, ArrowUpRight, TrendingUp, TrendingDown, Calendar, AlertTriangle, Zap, Target, PiggyBank, ChevronRight } from 'lucide-react';
import type { UpcomingPayment, SpendingCategory } from '../../types/current';

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
  const [showInsights, setShowInsights] = React.useState(true);
  const [showProjections, setShowProjections] = React.useState(false);

  if (!isOpen) return null;

  const netFlow = monthlyIncome - monthlyExpenses;
  const netAvailable = 19017.50; // This would come from props
  const nextPaycheckDays = 16; // This would come from props
  const overduePayments = upcomingPayments.filter(p => p.status === 'overdue');
  const overBudgetCategories = spendingCategories.filter(cat => cat.isOverBudget);
  
  // Calculate daily burn rate and projections
  const dailyBurnRate = monthlyExpenses / 30;
  const daysUntilEmpty = netAvailable / dailyBurnRate;
  const isProjectedShortfall = daysUntilEmpty < nextPaycheckDays;

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

  const getInsightColor = (color: string) => {
    const colors = {
      red: 'bg-red-50 border-red-200 text-red-800',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      blue: 'bg-blue-50 border-blue-200 text-blue-800'
    };
    return colors[color] || colors.blue;
  };

  // Summary of upcoming payments (not full table)
  const upcomingThisWeek = upcomingPayments.filter(p => {
    const dueDate = new Date(p.dueDate);
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    return p.status !== 'paid' && dueDate <= weekFromNow;
  });

  const upcomingTotal = upcomingPayments
    .filter(p => p.status !== 'paid')
    .reduce((sum, p) => sum + Math.abs(p.amount), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Hero Section - Always Visible */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Available Balance</h2>
                <p className="text-sm text-gray-600">Your financial position right now</p>
              </div>
              
              {/* Hero Numbers */}
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${netAvailable >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    NOK {Math.abs(netAvailable).toLocaleString()}
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

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {/* Income Section */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-2 text-green-600" />
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

          {/* Upcoming Payments Summary (Not Full Table) */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-blue-600" />
              Upcoming Payments Summary
            </h4>
            
            {/* Overdue Payments (Critical) */}
            {overduePayments.length > 0 && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-800">⚠️ {overduePayments.length} Overdue Payment{overduePayments.length > 1 ? 's' : ''}</p>
                    <p className="text-sm text-red-600">Total: NOK {overduePayments.reduce((sum, p) => sum + Math.abs(p.amount), 0).toLocaleString()}</p>
                  </div>
                  <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
                    Pay Now
                  </button>
                </div>
              </div>
            )}

            {/* This Week Summary */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-800">{upcomingThisWeek.length} payment{upcomingThisWeek.length !== 1 ? 's' : ''} due this week</p>
                  <p className="text-sm text-blue-600">Total: NOK {upcomingThisWeek.reduce((sum, p) => sum + Math.abs(p.amount), 0).toLocaleString()}</p>
                </div>
                <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All Payments
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Spending Velocity & Projections */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <TrendingDown className="h-4 w-4 mr-2 text-purple-600" />
                Spending Velocity
              </h4>
              <button 
                onClick={() => setShowProjections(!showProjections)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showProjections ? 'Hide' : 'Show'} Projections
              </button>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
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

            {/* Scenario Planning (Collapsible) */}
            {showProjections && (
              <div className="mt-4">
                <h5 className="font-medium text-gray-900 mb-3">What-If Scenarios</h5>
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
            )}
          </div>
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
            {netFlow > 0 && (
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Auto-Save Surplus
              </button>
            )}
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