import React, { useState } from 'react';
import { CreditCard, TrendingDown, Plus } from 'lucide-react';
import MetricCard from './common/MetricCard';
import LineChart from './charts/LineChart';
import Table from './common/Table';

const LiabilitiesPage = () => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const liabilitySummary = {
    title: 'Total Liabilities',
    value: '$38,450.00',
    change: '-3.2%',
    trend: 'down',
    icon: CreditCard,
    color: 'red'
  };

  const liabilityTrendData = [
    { month: 'Jan', value: 42500 },
    { month: 'Feb', value: 41800 },
    { month: 'Mar', value: 41050 },
    { month: 'Apr', value: 40300 },
    { month: 'May', value: 39500 },
    { month: 'Jun', value: 38450 },
    { month: 'Jul', value: 37200 },
    { month: 'Aug', value: 36100 },
    { month: 'Sep', value: 35050 },
    { month: 'Oct', value: 34200 },
    { month: 'Nov', value: 33400 },
    { month: 'Dec', value: 32650 }
  ];

  const interestTrendData = [
    { month: 'Jan', value: 450 },
    { month: 'Feb', value: 445 },
    { month: 'Mar', value: 438 },
    { month: 'Apr', value: 430 },
    { month: 'May', value: 422 },
    { month: 'Jun', value: 410 },
  ];

  const liabilityDetails = [
    {
      id: 1,
      name: 'Chase Sapphire Credit Card',
      type: 'Credit Card',
      balance: 8500.00,
      minPayment: 255.00,
      interestRate: 18.9,
      dueDate: '2024-01-25',
      status: 'Current',
      lastPayment: '2023-12-25'
    },
    {
      id: 2,
      name: 'Capital One Quicksilver',
      type: 'Credit Card',
      balance: 10000.00,
      minPayment: 300.00,
      interestRate: 21.5,
      dueDate: '2024-01-28',
      status: 'Current',
      lastPayment: '2023-12-28'
    },
    {
      id: 3,
      name: 'Honda Civic Auto Loan',
      type: 'Auto Loan',
      balance: 12200.00,
      minPayment: 340.00,
      interestRate: 4.2,
      dueDate: '2024-01-15',
      status: 'Current',
      lastPayment: '2023-12-15'
    },
    {
      id: 4,
      name: 'Federal Student Loan',
      type: 'Student Loan',
      balance: 7750.00,
      minPayment: 125.00,
      interestRate: 5.8,
      dueDate: '2024-01-20',
      status: 'Current',
      lastPayment: '2023-12-20'
    }
  ];

  const liabilityColumns = [
    { key: 'name', header: 'Liability Name', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    { 
      key: 'balance', 
      header: 'Balance', 
      sortable: true, 
      render: (value) => `$${value.toLocaleString()}`
    },
    { 
      key: 'minPayment', 
      header: 'Min Payment', 
      sortable: true, 
      render: (value) => `$${value.toFixed(2)}`
    },
    { 
      key: 'interestRate', 
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
          value === 'Current' ? 'bg-green-100 text-green-800' :
          value === 'Late' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Liabilities Overview</h1>
        <p className="text-gray-600">Track your debts and payment obligations</p>
      </div>

      {/* Liability Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard {...liabilitySummary} />
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Monthly Payments</h3>
          <p className="text-2xl font-bold text-blue-600">$1,020.00</p>
          <p className="text-sm text-gray-600 mt-1">Fixed obligations</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Interest Paid (YTD)</h3>
          <p className="text-2xl font-bold text-red-600">$2,635.00</p>
          <p className="text-sm text-gray-600 mt-1">-8.2% vs last year</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Avg Interest Rate</h3>
          <p className="text-2xl font-bold text-yellow-600">12.8%</p>
          <p className="text-sm text-gray-600 mt-1">Weighted average</p>
        </div>
      </div>

      {/* Liability Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Liability Balance Trend</h3>
            <div className="text-sm text-gray-600">
              Reduction: <span className="font-semibold text-green-600">-$9,850</span>
            </div>
          </div>
          <LineChart 
            data={liabilityTrendData} 
            dataKey="value" 
            color="#ef4444"
            height={280}
            showGrid={true}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Interest Payments</h3>
            <div className="text-sm text-gray-600">
              Avg: <span className="font-semibold">$435</span>
            </div>
          </div>
          <LineChart 
            data={interestTrendData} 
            dataKey="value" 
            color="#f59e0b"
            height={280}
            showGrid={true}
          />
        </div>
      </div>

      {/* Debt-to-Income Analysis */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Debt-to-Income Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h4 className="font-semibold text-gray-900 mb-2">Current DTI Ratio</h4>
            <div className="relative">
              <div className="w-24 h-24 mx-auto rounded-full border-8 border-gray-200 border-t-yellow-500 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">19.6%</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Good (under 20%)</p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Breakdown</h4>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Income</span>
              <span className="font-semibold">$5,200.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Debt Payments</span>
              <span className="font-semibold text-red-600">$1,020.00</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600 font-medium">DTI Ratio</span>
              <span className="font-bold">19.6%</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Recommendations</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                DTI ratio is healthy
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Consider paying extra on highest interest debt
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Room for additional borrowing if needed
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Liability Types Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Credit Cards</h4>
          <p className="text-2xl font-bold text-red-600">$18,500</p>
          <p className="text-sm text-gray-600">2 accounts • 20.2% avg rate</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Auto Loans</h4>
          <p className="text-2xl font-bold text-blue-600">$12,200</p>
          <p className="text-sm text-gray-600">1 account • 4.2% rate</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Student Loans</h4>
          <p className="text-2xl font-bold text-purple-600">$7,750</p>
          <p className="text-sm text-gray-600">1 account • 5.8% rate</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Other Debt</h4>
          <p className="text-2xl font-bold text-gray-600">$0</p>
          <p className="text-sm text-gray-600">0 accounts</p>
        </div>
      </div>

      {/* Liability Details Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Liability Details</h3>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Liability
            </button>
          </div>
        </div>
        <Table 
          data={liabilityDetails} 
          columns={liabilityColumns}
          sortConfig={sortConfig}
          onSort={setSortConfig}
        />
      </div>

      {/* Payment Schedule */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Payment Schedule</h3>
        <div className="space-y-3">
          {liabilityDetails
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .map(liability => (
              <div key={liability.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">{liability.name}</p>
                    <p className="text-sm text-gray-600">Due: {liability.dueDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${liability.minPayment.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">{liability.type}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default LiabilitiesPage;