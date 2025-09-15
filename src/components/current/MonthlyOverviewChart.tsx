import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { MonthlyData } from '../../types/current';

interface MonthlyOverviewChartProps {
  monthlyData: MonthlyData[];
}

const MonthlyOverviewChart: React.FC<MonthlyOverviewChartProps> = ({ monthlyData }) => {
  const maxValue = Math.max(
    ...monthlyData.flatMap(data => [data.income, Math.abs(data.expenses)])
  );
  
  const chartHeight = 300;
  const chartWidth = 600;
  const barWidth = 40;
  const barSpacing = 80;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Monthly Overview</h3>
        </div>
      </div>

      <div className="p-6">
        <div className="relative" style={{ height: chartHeight }}>
          <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={ratio}
                x1="50"
                y1={chartHeight * ratio}
                x2={chartWidth - 50}
                y2={chartHeight * ratio}
                stroke="#f1f3f4"
                strokeWidth="1"
              />
            ))}

            {/* Bars and cashflow line */}
            {monthlyData.map((data, index) => {
              const x = 80 + index * barSpacing;
              const incomeHeight = (data.income / maxValue) * (chartHeight - 60);
              const expenseHeight = (Math.abs(data.expenses) / maxValue) * (chartHeight - 60);
              
              return (
                <g key={data.month}>
                  {/* Income bar */}
                  <rect
                    x={x - barWidth}
                    y={chartHeight - 30 - incomeHeight}
                    width={barWidth}
                    height={incomeHeight}
                    fill="#10b981"
                    opacity="0.8"
                    rx="2"
                  />
                  
                  {/* Expense bar */}
                  <rect
                    x={x}
                    y={chartHeight - 30 - expenseHeight}
                    width={barWidth}
                    height={expenseHeight}
                    fill="#ef4444"
                    opacity="0.8"
                    rx="2"
                  />
                  
                  {/* Month label */}
                  <text
                    x={x}
                    y={chartHeight - 10}
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                  >
                    {data.month}
                  </text>
                </g>
              );
            })}

            {/* Cashflow line */}
            <path
              d={monthlyData.map((data, index) => {
                const x = 80 + index * barSpacing;
                const y = chartHeight - 30 - ((data.cashflow / maxValue) * (chartHeight - 60));
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeDasharray="5,5"
            />

            {/* Cashflow points */}
            {monthlyData.map((data, index) => {
              const x = 80 + index * barSpacing;
              const y = chartHeight - 30 - ((data.cashflow / maxValue) * (chartHeight - 60));
              
              return (
                <circle
                  key={`point-${index}`}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex justify-center items-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Income</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-3 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Expenses</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-0.5 bg-blue-500" style={{ 
              backgroundImage: 'repeating-linear-gradient(to right, #3b82f6 0, #3b82f6 5px, transparent 5px, transparent 10px)'
            }}></div>
            <span className="text-sm text-gray-600">Cashflow</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyOverviewChart;