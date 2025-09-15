import React from 'react';
import { X, TrendingUp, TrendingDown, Wallet, Calendar, PieChart, BarChart3 } from 'lucide-react';
import type { CurrentAccount, PaycheckInfo } from '../../types/current';

interface DetailedBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: CurrentAccount[];
  totalAvailable: number;
  netLeftover: number;
  paycheckInfo: PaycheckInfo;
}

const DetailedBalanceModal: React.FC<DetailedBalanceModalProps> = ({
  isOpen,
  onClose,
  accounts,
  totalAvailable,
  netLeftover,
  paycheckInfo
}) => {
  if (!isOpen) return null;

  // Mock income and expense data (in a real app, this would come from props)
  const monthlyIncome = 52000;
  const monthlyExpenses = 44000;
  const netMonthlyFlow = monthlyIncome - monthlyExpenses;

  // Expense breakdown
  const expenseCategories = [
    { name: 'Housing', amount: 12000, color: '#ef4444', percentage: 27.3 },
    { name: 'Food & Dining', amount: 8500, color: '#f97316', percentage: 19.3 },
    { name: 'Transportation', amount: 6200, color: '#eab308', percentage: 14.1 },
    { name: 'Utilities', amount: 4800, color: '#22c55e', percentage: 10.9 },
    { name: 'Entertainment', amount: 3200, color: '#3b82f6', percentage: 7.3 },
    { name: 'Shopping', amount: 2800, color: '#8b5cf6', percentage: 6.4 },
    { name: 'Healthcare', amount: 2200, color: '#ec4899', percentage: 5.0 },
    { name: 'Other', amount: 4300, color: '#6b7280', percentage: 9.8 }
  ];

  // Account breakdown
  const accountBreakdown = accounts.map(account => ({
    ...account,
    contribution: account.type === 'credit' 
      ? account.availableBalance 
      : account.balance
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <Wallet className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Available Balance Breakdown</h2>
              <p className="text-gray-600">Your current financial position and cash flow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Balance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Income</h3>
              <p className="text-3xl font-bold text-green-600">{monthlyIncome.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">Gross monthly income</p>
            </div>
            
            <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
              <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Expenses</h3>
              <p className="text-3xl font-bold text-red-600">{monthlyExpenses.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">Total monthly spending</p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
              <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Net Cash Flow</h3>
              <p className={`text-3xl font-bold ${netMonthlyFlow >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {netMonthlyFlow >= 0 ? '+' : ''}{netMonthlyFlow.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">Monthly surplus/deficit</p>
            </div>
          </div>

          {/* Account Breakdown */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Wallet className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Account Breakdown</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                {accountBreakdown.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{account.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{account.type} account</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {account.contribution.toLocaleString()}
                      </p>
                      {account.type === 'credit' && (
                        <p className="text-xs text-gray-500">Available credit</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Available</span>
                  <span className={`text-xl font-bold ${totalAvailable >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalAvailable >= 0 ? '' : '-'}{Math.abs(totalAvailable).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <PieChart className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Monthly Expense Breakdown</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expenseCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium text-gray-900">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{category.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{category.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Health Insights */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Financial Health Insights</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-900 mb-2">💰 Savings Rate</p>
                <p className="text-gray-700">
                  You're saving <strong>{((netMonthlyFlow / monthlyIncome) * 100).toFixed(1)}%</strong> of your income monthly
                  {((netMonthlyFlow / monthlyIncome) * 100) >= 20 ? ' (Excellent!)' : 
                   ((netMonthlyFlow / monthlyIncome) * 100) >= 10 ? ' (Good)' : ' (Could improve)'}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-2">📅 Until Next Paycheck</p>
                <p className="text-gray-700">
                  <strong>{paycheckInfo.daysUntilPaycheck} days</strong> remaining with 
                  <strong className={netLeftover >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {' '}{netLeftover >= 0 ? '' : '-'}{Math.abs(netLeftover).toLocaleString()}
                  </strong> projected balance
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-2">🏠 Housing Ratio</p>
                <p className="text-gray-700">
                  Housing costs are <strong>{((12000 / monthlyIncome) * 100).toFixed(1)}%</strong> of income
                  {((12000 / monthlyIncome) * 100) <= 30 ? ' (Healthy)' : ' (High)'}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-2">💳 Available Credit</p>
                <p className="text-gray-700">
                  <strong>{accounts.filter(acc => acc.type === 'credit').reduce((sum, acc) => sum + acc.availableBalance, 0).toLocaleString()}</strong> in available credit for emergencies
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Balance as of {new Date().toLocaleDateString()}
          </div>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailedBalanceModal;