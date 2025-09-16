import React, { useState } from 'react';
import { Wallet, TrendingUp, Download, Calculator } from 'lucide-react';
import { useNetWorthData } from '../hooks/useCentralizedData';
import MetricCard from './common/MetricCard';
import LineChart from './charts/LineChart';
import Table from './common/Table';

const NetWorthPage = () => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const netWorthData = useNetWorthData();

  const netWorthChange = 6.7; // This could be calculated from history
  const isPositive = netWorthData.netWorth > 0;

  const netWorthMetric = {
    title: 'Net Worth',
    value: `NOK ${netWorthData.netWorth.toLocaleString()}`,
    change: `+${netWorthChange}%`,
    trend: 'up',
    icon: Wallet,
    color: isPositive ? 'green' : 'red'
  };

  // Calculate projections based on current growth
  const avgMonthlyGrowth = 4500; // This could be calculated from history
  const projectionData = [
    { month: 'Jan 2025', value: netWorthData.netWorth + avgMonthlyGrowth },
    { month: 'Apr 2025', value: netWorthData.netWorth + (avgMonthlyGrowth * 4) },
    { month: 'Jul 2025', value: netWorthData.netWorth + (avgMonthlyGrowth * 7) },
    { month: 'Oct 2025', value: netWorthData.netWorth + (avgMonthlyGrowth * 10) },
    { month: 'Jan 2026', value: netWorthData.netWorth + (avgMonthlyGrowth * 13) },
  ];

  const breakdownColumns = [
    { 
      key: 'category', 
      header: 'Category', 
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'Assets' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'description', header: 'Description', sortable: true },
    { 
      key: 'value', 
      header: 'Value', 
      sortable: true, 
      render: (value) => (
        <span className={value > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
          {value > 0 ? '+' : ''}${Math.abs(value).toLocaleString()}
        </span>
      )
    },
    { 
      key: 'percentage', 
      header: '% of Category', 
      sortable: true, 
      render: (value) => `${value}%`
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Net Worth Overview</h1>
        <p className="text-gray-600">Your complete financial position (Assets - Liabilities)</p>
      </div>

      {/* Net Worth Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard {...netWorthMetric} />
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Assets</h3>
          <p className="text-2xl font-bold text-green-600">NOK {netWorthData.totalAssets.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">+2.8% this month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Liabilities</h3>
          <p className="text-2xl font-bold text-red-600">NOK {netWorthData.totalLiabilities.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">-3.2% this month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Assets to Liabilities</h3>
          <p className="text-2xl font-bold text-blue-600">{netWorthData.assetLiabilityRatio.toFixed(1)}:1</p>
          <p className="text-sm text-gray-600 mt-1">Ratio</p>
        </div>
      </div>

      {/* Net Worth Progress */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Net Worth Trend (12 Months)</h3>
          <div className="text-sm text-gray-600">
            Growth: <span className="font-semibold text-green-600">+NOK {(netWorthData.netWorth - netWorthData.netWorthHistory[0].netWorth).toLocaleString()}</span>
          </div>
        </div>
        <LineChart 
          data={netWorthData.netWorthHistory} 
          dataKey="netWorth" 
          color="#10b981"
          height={300}
          showGrid={true}
        />
      </div>

      {/* Goals and Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Net Worth Goals</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Short-term Goal (1 Year)</p>
                <p className="text-sm text-gray-600">Target: NOK 3,500,000</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">{((netWorthData.netWorth / 3500000) * 100).toFixed(0)}%</p>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: `${Math.min((netWorthData.netWorth / 3500000) * 100, 100)}%`}}></div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Medium-term Goal (5 Years)</p>
                <p className="text-sm text-gray-600">Target: $200,000</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-blue-600">52%</p>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '52%'}}></div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Long-term Goal (10 Years)</p>
                <p className="text-sm text-gray-600">Target: $500,000</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-purple-600">21%</p>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '21%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Projections</h3>
          <LineChart 
            data={projectionData} 
            dataKey="value" 
            color="#3b82f6"
            height={200}
            showGrid={true}
          />
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Projected 1-year growth: <span className="font-semibold text-blue-600">+$24,150</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Based on current savings and investment trends
            </p>
          </div>
        </div>
      </div>

      {/* Financial Ratios */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Health Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Calculator className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">Debt-to-Asset Ratio</h4>
            <p className="text-2xl font-bold text-green-600">27%</p>
            <p className="text-sm text-green-600">Excellent</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">Savings Rate</h4>
            <p className="text-2xl font-bold text-blue-600">25%</p>
            <p className="text-sm text-blue-600">Very Good</p>
          </div>

          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <Wallet className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">Liquidity Ratio</h4>
            <p className="text-2xl font-bold text-yellow-600">2.8</p>
            <p className="text-sm text-yellow-600">Good</p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">Growth Rate</h4>
            <p className="text-2xl font-bold text-purple-600">18%</p>
            <p className="text-sm text-purple-600">Excellent</p>
          </div>
        </div>
      </div>

      {/* Net Worth Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Net Worth Breakdown</h3>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Export Statement
            </button>
          </div>
        </div>
        <Table 
          data={netWorthData.breakdown} 
          columns={breakdownColumns}
          sortConfig={sortConfig}
          onSort={setSortConfig}
        />
      </div>

      {/* Financial Statement Preview */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Personal Financial Statement</h3>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </button>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <div className="max-w-md mx-auto">
              <h4 className="text-xl font-bold text-gray-900 mb-2">Personal Financial Statement</h4>
              <p className="text-gray-600 mb-4">As of {new Date().toLocaleDateString()}</p>
              
              <div className="bg-white p-4 rounded border text-left">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-semibold mb-2">Assets</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li className="flex justify-between">
                        <span>Cash & Savings</span>
                        <span>NOK {netWorthData.breakdown.filter(item => item.category === 'Assets' && (item.type === 'Cash' || item.type === 'Savings')).reduce((sum, item) => sum + item.value, 0).toLocaleString()}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Investments</span>
                        <span>NOK {netWorthData.breakdown.filter(item => item.category === 'Assets' && item.type === 'Investment').reduce((sum, item) => sum + item.value, 0).toLocaleString()}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Real Estate</span>
                        <span>NOK {netWorthData.breakdown.filter(item => item.category === 'Assets' && item.type === 'Real Estate').reduce((sum, item) => sum + item.value, 0).toLocaleString()}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Other Assets</span>
                        <span>NOK {netWorthData.breakdown.filter(item => item.category === 'Assets' && item.type === 'Vehicle').reduce((sum, item) => sum + item.value, 0).toLocaleString()}</span>
                      </li>
                    </ul>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total Assets</span>
                        <span>NOK {netWorthData.totalAssets.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold mb-2">Liabilities</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li className="flex justify-between">
                        <span>Credit Cards</span>
                        <span>NOK {netWorthData.breakdown.filter(item => item.category === 'Liabilities' && item.type === 'Credit Card').reduce((sum, item) => sum + Math.abs(item.value), 0).toLocaleString()}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Auto Loan</span>
                        <span>NOK {netWorthData.breakdown.filter(item => item.category === 'Liabilities' && item.type === 'Auto Loan').reduce((sum, item) => sum + Math.abs(item.value), 0).toLocaleString()}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Student Loan</span>
                        <span>NOK {netWorthData.breakdown.filter(item => item.category === 'Liabilities' && item.type === 'Student Loan').reduce((sum, item) => sum + Math.abs(item.value), 0).toLocaleString()}</span>
                      </li>
                    </ul>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total Liabilities</span>
                        <span>NOK {netWorthData.totalLiabilities.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t-2 pt-4 mt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Net Worth</span>
                    <span className="text-green-600">NOK {netWorthData.netWorth.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Generate Full Statement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetWorthPage;