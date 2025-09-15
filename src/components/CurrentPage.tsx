import React, { useState } from 'react';
import { Calendar, Plus, ArrowUpDown, AlertCircle } from 'lucide-react';
import DoughnutChart from './charts/DoughnutChart';
import HorizontalBarChart from './charts/HorizontalBarChart';
import Table from './common/Table';

const CurrentPage = () => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const currentSaldo = 425.70;
  const remainingPayments = -24359.75;
  const netLeftover = currentSaldo + remainingPayments;
  const daysUntilPayday = 12;
  const isPositive = netLeftover > 0;

  const upcomingTransactions = [
    { id: 1, description: 'Rent Payment', amount: -12000, date: '2024-01-15', category: 'Housing', status: 'scheduled' },
    { id: 2, description: 'Netflix Subscription', amount: -159.90, date: '2024-01-16', category: 'Entertainment', status: 'scheduled' },
    { id: 3, description: 'Insurance Payment', amount: -2500, date: '2024-01-18', category: 'Insurance', status: 'scheduled' },
    { id: 4, description: 'Phone Bill', amount: -699.85, date: '2024-01-19', category: 'Utilities', status: 'scheduled' },
    { id: 5, description: 'Car Payment', amount: -9000, date: '2024-01-22', category: 'Transportation', status: 'scheduled' },
  ];

  const overduePayments = [
    { id: 1, description: 'Credit Card Payment', amount: -4500.00, dueDate: '2024-01-10', daysOverdue: 3 },
    { id: 2, description: 'Utility Bill', amount: -755.00, dueDate: '2024-01-08', daysOverdue: 5 },
  ];

  const latestTransactions = [
    { id: 1, description: 'Grocery Store', amount: -1485.00, date: '2024-01-12', category: 'Food' },
    { id: 2, description: 'Gas Station', amount: -452.00, date: '2024-01-11', category: 'Transportation' },
    { id: 3, description: 'Coffee Shop', amount: -87.50, date: '2024-01-11', category: 'Food' },
    { id: 4, description: 'ATM Withdrawal', amount: -1000.00, date: '2024-01-10', category: 'Cash' },
    { id: 5, description: 'Online Transfer', amount: 2500.00, date: '2024-01-09', category: 'Transfer' },
  ];

  const incomeCategories = [
    { category: 'Salary', amount: 52000, color: '#10b981' },
    { category: 'Freelance', amount: 7500, color: '#3b82f6' },
    { category: 'Investments', amount: 1250, color: '#8b5cf6' },
  ];

  const expenseCategories = [
    { category: 'Housing', amount: 12000, color: '#ef4444' },
    { category: 'Food', amount: 4500, color: '#f59e0b' },
    { category: 'Transportation', amount: 2800, color: '#6366f1' },
    { category: 'Utilities', amount: 1800, color: '#ec4899' },
    { category: 'Entertainment', amount: 1200, color: '#14b8a6' },
  ];

  const upcomingColumns = [
    { key: 'date', header: 'Date', sortable: true },
    { key: 'description', header: 'Description', sortable: true },
    { key: 'category', header: 'Category', sortable: true },
    { key: 'amount', header: 'Amount', sortable: true, render: (value) => (
      <span className={value > 0 ? 'text-green-600' : 'text-red-600'}>
        {Math.abs(value).toLocaleString()} NOK
      </span>
    )},
  ];

  const latestColumns = [
    { key: 'date', header: 'Date', sortable: true },
    { key: 'description', header: 'Description', sortable: true },
    { key: 'category', header: 'Category', sortable: true },
    { key: 'amount', header: 'Amount', sortable: true, render: (value) => (
      <span className={value > 0 ? 'text-green-600' : 'text-red-600'}>
        {value > 0 ? '+' : '-'}{Math.abs(value).toLocaleString()} NOK
      </span>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Current Overview</h1>
        <p className="text-gray-600">Left until payday and current spending overview</p>
      </div>

      {/* Leftover Until Next Payday */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Leftover Until Next Payday</h3>
            <Calendar className="h-5 w-5 text-gray-500" />
          </div>
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Current Saldo:</span>
              <span className="font-semibold text-green-600">{currentSaldo.toLocaleString()} NOK</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Remaining Payments:</span>
              <span className="font-semibold text-red-600">{remainingPayments.toLocaleString()} NOK</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600 font-medium">Net Leftover:</span>
              <span className={`font-bold ${netLeftover >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {netLeftover.toLocaleString()} NOK
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <DoughnutChart 
              value={Math.abs(daysUntilPayday)} 
              total={30} 
              color={netLeftover >= 0 ? '#10b981' : '#ef4444'}
              size={120}
              centerText={`${daysUntilPayday} days`}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Income</span>
              <span className="font-semibold text-green-600">+60,750 NOK</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expenses</span>
              <span className="font-semibold text-red-600">-22,300 NOK</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="text-gray-600 font-medium">Net</span>
              <span className="font-bold text-green-600">+38,450 NOK</span>
            </div>
          </div>
        </div>

        {/* Budget Progress */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Progress</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Food</span>
                <span className="text-sm font-medium">4,500 / 6,000 NOK</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Transportation</span>
                <span className="text-sm font-medium">2,800 / 4,000 NOK</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '70%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Entertainment</span>
                <span className="text-sm font-medium text-red-600">1,200 / 1,000 NOK</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overdue Payments Alert */}
      {overduePayments.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-red-900">Overdue Payments</h3>
          </div>
          <div className="space-y-2">
            {overduePayments.map(payment => (
              <div key={payment.id} className="flex items-center justify-between p-3 bg-white rounded border">
                <div>
                  <p className="font-medium text-gray-900">{payment.description}</p>
                  <p className="text-sm text-red-600">Due: {payment.dueDate} ({payment.daysOverdue} days overdue)</p>
                </div>
                <div className="font-semibold text-red-600">
                  {Math.abs(payment.amount).toLocaleString()} NOK
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Income by Category</h3>
          <HorizontalBarChart data={incomeCategories} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
          <HorizontalBarChart data={expenseCategories} />
        </div>
      </div>

      {/* Upcoming Transactions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Transactions</h3>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </button>
        </div>
        <Table 
          data={upcomingTransactions} 
          columns={upcomingColumns}
          sortConfig={sortConfig}
          onSort={setSortConfig}
        />
      </div>

      {/* Latest Transactions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Latest Transactions</h3>
          <div className="flex space-x-2">
            <button className="flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
              <Plus className="h-4 w-4 mr-1" />
              Income
            </button>
            <button className="flex items-center px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
              <Plus className="h-4 w-4 mr-1" />
              Expense
            </button>
          </div>
        </div>
        <Table 
          data={latestTransactions} 
          columns={latestColumns}
          sortConfig={sortConfig}
          onSort={setSortConfig}
        />
      </div>
    </div>
  );
};

export default CurrentPage;