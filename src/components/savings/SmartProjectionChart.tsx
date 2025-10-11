import React from 'react';
import { TrendingUp, BarChart3, Star } from 'lucide-react';
import LineChart from '../charts/LineChart';

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

      {/* Chart */}
      <div>
        <LineChart
          data={selectedData}
          dataKey="value"
          color={getModeColor(projectionMode)}
          height={300}
          showGrid={true}
        />
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