import React from 'react';
import type { CashflowProjection } from '../../types/current';

interface CashflowChartProps {
  data: CashflowProjection[];
}

const CashflowChart: React.FC<CashflowChartProps> = ({ data }) => {
  const maxBalance = Math.max(...data.map(d => Math.abs(d.balance)));
  const minBalance = Math.min(...data.map(d => d.balance));
  const range = maxBalance - minBalance;
  const chartHeight = 200;
  const chartWidth = 600;

  const getY = (balance: number) => {
    return chartHeight - ((balance - minBalance) / range) * chartHeight;
  };

  const pathData = data.map((item, index) => {
    const x = (index / (data.length - 1)) * chartWidth;
    const y = getY(item.balance);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">7-Day Cashflow Projection</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Actual</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 border-2 border-blue-500 border-dashed rounded-full mr-2"></div>
            <span className="text-gray-600">Projected</span>
          </div>
        </div>
      </div>

      <div className="relative" style={{ height: chartHeight + 40 }}>
        <svg 
          width="100%" 
          height={chartHeight} 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="overflow-visible"
        >
          {/* Zero line */}
          {minBalance < 0 && (
            <line
              x1="0"
              y1={getY(0)}
              x2={chartWidth}
              y2={getY(0)}
              stroke="#ef4444"
              strokeWidth="1"
              strokeDasharray="4,4"
              opacity="0.5"
            />
          )}

          {/* Area fill */}
          <path
            d={`${pathData} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`}
            fill={minBalance < 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'}
          />

          {/* Main line */}
          <path
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            className="drop-shadow-sm"
          />

          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * chartWidth;
            const y = getY(item.balance);
            
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill={item.isProjected ? 'white' : '#3b82f6'}
                  stroke="#3b82f6"
                  strokeWidth={item.isProjected ? "2" : "0"}
                  strokeDasharray={item.isProjected ? "2,2" : "0"}
                  className="hover:r-6 transition-all cursor-pointer"
                  onMouseEnter={(e) => {
                    const tooltip = document.createElement('div');
                    tooltip.id = 'cashflow-tooltip';
                    tooltip.className = 'absolute bg-gray-800 text-white px-3 py-2 rounded text-sm pointer-events-none z-50';
                    tooltip.innerHTML = `
                      <div class="font-semibold">${item.date}</div>
                      <div>Balance: NOK ${item.balance.toLocaleString()}</div>
                      ${item.netFlow !== 0 ? `<div>Net Flow: NOK ${item.netFlow.toLocaleString()}</div>` : ''}
                      <div class="text-xs opacity-75">${item.isProjected ? 'Projected' : 'Actual'}</div>
                    `;
                    document.body.appendChild(tooltip);
                    
                    const rect = e.currentTarget.getBoundingClientRect();
                    tooltip.style.left = `${rect.left - tooltip.offsetWidth / 2}px`;
                    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
                  }}
                  onMouseLeave={() => {
                    const tooltip = document.getElementById('cashflow-tooltip');
                    if (tooltip) tooltip.remove();
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {data.map((item, index) => (
            <span key={index} className={index % 2 === 0 ? '' : 'opacity-0'}>
              {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-sm text-gray-600">Current</div>
          <div className="font-semibold text-gray-900">
            NOK {data[0]?.balance.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Lowest Point</div>
          <div className={`font-semibold ${minBalance < 0 ? 'text-red-600' : 'text-gray-900'}`}>
            NOK {minBalance.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">After Payday</div>
          <div className="font-semibold text-green-600">
            NOK {data[data.length - 1]?.balance.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashflowChart;