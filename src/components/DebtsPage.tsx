import React, { useState } from 'react';
import { CreditCard, Calendar, TrendingDown, Star, Plus } from 'lucide-react';
import MetricCard from './common/MetricCard';
import PieChart from './charts/PieChart';
import LineChart from './charts/LineChart';
import Table from './common/Table';

const DebtsPage = () => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const debtSummaryMetrics = [
    {
      title: 'Total Debt',
      value: '$38,450.00',
      change: '-3.2%',
      trend: 'down',
      icon: CreditCard,
      color: 'red'
    },
    {
      title: 'Monthly Payment',
      value: '$1,245.00',
      change: '+2.1%',
      trend: 'up',
      icon: Calendar,
      color: 'blue'
    },
    {
      title: 'Average Rate',
      value: '12.8%',
      change: '-0.5%',
      trend: 'down',
      icon: TrendingDown,
      color: 'yellow'
    },
    {
      title: 'Payoff Date',
      value: 'Dec 2026',
      change: '-3 months',
      trend: 'down',
      icon: Calendar,
      color: 'green'
    }
  ];

  const debtComposition = [
    { name: 'Credit Cards', value: 18500, color: '#ef4444' },
    { name: 'Car Loan', value: 12200, color: '#3b82f6' },
    { name: 'Student Loan', value: 7750, color: '#8b5cf6' },
  ];

  const loanOverview = [
    {
      id: 1,
      name: 'Chase Sapphire Card',
      type: 'Credit Card',
      balance: 8500,
      payment: 255,
      rate: 18.9,
      dueDate: '2024-01-25',
      status: 'current'
    },
    {
      id: 2,
      name: 'Capital One Quicksilver',
      type: 'Credit Card',
      balance: 10000,
      payment: 300,
      rate: 21.5,
      dueDate: '2024-01-28',
      status: 'current'
    },
    {
      id: 3,
      name: 'Honda Civic Loan',
      type: 'Auto Loan',
      balance: 12200,
      payment: 340,
      rate: 4.2,
      dueDate: '2024-01-15',
      status: 'current'
    },
    {
      id: 4,
      name: 'Federal Student Loan',
      type: 'Student Loan',
      balance: 7750,
      payment: 125,
      rate: 5.8,
      dueDate: '2024-01-20',
      status: 'current'
    }
  ];

  const debtProgressData = [
    { month: 'Jan', balance: 42500, interest: 450 },
    { month: 'Feb', balance: 41800, interest: 445 },
    { month: 'Mar', balance: 41050, interest: 438 },
    { month: 'Apr', balance: 40300, interest: 430 },
    { month: 'May', balance: 39500, interest: 422 },
    { month: 'Jun', balance: 38450, interest: 410 },
  ];

  const loanColumns = [
    { key: 'name', header: 'Loan Name', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    { 
      key: 'balance', 
      header: 'Balance', 
      sortable: true, 
      render: (value) => `$${value.toLocaleString()}`
    },
    { 
      key: 'payment', 
      header: 'Min Payment', 
      sortable: true, 
      render: (value) => `$${value}`
    },
    { 
      key: 'rate', 
      header: 'Interest Rate', 
      sortable: true, 
      render: (value) => `${value}%`
    },
    { key: 'dueDate', header: 'Next Due', sortable: true },
    { 
      key: 'status', 
      header: 'Status', 
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'current' ? 'bg-green-100 text-green-800' :
          value === 'late' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Debt Management</h1>
        <p className="text-gray-600">Track and manage your debt obligations</p>
      </div>

      {/* Debt Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {debtSummaryMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Debt Composition and Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Debt Composition</h3>
          <div className="flex items-center justify-center">
            <PieChart data={debtComposition} size={250} />
          </div>
          <div className="mt-4 space-y-2">
            {debtComposition.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-semibold">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Debt Progress Over Time</h3>
          <LineChart 
            data={debtProgressData} 
            dataKey="balance" 
            color="#ef4444"
            height={280}
            showGrid={true}
          />
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Total reduction: <span className="font-semibold text-green-600">-$4,050</span> (6 months)
            </p>
          </div>
        </div>
      </div>

      {/* Strategy Comparison (Premium Feature) */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Debt Payoff Strategies</h3>
            <span className="ml-2 px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">PREMIUM</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">Current Method</h4>
            <p className="text-2xl font-bold text-gray-900 mb-1">32 months</p>
            <p className="text-sm text-gray-600">Total interest: $8,450</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-green-200 ring-2 ring-green-300">
            <h4 className="font-semibold text-green-900 mb-2">Debt Avalanche</h4>
            <p className="text-2xl font-bold text-green-900 mb-1">28 months</p>
            <p className="text-sm text-green-600">Total interest: $6,890</p>
            <p className="text-xs text-green-600 mt-1">Save $1,560!</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Debt Snowball</h4>
            <p className="text-2xl font-bold text-blue-900 mb-1">30 months</p>
            <p className="text-sm text-blue-600">Total interest: $7,340</p>
            <p className="text-xs text-blue-600 mt-1">Save $1,110!</p>
          </div>
        </div>
        <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Upgrade to Premium
        </button>
      </div>

      {/* Loan Overview Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Loan Overview</h3>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Add Debt
            </button>
          </div>
        </div>
        <Table 
          data={loanOverview} 
          columns={loanColumns}
          sortConfig={sortConfig}
          onSort={setSortConfig}
        />
      </div>

      {/* Payment Calendar */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Payments This Month</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loanOverview.map(loan => (
            <div key={loan.id} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{loan.name}</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="font-medium">{loan.dueDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">${loan.payment}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DebtsPage;