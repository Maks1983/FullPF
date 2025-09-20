import React from 'react';
import { X, Calendar, AlertTriangle, Clock, CheckCircle, Repeat } from 'lucide-react';
import type { UpcomingPayment } from '../../types/current';

interface UpcomingPaymentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payments: UpcomingPayment[];
  overdueCount: number;
}

const UpcomingPaymentsModal: React.FC<UpcomingPaymentsModalProps> = ({
  isOpen,
  onClose,
  payments,
  overdueCount
}) => {
  const [filter, setFilter] = React.useState<'all' | 'overdue' | 'upcoming'>('all');
  const titleId = React.useId();
  
  if (!isOpen) return null;

  const filteredPayments = payments.filter(payment => {
    if (filter === 'overdue') return payment.status === 'overdue';
    if (filter === 'upcoming') return payment.status === 'scheduled';
    return payment.status !== 'paid';
  }).sort((a, b) => {
    // Sort overdue first, then by due date
    if (a.status === 'overdue' && b.status !== 'overdue') return -1;
    if (b.status === 'overdue' && a.status !== 'overdue') return 1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const totalUpcoming = payments
    .filter(p => p.status !== 'paid')
    .reduce((sum, p) => sum + Math.abs(p.amount), 0);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

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

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
        onClick={(event) => event.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${overdueCount > 0 ? 'bg-red-100' : 'bg-blue-100'}`}>
              <Calendar className={`h-5 w-5 ${overdueCount > 0 ? 'text-red-600' : 'text-blue-600'}`} />
            </div>
            <div>
              <h2 id={titleId} className="text-xl font-bold text-gray-900">Upcoming Payments</h2>
              <p className="text-sm text-gray-600">
                {totalUpcoming.toLocaleString()} (in NOK) total
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Alert Banner */}
        {overdueCount > 0 && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm font-medium">{overdueCount} overdue payment{overdueCount > 1 ? 's' : ''} need immediate attention</span>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'all', label: 'All', count: payments.filter(p => p.status !== 'paid').length },
              { key: 'overdue', label: 'Overdue', count: overdueCount },
              { key: 'upcoming', label: 'Upcoming', count: payments.filter(p => p.status === 'scheduled').length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Payments List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredPayments.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No {filter === 'all' ? '' : filter} payments found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredPayments.map((payment) => {
                const StatusIcon = getStatusIcon(payment);
                const daysUntilDue = getDaysUntilDue(payment.dueDate);
                
                return (
                  <div key={payment.id} className={`p-4 hover:bg-gray-50 transition-colors ${
                    payment.status === 'overdue' ? 'bg-red-50' : ''
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <StatusIcon className={`h-5 w-5 ${getStatusColor(payment.status)}`} />
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900">
                              {payment.description}
                            </h4>
                            {payment.isRecurring && (
                              <Repeat className="h-4 w-4 text-blue-500" />
                            )}
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(payment.priority)}`}>
                              {payment.priority}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-gray-600">
                            <span className="capitalize">{payment.category}</span>
                            <span>Due: {new Date(payment.dueDate).toLocaleDateString()}</span>
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
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          -{Math.abs(payment.amount).toLocaleString()}
                        </p>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(payment.priority)}`}>
                            {payment.priority}
                          </span>
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
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''}
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
              Export List
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

export default UpcomingPaymentsModal;


