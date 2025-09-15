import React from 'react';
import { X, ArrowUpRight, ArrowDownRight, Calendar, AlertTriangle, CheckCircle, Clock, CreditCard } from 'lucide-react';
import type { CurrentAccount, UpcomingPayment, SpendingCategory } from '../../types/current';

interface DetailedModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: CurrentAccount[];
  upcomingPayments: UpcomingPayment[];
  spendingCategories: SpendingCategory[];
  monthlyIncome: number;
  monthlyExpenses: number;
}

const DetailedModal: React.FC<DetailedModalProps> = ({
  isOpen,
  onClose,
  accounts,
  upcomingPayments,
  spendingCategories,
  monthlyIncome,
  monthlyExpenses
}) => {
  if (!isOpen) return null;

  const netFlow = monthlyIncome - monthlyExpenses;
  const pendingPayments = upcomingPayments.filter(p => p.status !== 'paid');
  const overduePayments = upcomingPayments.filter(p => p.status === 'overdue');

  const getStatusIcon = (payment: UpcomingPayment) => {
    if (payment.status === 'overdue') return AlertTriangle;
    if (payment.status === 'paid') return CheckCircle;
    return Clock;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'text-red-600';
      case 'paid': return 'text-green-600';
      case 'scheduled': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming Payments Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  Upcoming Payments
                </h3>
                {overduePayments.length > 0 && (
                  <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                    {overduePayments.length} overdue
                  </span>
                )}
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {pendingPayments.map((payment) => {
                  const StatusIcon = getStatusIcon(payment);
                  const daysUntilDue = getDaysUntilDue(payment.dueDate);
                  
                  return (
                    <div key={payment.id} className={`p-4 rounded-lg border transition-all hover:shadow-sm ${
                      payment.status === 'overdue' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <StatusIcon className={`h-5 w-5 ${getStatusColor(payment.status)}`} />
                          <div>
                            <h4 className="font-medium text-gray-900">{payment.description}</h4>
                            <p className="text-sm text-gray-600 capitalize">{payment.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            NOK {Math.abs(payment.amount).toLocaleString()}
                          </p>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(payment.priority)}`}>
                            {payment.priority}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          Due: {new Date(payment.dueDate).toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-2">
                          {payment.status === 'overdue' && payment.daysOverdue && (
                            <span className="text-red-600 font-medium">
                              {payment.daysOverdue} days overdue
                            </span>
                          )}
                          {payment.status === 'scheduled' && (
                            <span className={`font-medium ${
                              daysUntilDue <= 3 ? 'text-red-600' : 
                              daysUntilDue <= 7 ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {daysUntilDue > 0 ? `in ${daysUntilDue} days` : 'due today'}
                            </span>
                          )}
                          <button className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                            payment.status === 'overdue' 
                              ? 'bg-red-600 text-white hover:bg-red-700' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}>
                            {payment.status === 'overdue' ? 'Pay Now' : 'Schedule'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Spending Categories Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 text-purple-600 mr-2" />
                Spending Categories
              </h3>

              <div className="space-y-4 max-h-80 overflow-y-auto">
                {spendingCategories.map((category, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
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
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {pendingPayments.length} payments • {spendingCategories.filter(c => c.isOverBudget).length} over budget
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