import React, { useState } from 'react';
import { Building, TrendingUp, Star, Plus, Download } from 'lucide-react';
import MetricCard from './common/MetricCard';
import LineChart from './charts/LineChart';
import Table from './common/Table';

const AssetsPage = () => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const assetSummary = {
    title: 'Total Assets',
    value: '$142,300.00',
    change: '+2.8%',
    trend: 'up',
    icon: Building,
    color: 'blue'
  };

  const assetGrowthData = [
    { month: 'Jan', value: 135000 },
    { month: 'Feb', value: 136500 },
    { month: 'Mar', value: 138200 },
    { month: 'Apr', value: 139100 },
    { month: 'May', value: 140800 },
    { month: 'Jun', value: 142300 },
    { month: 'Jul', value: 144200 },
    { month: 'Aug', value: 145800 },
    { month: 'Sep', value: 147500 },
    { month: 'Oct', value: 149200 },
    { month: 'Nov', value: 150900 },
    { month: 'Dec', value: 152600 }
  ];

  const assetBreakdown = [
    {
      id: 1,
      type: 'Real Estate',
      name: 'Primary Residence',
      value: 85000,
      currency: 'USD',
      growth: 3.2,
      liquidity: 'Low'
    },
    {
      id: 2,
      type: 'Investment',
      name: 'Stock Portfolio',
      value: 24890,
      currency: 'USD',
      growth: 12.4,
      liquidity: 'High'
    },
    {
      id: 3,
      type: 'Cash',
      name: 'High Yield Savings',
      value: 15420,
      currency: 'USD',
      growth: 4.2,
      liquidity: 'High'
    },
    {
      id: 4,
      type: 'Vehicle',
      name: '2022 Honda Civic',
      value: 18500,
      currency: 'USD',
      growth: -8.5,
      liquidity: 'Medium'
    },
    {
      id: 5,
      type: 'Cryptocurrency',
      name: 'Bitcoin & Ethereum',
      value: 3200,
      currency: 'USD',
      growth: 28.7,
      liquidity: 'High'
    },
    {
      id: 6,
      type: 'Collectibles',
      name: 'Trading Cards Collection',
      value: 1200,
      currency: 'USD',
      growth: 15.2,
      liquidity: 'Low'
    }
  ];

  const assetColumns = [
    { key: 'type', header: 'Type', sortable: true },
    { key: 'name', header: 'Asset Name', sortable: true },
    { 
      key: 'value', 
      header: 'Current Value', 
      sortable: true, 
      render: (value, row) => `${row.currency === 'USD' ? '$' : row.currency}${value.toLocaleString()}`
    },
    { 
      key: 'growth', 
      header: 'YTD Growth', 
      sortable: true, 
      render: (value) => (
        <span className={value > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
          {value > 0 ? '+' : ''}{value}%
        </span>
      )
    },
    { 
      key: 'liquidity', 
      header: 'Liquidity', 
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'High' ? 'bg-green-100 text-green-800' :
          value === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Asset Management</h1>
        <p className="text-gray-600">Overview of all your assets and their performance</p>
      </div>

      {/* Asset Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard {...assetSummary} />
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Liquid Assets</h3>
          <p className="text-2xl font-bold text-green-600">$43,510.00</p>
          <p className="text-sm text-gray-600 mt-1">30.6% of total</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Illiquid Assets</h3>
          <p className="text-2xl font-bold text-blue-600">$86,200.00</p>
          <p className="text-sm text-gray-600 mt-1">60.6% of total</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Medium Liquidity</h3>
          <p className="text-2xl font-bold text-yellow-600">$18,500.00</p>
          <p className="text-sm text-gray-600 mt-1">13.0% of total</p>
        </div>
      </div>

      {/* Asset Growth Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">12-Month Asset Growth</h3>
          <div className="text-sm text-gray-600">
            Growth: <span className="font-semibold text-green-600">+13.1%</span>
          </div>
        </div>
        <LineChart 
          data={assetGrowthData} 
          dataKey="value" 
          color="#3b82f6"
          height={300}
          showGrid={true}
        />
      </div>

      {/* Premium Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Valuation Analytics */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Star className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Valuation Analytics</h3>
            <span className="ml-2 px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">PREMIUM</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Professional Valuation</span>
              <span className="font-semibold">$148,250.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Market Estimate</span>
              <span className="font-semibold">$142,300.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Potential Variance</span>
              <span className="font-semibold text-green-600">+$5,950.00</span>
            </div>
          </div>
          <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Get Professional Valuation
          </button>
        </div>

        {/* Risk Assessment */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Star className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Risk & Performance</h3>
            <span className="ml-2 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">PREMIUM</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Risk Score</span>
              <span className="font-semibold text-yellow-600">Medium (6/10)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Diversification</span>
              <span className="font-semibold text-green-600">Good</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Performance vs Market</span>
              <span className="font-semibold text-green-600">+2.4%</span>
            </div>
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            View Risk Analysis
          </button>
        </div>
      </div>

      {/* Asset Allocation Chart (Premium) */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-gray-900">Asset Allocation & Projections</h3>
            <span className="ml-2 px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-full">PREMIUM</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Real Estate</h4>
            <p className="text-2xl font-bold text-blue-600">59.8%</p>
            <p className="text-sm text-gray-600">$85,000</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Investments</h4>
            <p className="text-2xl font-bold text-green-600">19.7%</p>
            <p className="text-sm text-gray-600">$28,090</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Cash</h4>
            <p className="text-2xl font-bold text-yellow-600">10.8%</p>
            <p className="text-sm text-gray-600">$15,420</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Other</h4>
            <p className="text-2xl font-bold text-purple-600">9.7%</p>
            <p className="text-sm text-gray-600">$13,790</p>
          </div>
        </div>
      </div>

      {/* Asset Breakdown Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Asset Breakdown</h3>
            <div className="flex space-x-2">
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Asset
              </button>
            </div>
          </div>
        </div>
        <Table 
          data={assetBreakdown} 
          columns={assetColumns}
          sortConfig={sortConfig}
          onSort={setSortConfig}
        />
      </div>

      {/* Asset Report Preview (Premium) */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-gray-900">Asset Report Preview</h3>
            <span className="ml-2 px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">PREMIUM</span>
          </div>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Download Full Report
          </button>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Asset Report</h4>
            <p className="text-gray-600 mb-4">
              Get detailed insights including market analysis, growth projections, 
              risk assessments, and personalized recommendations.
            </p>
            <ul className="text-left text-sm text-gray-600 mb-4 max-w-md mx-auto">
              <li>• Asset valuation and market trends</li>
              <li>• Risk analysis and diversification recommendations</li>
              <li>• Tax optimization strategies</li>
              <li>• Liquidity planning and emergency fund analysis</li>
              <li>• Performance benchmarking</li>
            </ul>
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Generate Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetsPage;