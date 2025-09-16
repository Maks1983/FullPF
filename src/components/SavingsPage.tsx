import React, { useState } from 'react';
import { TrendingUp, Plus, Filter } from 'lucide-react';
import { useSavingsData } from '../hooks/useCentralizedData';
import DoughnutChart from './charts/DoughnutChart';
import LineChart from './charts/LineChart';
import Table from './common/Table';
import MetricCard from './common/MetricCard';

const SavingsPage = () => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const savingsData = useSavingsData();
  
  const coveragePercentage = (savingsData.currentSavings / savingsData.savingsGoal) * 100;

  // Calculate monthly change from savings history
  const monthlyChangeData = savingsData.monthlyGrowth.slice(-3).map((item, index, arr) => ({
    month: item.month,
    value: index > 0 ? item.value - arr[index - 1].value : 0
  })).filter(item => item.value > 0);

  // Project next 3 months based on current trend
  const avgMonthlyGrowth = monthlyChangeData.reduce((sum, item) => sum + item.value, 0) / monthlyChangeData.length;
  const projectionData = [
    { month: 'Jan', value: savingsData.currentSavings + avgMonthlyGrowth },
    { month: 'Feb', value: savingsData.currentSavings + (avgMonthlyGrowth * 2) },
    { month: 'Mar', value: savingsData.currentSavings + (avgMonthlyGrowth * 3) },
  ];

  const recentTransactions = [
    { id: 1, date: '2024-01-12', description: 'Emergency Fund Deposit', amount: 5000.00, type: 'deposit', account: 'High Yield Savings' },
    { id: 2, date: '2024-01-10', description: 'Monthly Auto Transfer', amount: 7500.00, type: 'deposit', account: 'Investment Savings' },
    { id: 3, date: '2024-01-08', description: 'Car Repair Emergency', amount: -12000.00, type: 'withdrawal', account: 'Emergency Fund' },
    { id: 4, date: '2024-01-05', description: 'Interest Payment', amount: 452.00, type: 'interest', account: 'High Yield Savings' },
    { id: 5, date: '2024-01-01', description: 'New Year Bonus', amount: 20000.00, type: 'deposit', account: 'Investment Savings' },
  ];

  const savingsMetrics = [
    {
      title: 'Monthly Change',
      value: `+${avgMonthlyGrowth.toFixed(0)} NOK`,
      change: '+6.65%',
      trend: 'up',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: '3-Month Projection',
      value: `${projectionData[2].value.toLocaleString()} NOK`,
      change: '+18.0%',
      trend: 'up',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      title: 'Annual Growth Rate',
      value: `${savingsData.savingsRate.toFixed(1)}%`,
      change: '+6.65%',
      trend: 'up',
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  const transactionColumns = [
    { key: 'date', header: 'Date', sortable: true },
    { key: 'description', header: 'Description', sortable: true },
    { key: 'account', header: 'Account', sortable: true },
    { 
      key: 'type', 
      header: 'Type', 
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'deposit' ? 'bg-green-100 text-green-800' :
          value === 'withdrawal' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    { 
      key: 'amount', 
      header: 'Amount', 
      sortable: true, 
      render: (value) => (
        <span className={value > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
          {value > 0 ? '+' : ''}{value.toLocaleString()} NOK
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Savings Overview</h1>
        <p className="text-gray-600">Track your savings progress and goals</p>
      </div>

      {/* Savings Progress */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Goal Progress</h3>
          <div className="flex items-center justify-center mb-4">
            <DoughnutChart 
              value={savingsData.currentSavings} 
              total={savingsData.savingsGoal} 
              color="#10b981"
              size={120}
              centerText={`${coveragePercentage.toFixed(0)}%`}
            />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {savingsData.currentSavings.toLocaleString()} of {savingsData.savingsGoal.toLocaleString()} NOK
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {(savingsData.savingsGoal - savingsData.currentSavings).toLocaleString()} NOK remaining
            </p>
          </div>
        </div>

        {savingsMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Change */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Change (3 Months)</h3>
          <LineChart 
            data={monthlyChangeData} 
            dataKey="value" 
            color="#10b981"
            height={200}
            showGrid={true}
          />
        </div>

        {/* 3-Month Projection */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">3-Month Projection</h3>
          <LineChart 
            data={projectionData} 
            dataKey="value" 
            color="#3b82f6"
            height={200}
            showGrid={true}
          />
        </div>

        {/* Growth Rate */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Rate (Annualized)</h3>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">8.4%</div>
              <div className="text-sm text-gray-600">Annual Growth</div>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Growth Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Savings Growth (12 Months)</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Target:</span>
            <span className="text-sm font-semibold text-green-600">{savingsGoal.toLocaleString()} NOK</span>
          </div>
        </div>
        <LineChart 
          data={savingsData.monthlyGrowth} 
          dataKey="value" 
          color="#10b981"
          height={300}
          showGrid={true}
          targetLine={savingsData.savingsGoal}
        />
      </div>

      {/* Savings Accounts Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Fund</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Current Balance</span>
              <span className="font-semibold">82,000 NOK</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Goal (6 months)</span>
              <span className="font-semibold">120,000 NOK</span>
            </div>
            <div className="bg-gray-200 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full" style={{width: '68%'}}></div>
            </div>
            <p className="text-sm text-gray-600">68% complete</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">High Yield Savings</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Balance</span>
              <span className="font-semibold">47,200 NOK</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Interest Rate</span>
              <span className="font-semibold text-green-600">4.2% APY</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Interest</span>
              <span className="font-semibold text-green-600">+165 NOK</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Savings</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Balance</span>
              <span className="font-semibold">25,000 NOK</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">YTD Return</span>
              <span className="font-semibold text-green-600">+8.4%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Auto Transfer</span>
              <span className="font-semibold">7,500 NOK/month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <div className="flex space-x-2">
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Deposit
              </button>
            </div>
          </div>
        </div>
        <Table 
          data={recentTransactions} 
          columns={transactionColumns}
          sortConfig={sortConfig}
          onSort={setSortConfig}
        />
      </div>
    </div>
  );
};

export default SavingsPage;