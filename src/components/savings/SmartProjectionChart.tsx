import React from 'react';
import { TrendingUp, BarChart3, Star } from 'lucide-react';
import LineChart from '../charts/LineChart';
import { useLicenseGating } from '../../hooks/useLicenseGating';

interface SmartProjectionChartProps {
  currentSavings: number;
  monthlyGrowth: Array<{ month: string; value: number }>;
  projectionMode: 'conservative' | 'expected' | 'optimistic';
  onProjectionModeChange: (mode: 'conservative' | 'expected' | 'optimistic') => void;
}

const SmartProjectionChart: React.FC<SmartProjectionChartProps> = ({
  currentSavings,
  monthlyGrowth,
  projectionMode,
  onProjectionModeChange
}) => {
  const { canUseAdvancedAnalytics, getUpgradeMessage } = useLicenseGating();

  if (!canUseAdvancedAnalytics) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-purple-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-purple-900">
              Smart Projection Chart
            </h3>
            <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
              PREMIUM
            </span>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6 mb-4 border border-purple-100">
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <div className="h-4 bg-gray-300 rounded animate-pulse w-48 mx-auto"></div>
            </div>
          </div>
        </div>

        <p className="mb-4 text-purple-800">
          {getUpgradeMessage('advancedAnalytics')}
        </p>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Upgrade to Premium
        </button>
      </div>
    );
  }
  // Generate projection scenarios
  const generateProjections = () => {
    const baseGrowth = 8000; // Current monthly average
    const scenarios = {
      conservative: baseGrowth * 0.7, // 70% of current
      expected: baseGrowth,           // Current trend
      optimistic: baseGrowth * 1.3    // 130% of current
    };

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      conservative: currentSavings + (scenarios.conservative * (index + 1)),
      expected: currentSavings + (scenarios.expected * (index + 1)),
      optimistic: currentSavings + (scenarios.optimistic * (index + 1))
    }));
  };

  const projectionData = generateProjections();
  const selectedData = projectionData.map(item => ({
    month: item.month,
    value: item[projectionMode]
  }));

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'conservative': return '#ef4444';
      case 'expected': return '#3b82f6';
      case 'optimistic': return '#10b981';
      default: return '#3b82f6';
    }
  };

  const getModeDescription = (mode: string) => {
    switch (mode) {
      case 'conservative': return 'Lower deposits, modest interest';
      case 'expected': return 'Current trend continues';
      case 'optimistic': return 'Higher deposits or bonuses';
      default: return 'Current trend continues';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">6-Month Savings Projection</h3>
            <p className="text-sm text-gray-600">Three scenarios based on your patterns</p>
          </div>
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
        {(['conservative', 'expected', 'optimistic'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => onProjectionModeChange(mode)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              projectionMode === mode
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="text-center">
              <div className="font-semibold capitalize">{mode}</div>
              <div className="text-xs text-gray-500 mt-1">
                {getModeDescription(mode)}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Chart with Scenario Bands */}
      <div className="relative">
        <LineChart
          data={selectedData}
          dataKey="value"
          color={getModeColor(projectionMode)}
          height={300}
          showGrid={true}
        />
        
        {/* Scenario Bands Overlay */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <svg width="100%" height="100%" className="opacity-20">
            {/* Conservative band */}
            <path
              d={`M 0 ${300 - ((projectionData[0].conservative - currentSavings) / (projectionData[5].optimistic - currentSavings)) * 250} ${projectionData.map((item, index) => {
                const x = (index / (projectionData.length - 1)) * 100;
                const y = 300 - ((item.conservative - currentSavings) / (projectionData[5].optimistic - currentSavings)) * 250;
                return `L ${x}% ${y}`;
              }).join(' ')}`}
              fill="rgba(239, 68, 68, 0.1)"
              stroke="rgba(239, 68, 68, 0.3)"
              strokeWidth="1"
            />
            
            {/* Optimistic band */}
            <path
              d={`M 0 ${300 - ((projectionData[0].optimistic - currentSavings) / (projectionData[5].optimistic - currentSavings)) * 250} ${projectionData.map((item, index) => {
                const x = (index / (projectionData.length - 1)) * 100;
                const y = 300 - ((item.optimistic - currentSavings) / (projectionData[5].optimistic - currentSavings)) * 250;
                return `L ${x}% ${y}`;
              }).join(' ')}`}
              fill="rgba(16, 185, 129, 0.1)"
              stroke="rgba(16, 185, 129, 0.3)"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>

      {/* Projection Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        {(['conservative', 'expected', 'optimistic'] as const).map((mode) => {
          const finalValue = projectionData[projectionData.length - 1][mode];
          const growth = finalValue - currentSavings;
          
          return (
            <div
              key={mode}
              className={`p-3 rounded-lg border transition-all ${
                projectionMode === mode
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="text-lg font-bold text-gray-900">
                NOK {finalValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 capitalize">{mode}</div>
              <div className="text-xs text-green-600 font-medium">
                +NOK {growth.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivational Insight */}
      <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
        <p className="text-sm text-gray-700 text-center">
          💡 <strong>Power Move:</strong> Adding just NOK 500 more per month could boost your 6-month total by NOK 3,000! That's the power of consistent action.
        </p>
      </div>
    </div>
  );
};

export default SmartProjectionChart;