import React, { useState } from 'react';
import { Calendar, AlertTriangle, Repeat, Plus, Filter } from 'lucide-react';
import { activityIcons } from '../../theme/icons';
import type { UpcomingTransaction } from '../../types/current';

interface UpcomingTransactionsListProps {
  transactions: UpcomingTransaction[];
}

const UpcomingTransactionsList: React.FC<UpcomingTransactionsListProps> = ({ transactions }) => {
  const [filter, setFilter] = useState<'all' | 'overdue' | 'upcoming'>('all');

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'overdue') return transaction.status === 'overdue';
    if (filter === 'upcoming') return transaction.status !== 'overdue';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income': return 'text-green-600';
      case 'expense': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const overdueCount = transactions.filter(t => t.status === 'overdue').length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Transactions</h3>
            {overdueCount > 0 && (
              <span className="ml-2 px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                {overdueCount} overdue
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['all', 'overdue', 'upcoming'] as const).map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    filter === filterOption
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ))}
            </div>
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredTransactions.map((transaction) => {
          const Icon = activityIcons[transaction.type];
          const isOverdue = transaction.status === 'overdue';
          const daysUntil = Math.ceil((new Date(transaction.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

          return (
            <div 
              key={transaction.id} 
              className={`p-4 hover:bg-gray-50 transition-colors ${
                isOverdue ? 'bg-red-50 border-l-4 border-red-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'income' ? 'bg-green-100' :
                    transaction.type === 'expense' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    <Icon className={`h-5 w-5 ${getTypeColor(transaction.type)}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">{transaction.description}</h4>
                      {transaction.isRecurring && (
                        <Repeat className="h-4 w-4 text-gray-400" />
                      )}
                      {isOverdue && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600">{transaction.category}</span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm text-gray-600">{transaction.account}</span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm text-gray-600">
                        {isOverdue ? `${Math.abs(daysUntil)} days overdue` : 
                         daysUntil === 0 ? 'Today' :
                         daysUntil === 1 ? 'Tomorrow' :
                         `${daysUntil} days`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-lg font-bold ${getTypeColor(transaction.type)}`}>
                    {transaction.amount > 0 ? '+' : ''}NOK {Math.abs(transaction.amount).toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-600">{transaction.date}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h4>
          <p className="text-gray-600">
            {filter === 'overdue' ? 'No overdue transactions' :
             filter === 'upcoming' ? 'No upcoming transactions' :
             'No transactions to display'}
          </p>
        </div>
      )}
    </div>
  );
};

export default UpcomingTransactionsList;