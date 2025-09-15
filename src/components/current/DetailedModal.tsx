import React from 'react';
import { X, ArrowUpRight, ArrowDownRight, Calendar, AlertTriangle, CheckCircle, Clock, CreditCard, Wallet } from 'lucide-react';
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
  const [activeTab, setActiveTab] = React.useState<'categories'>('categories');

  if (!isOpen) return null;

  const netFlow = monthlyIncome - monthlyExpenses;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-xl font-bold text-gray-900">Financial Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Compact Money Flow Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <ArrowDownRight className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Money In</span>
              </div>
              <p className="text-2xl font-bold text-green-600">NOK {monthlyIncome.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <ArrowUpRight className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Money Out</span>
              </div>
              <p className="text-2xl font-bold text-red-600">NOK {monthlyExpenses.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Net Flow</span>
              </div>
              <p className={`text-2xl font-bold ${netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {netFlow >= 0 ? '+' : ''}NOK {netFlow.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {[
              { key: 'categories', label: 'Categories', icon: CreditCard, count: spendingCategories.length }
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
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Categories Tab */}
          <div className="space-y-4">
            {spendingCategories.filter(c => c.isOverBudget).length > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2 text-yellow-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {spendingCategories.filter(c => c.isOverBudget).length} categor{spendingCategories.filter(c => c.isOverBudget).length > 1 ? 'ies are' : 'y is'} over budget
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
              </div>
            ))}
          </div>
        </div>
            <div className="space-y-4">
              {spendingCategories.filter(c => c.isOverBudget).length > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-yellow-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {spendingCategories.filter(c => c.isOverBudget).length} categor{spendingCategories.filter(c => c.isOverBudget).length > 1 ? 'ies are' : 'y is'} over budget
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
                </div>
              ))}
            </div>
          )}

          {/* Accounts Tab */}
          {activeTab === 'accounts' && (
            <div className="space-y-4">
              {accounts.map((account) => (
                <div key={account.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{account.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{account.type} account</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        NOK {account.balance.toLocaleString()}
                      </p>
                      {account.type === 'credit' && (
                        <p className="text-sm text-gray-600">
                          Available: NOK {account.availableBalance.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      account.status === 'active' ? 'bg-green-100 text-green-800' :
                      account.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {account.status}
                    </span>
                    <span>Updated: {new Date(account.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {spendingCategories.filter(c => c.isOverBudget).length} over budget
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
              Export Data
            </button>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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