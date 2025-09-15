import React, { useState } from 'react';
import { Activity, ArrowUpRight, ArrowDownRight, Filter, Star, Lock } from 'lucide-react';
import type { RecentTransaction } from '../../types/current';

interface RecentTransactionsCardProps {
  transactions: RecentTransaction[];
}

const RecentTransactionsCard: React.FC<RecentTransactionsCardProps> = ({
  transactions
}) => {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  
  // Show only last 5 transactions for free users
  const freeTransactions = transactions.slice(0, 5);
  const premiumTransactions = transactions.slice(5);
  
  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'income') return transaction.amount > 0;
    if (filter === 'expense') return transaction.amount < 0;
    return true;
  }).slice(0, 5); // Limit to 5 for free users

  const getCategoryColor = (category: string) => {
    const colors = {
      'Food': 'bg-red-100 text-red-800',
      'Transportation': 'bg-blue-100 text-blue-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Shopping': 'bg-green-100 text-green-800',
      'Transfer': 'bg-indigo-100 text-indigo-800',
      'Cash': 'bg-gray-100 text-gray-800',
      'Utilities': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
              <p className="text-sm text-gray-600">
                Last {transactions.length} transactions
              </p>
              {premiumTransactions.length > 0 && (
                <span className="ml-2 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                  +{premiumTransactions.length} more with Premium
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No {filter === 'all' ? '' : filter} transactions found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredTransactions.map((transaction) => {
              const isIncome = transaction.amount > 0;
              
              return (
                <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        isIncome ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {isIncome ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {transaction.description}
                        </h4>
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                            {transaction.category}
                          </span>
                          {transaction.merchant && (
                            <span>{transaction.merchant}</span>
                          )}
                          <span>{new Date(transaction.date).toLocaleDateString()}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-bold ${
                        isIncome ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {isIncome ? '+' : '-'}NOK {Math.abs(transaction.amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Premium Upgrade Section */}
      {premiumTransactions.length > 0 && (
        <div className="border-t bg-gradient-to-r from-green-50 to-blue-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Complete Transaction History</h4>
                <p className="text-sm text-gray-600">
                  View unlimited transactions with advanced filtering and search
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">+{premiumTransactions.length} more</p>
                <p className="text-xs text-gray-500">Premium feature</p>
              </div>
              <Lock className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <button className="mt-3 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            Upgrade to Premium
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentTransactionsCard;