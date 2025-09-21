import React from 'react';
import { X, ArrowUpRight, TrendingDown } from 'lucide-react';
import type { UpcomingPayment, SpendingCategory } from '../../types/current';
import HorizontalBarChart from '../charts/HorizontalBarChart';

interface DetailedModalProps {
  isOpen: boolean;
  onClose: () => void;
  upcomingPayments: UpcomingPayment[];
  spendingCategories: SpendingCategory[];
  monthlyIncome: number;
  monthlyExpenses: number;
  totalAvailable: number;
  netLeftoverUntilPaycheck: number;
  daysUntilPaycheck: number;
}

const DetailedModal: React.FC<DetailedModalProps> = ({
  isOpen,
  onClose,
  upcomingPayments,
  spendingCategories,
  monthlyIncome,
  monthlyExpenses,
  totalAvailable,
  netLeftoverUntilPaycheck,
  daysUntilPaycheck
}) => {
  const titleId = React.useId();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!isOpen) return null;

  const upcomingPaymentsTotal = upcomingPayments
    .filter(p => p.status !== 'paid')
    .reduce((sum, p) => sum + Math.abs(p.amount), 0);
  const netAfterPayments = netLeftoverUntilPaycheck;
  
  // Health score calculation (simplified)
  
  // Dynamic emoji/status thresholds based on user's financial context
  const getFinancialStatusEmoji = (netAmount: number, userIncome: number) => {
    const monthlyIncomeThreshold = userIncome || monthlyIncome;
    const comfortableThreshold = monthlyIncomeThreshold * 0.15; // 15% of monthly income
    const tightThreshold = monthlyIncomeThreshold * 0.05; // 5% of monthly income
    
    if (netAmount >= comfortableThreshold) return '😎';
    if (netAmount >= tightThreshold) return '👍';
    if (netAmount >= -tightThreshold) return '😬';
    return '😰';
  };
  
  const getFinancialStatusText = (netAmount: number, userIncome: number) => {
    const monthlyIncomeThreshold = userIncome || monthlyIncome;
    const comfortableThreshold = monthlyIncomeThreshold * 0.15;
    const tightThreshold = monthlyIncomeThreshold * 0.05;
    
    if (netAmount >= comfortableThreshold) return 'Looking Great!';
    if (netAmount >= tightThreshold) return 'You\'re Covered';
    if (netAmount >= -tightThreshold) return 'Getting Tight';
    return 'Need Action';
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
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Section - Financial Flow */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex items-start justify-between p-4">
            <div className="flex-1 pr-4">
              {/* Money Story - Visual Narrative */}
              <div className="relative">
                {/* Title with Emoji Status */}
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">
                    {getFinancialStatusEmoji(netAfterPayments, monthlyIncome)}
                  </span>
                  <h2 id={titleId} className="text-lg font-bold text-gray-900">
                    {getFinancialStatusText(netAfterPayments, monthlyIncome)}
                  </h2>
                </div>

                {/* Visual Money Flow */}
                <div className="flex items-center space-x-3 mb-3">
                  {/* Current Money */}
                  <div className="flex-shrink-0 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs">NOK</span>
                    </div>
                    <div className="mt-2">
                      <div className="font-bold text-sm text-gray-900">{(totalAvailable / 1000).toFixed(0)}k</div>
                      <div className="text-xs text-gray-600">Current</div>
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex-1 relative">
                    {/* Timeline Labels */}
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600">Today</span>
                      <span className="text-xs font-medium text-gray-600">Payday</span>
                    </div>
                    <div className="h-1.5 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="bg-white rounded-full p-1 shadow-md">
                        <ArrowUpRight className="h-3 w-3 text-gray-600" />
                      </div>
                    </div>
                    {/* Bills indicator */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
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
                      <span className="text-white font-bold text-xs">
                        {netAfterPayments >= 0 ? '✓' : '!'}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className={`font-bold text-sm ${netAfterPayments >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        {Math.abs(netAfterPayments / 1000).toFixed(0)}k
                      </div>
                      <div className="text-xs text-gray-600">
                        {netAfterPayments >= 0 ? 'Free' : 'Short'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Close button - properly positioned */}
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content - Horizontal Bar Charts */}
        <div className="p-3 overflow-y-auto max-h-[55vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Income Breakdown */}
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3 mb-4">
                <ArrowUpRight className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-gray-900">Income Sources</h4>
              </div>
              <div className="mb-2">
                <p className="text-lg font-bold text-green-600">NOK {monthlyIncome.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total monthly income</p>
              </div>
              <HorizontalBarChart data={incomeData} />
            </div>

            {/* Expense Breakdown */}
            <div className="bg-red-50 p-3 rounded-lg border border-red-200 flex flex-col">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <h4 className="font-semibold text-gray-900">Expense Categories</h4>
              </div>
              <div className="mb-2">
                <p className="text-lg font-bold text-red-600">NOK {monthlyExpenses.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total monthly expenses</p>
              </div>
              {/* Optimized scrollable expense chart for 11-12 categories */}
              <div className="flex-1 overflow-y-auto pr-2 min-h-0" style={{ maxHeight: '280px' }}>
                <HorizontalBarChart data={expenseData} />
              </div>
              {/* Enhanced mobile-friendly scroll indicator */}
              {expenseData.length > 6 && (
                <div className="mt-2 pt-2 border-t border-red-200 bg-red-50 rounded-b-lg">
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
                    <div className="flex flex-col items-center">
                      <div className="text-lg leading-none">↕</div>
                      <div className="w-8 h-0.5 bg-gray-400 rounded-full animate-pulse"></div>
                    </div>
                    <span className="font-medium">Scroll to see all {expenseData.length} categories</span>
                  </div>
                  {/* Mobile touch indicator */}
                  <div className="mt-1 text-center">
                    <span className="text-xs text-gray-500 md:hidden">👆 Swipe up/down to scroll</span>
                    <span className="text-xs text-gray-500 hidden md:inline">Use mouse wheel or scrollbar</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="flex space-x-3">
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
