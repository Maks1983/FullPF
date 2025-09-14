import React from 'react';
import { BarChart3, PieChart as PieChartIcon, Wallet } from 'lucide-react';
import BarChart from '../charts/BarChart';
import PieChart from '../charts/PieChart';
import LineChart from '../charts/LineChart';

interface ChartsSectionProps {
  cashflowData: Array<{ month: string; income: number; expenses: number; cashflow: number }>;
  portfolioData: Array<{ name: string; value: number; color: string; performance: string }>;
  netWorthData: Array<{ month: string; assets: number; liabilities: number; netWorth: number }>;
  timeframe: string;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({
  cashflowData,
  portfolioData,
  netWorthData,
  timeframe
}) => {
  return (
    <>
      {/* Main Analytics Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Cashflow Analysis - 8 columns */}
        <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Cashflow Analysis & Predictions</h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Net Avg:</span>
              <span className="font-semibold text-green-600">+NOK 11,250</span>
            </div>
          </div>
          <BarChart 
            data={cashflowData} 
            categories={['income', 'expenses']} 
            colors={['#10b981', '#ef4444']}
            height={350}
            showCashflowLine={true}
          />
        </div>

        {/* Portfolio Allocation - 4 columns */}
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <PieChartIcon className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Portfolio Mix</h3>
            </div>
          </div>
          <div className="flex items-center justify-center mb-4">
            <PieChart data={portfolioData} size={180} />
          </div>
          <div className="space-y-2">
            {portfolioData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{item.value.toLocaleString()}</div>
                  <div className={`text-xs ${item.performance.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {item.performance}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Net Worth Trend */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Wallet className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Net Worth Trend ({timeframe})</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Current:</span>
            <span className="font-semibold text-green-600">NOK {netWorthData[netWorthData.length - 1]?.netWorth.toLocaleString()}</span>
          </div>
        </div>
        <LineChart 
          data={netWorthData} 
          dataKey="netWorth" 
          color="#10b981"
          height={350}
          showGrid={true}
          showOverlay={true}
          overlayData={{
            assets: 'assets',
            liabilities: 'liabilities'
          }}
        />
      </div>
    </>
  );
};

export default ChartsSection;