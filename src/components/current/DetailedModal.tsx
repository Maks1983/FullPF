import React from 'react';
import { X, ArrowUpRight, TrendingUp, TrendingDown, Calendar, AlertTriangle, Zap, Target, PiggyBank, ChevronRight } from 'lucide-react';
import type { UpcomingPayment, SpendingCategory } from '../../types/current';
import HorizontalBarChart from '../charts/HorizontalBarChart';

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
  if (!isOpen) return null;

  const netAvailable = 19017.50; // This would come from props
  const upcomingPaymentsTotal = upcomingPayments
    .filter(p => p.status !== 'paid')
    .reduce((sum, p) => sum + Math.abs(p.amount), 0);
  const netAfterPayments = netAvailable - upcomingPaymentsTotal;
  const nextPaycheckDays = 16; // This would come from props
  const overduePayments = upcomingPayments.filter(p => p.status === 'overdue');
  
  // Calculate daily burn rate and projections
  const dailyBurnRate = monthlyExpenses / 30;
  const daysUntilTight = Math.floor(netAfterPayments / dailyBurnRate);
  
  // Health score calculation (simplified)
  const healthScore = 85; // This would come from props
  
  const getHealthBadgeColor = (score: number) => {
    if (score >= 85) return 'bg-green-500 text-white';
    if (score >= 70) return 'bg-blue-500 text-white';
    if (score >= 50) return 'bg-yellow-500 text-white';
    return 'bg-red-500 text-white';
  };

  const getSpendingVelocity = () => {
    const todaySpending = 485.50; // This would come from props
    const averageDaily = dailyBurnRate;
    if (todaySpending > averageDaily * 1.5) return 'High';
    if (todaySpending < averageDaily * 0.7) return 'Low';
    return 'Normal';
  };

  // Prepare data for horizontal bar charts
  const incomeData = [
    { category: 'Salary', amount: monthlyIncome * 0.85, color: '#10b981' },
    { category: 'Side Income', amount: monthlyIncome * 0.10, color: '#059669' },
    { category: 'Investments', amount: monthlyIncome * 0.05, color: '#047857' },
  ];

  const expenseData = spendingCategories.map(cat => ({
    category: cat.name,
    amount: cat.spent,
    color: cat.color
  })).sort((a, b) => b.amount - a.amount);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Hero Section - Financial Flow */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex items-center justify-between p-6">
            <div className="flex-1">
              {/* Money Story - Visual Narrative */}
              <div className="relative">
                {/* Title with Emoji Status */}
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl">
                    {netAfterPayments >= 5000 ? '😎' : 
                     netAfterPayments >= 0 ? '👍' : 
                     netAfterPayments >= -2000 ? '😬' : '😰'}
                  </span>
                  <h2 className="text-xl font-bold text-gray-900">
                    {netAfterPayments >= 5000 ? 'Looking Good!' : 
                     netAfterPayments >= 0 ? 'You\'re Covered' : 
                     netAfterPayments >= -2000 ? 'Getting Tight' : 'Need Action'}
                  </h2>
                </div>

                {/* Visual Money Flow */}
                <div className="flex items-center space-x-4 mb-4">
                  {/* Current Money */}
                  <div className="flex-shrink-0 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">NOK</span>
                    </div>
                    <div className="mt-2">
                      <div className="font-bold text-gray-900">{(netAvailable / 1000).toFixed(0)}k</div>
                      <div className="text-xs text-gray-600">Current</div>
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex-1 relative">
                    <div className="h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="bg-white rounded-full p-1 shadow-md">
                        <ArrowUpRight className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                    {/* Bills indicator */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                        -{(upcomingPaymentsTotal / 1000).toFixed(0)}k bills
                      </div>
                    </div>
                  </div>

                  {/* Result */}
                  <div className="flex-shrink-0 text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                      netAfterPayments >= 0 
                        ? 'bg-gradient-to-br from-blue-400 to-blue-600' 
                        : 'bg-gradient-to-br from-red-400 to-red-600'
                    }`}>
                      <span className="text-white font-bold text-sm">
                        {netAfterPayments >= 0 ? '✓' : '!'}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className={`font-bold ${netAfterPayments >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        {Math.abs(netAfterPayments / 1000).toFixed(0)}k
                      </div>
                      <div className="text-xs text-gray-600">
                        {netAfterPayments >= 0 ? 'Free' : 'Short'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Smart Insights Bar */}
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-white/60">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${daysUntilTight < 7 ? 'bg-red-500' : daysUntilTight < 14 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                        <span className="text-gray-700 font-medium">{daysUntilTight}d</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-700">{getSpendingVelocity().toLowerCase()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-500">•</span>
                        <span className={`font-medium ${healthScore >= 85 ? 'text-green-600' : healthScore >= 70 ? 'text-blue-600' : 'text-yellow-600'}`}>
                          {healthScore}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {nextPaycheckDays} days to payday
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-6"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Critical Alerts */}
        {(overduePayments.length > 0 || netAfterPayments < 0) && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <div className="flex items-center space-x-2 text-red-600 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Critical Issues Need Attention</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {overduePayments.length > 0 && (
                <div className="bg-red-100 p-3 rounded flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-800">{overduePayments.length} Overdue Payment{overduePayments.length > 1 ? 's' : ''}</p>
                    <p className="text-red-700">Total: NOK {overduePayments.reduce((sum, p) => sum + Math.abs(p.amount), 0).toLocaleString()}</p>
                  </div>
                  <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs font-medium">
                    Pay Now
                  </button>
                </div>
              )}
              {netAfterPayments < 0 && (
                <div className="bg-red-100 p-3 rounded">
                  <p className="font-medium text-red-800">Projected Shortfall</p>
                  <p className="text-red-700">NOK {Math.abs(netAfterPayments).toLocaleString()} short after payments</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content - Horizontal Bar Charts */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Income Breakdown */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3 mb-4">
                <ArrowUpRight className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-gray-900">Income Sources</h4>
              </div>
              <div className="mb-4">
                <p className="text-2xl font-bold text-green-600">NOK {monthlyIncome.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total monthly income</p>
              </div>
              <HorizontalBarChart data={incomeData} />
            </div>

            {/* Expense Breakdown */}
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <h4 className="font-semibold text-gray-900">Expense Categories</h4>
              </div>
              <div className="mb-4">
                <p className="text-2xl font-bold text-red-600">NOK {monthlyExpenses.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total monthly expenses</p>
              </div>
              <HorizontalBarChart data={expenseData} />
            </div>
          </div>

          {/* Payment Summary */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">Upcoming Payments Summary</h4>
                  <p className="text-sm text-gray-600">
                    {upcomingPayments.filter(p => p.status !== 'paid').length} payments totaling NOK {upcomingPaymentsTotal.toLocaleString()}
                  </p>
                </div>
              </div>
              <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All Payments
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Money Flow Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Your Money Flow This Month</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <ArrowUpRight className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-600">Income</p>
                  <p className="font-semibold text-green-600">NOK {monthlyIncome.toLocaleString()}</p>
                </div>
                
                <div className="flex-1 h-2 bg-gray-200 rounded-full mx-4 relative">
                  <div 
                    className="h-2 bg-green-500 rounded-full" 
                    style={{ width: '100%' }}
                  />
                  <div 
                    className="absolute top-0 right-0 h-2 bg-red-500 rounded-r-full" 
                    style={{ width: `${(monthlyExpenses / monthlyIncome) * 100}%` }}
                  />
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                  <p className="text-xs text-gray-600">Expenses</p>
                  <p className="font-semibold text-red-600">NOK {monthlyExpenses.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                You're {monthlyIncome - monthlyExpenses >= 0 ? 'saving' : 'overspending by'} <span className={`font-semibold ${monthlyIncome - monthlyExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  NOK {Math.abs(monthlyIncome - monthlyExpenses).toLocaleString()}
                </span> this month
                {monthlyIncome - monthlyExpenses >= 0 && ` (${(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100).toFixed(1)}% savings rate)`}
              </p>
            </div>
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
            {monthlyIncome - monthlyExpenses > 0 && (
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