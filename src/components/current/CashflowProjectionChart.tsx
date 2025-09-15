import React from 'react';
import { TrendingDown, AlertTriangle, Calendar, Star, Lock } from 'lucide-react';
import type { CashflowProjection } from '../../types/current';

interface CashflowProjectionChartProps {
  projections: CashflowProjection[];
  daysUntilDeficit: number;
}

const CashflowProjectionChart: React.FC<CashflowProjectionChartProps> = ({
  projections,
  daysUntilDeficit
}) => {
  const maxBalance = Math.max(...projections.map(p => p.projectedBalance));
  const minBalance = Math.min(...projections.map(p => p.projectedBalance));
  const range = maxBalance - minBalance;
  const hasDeficit = minBalance < 0;
  
  const chartHeight = 200;
  const chartWidth = 600;
  
  // Premium feature - show only 7 days for free users
  const freeProjections = projections.slice(0, 7);
  const premiumProjections = projections.slice(7);

  const getY = (balance: number) => {
    if (range === 0) return chartHeight / 2;
    return chartHeight - ((balance - minBalance) / range) * chartHeight;
  };

  const pathData = freeProjections.map((proj, index) => {
    const x = (index / (freeProjections.length - 1)) * chartWidth;
    const y = getY(proj.projectedBalance);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className={`bg-white rounded-xl shadow-sm border transition-all hover:shadow-md ${
      hasDeficit ? 'border-red-200' : 'border-gray-200'
    }`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${hasDeficit ? 'bg-red-100' : 'bg-blue-100'}`}>
              <TrendingDown className={`h-5 w-5 ${hasDeficit ? 'text-red-600' : 'text-blue-600'}`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">7-Day Cashflow Projection</h3>
              <p className="text-sm text-gray-600">
                Balance forecast with scheduled payments
              </p>
            </div>
          </div>
          {hasDeficit && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm font-medium">
                Deficit in {daysUntilDeficit} days
              </span>
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="relative mb-6" style={{ height: chartHeight }}>
          <svg 
            width="100%" 
            height="100%" 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="overflow-visible"
          >
            {/* Zero line */}
            {minBalance < 0 && maxBalance > 0 && (
              <line
                x1="0"
                y1={getY(0)}
                x2={chartWidth}
                y2={getY(0)}
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="4,4"
                opacity="0.5"
              />
            )}
            
            {/* Area fill */}
            <path
              d={`M 0 ${chartHeight} ${pathData} L ${chartWidth} ${chartHeight} Z`}
              fill={hasDeficit ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'}
            />
            
            {/* Main line */}
            <path
              d={pathData}
              fill="none"
              stroke={hasDeficit ? '#ef4444' : '#3b82f6'}
              strokeWidth="3"
              className="drop-shadow-sm"
            />
            
            {/* Data points */}
            {freeProjections.map((proj, index) => {
              const x = (index / (freeProjections.length - 1)) * chartWidth;
              const y = getY(proj.projectedBalance);
              const isDeficit = proj.projectedBalance < 0;
              
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill={isDeficit ? '#ef4444' : '#3b82f6'}
                  stroke="white"
                  strokeWidth="2"
                  className="hover:r-6 transition-all cursor-pointer"
                  onMouseEnter={(e) => {
                    const tooltip = document.createElement('div');
                    tooltip.id = 'cashflow-tooltip';
                    tooltip.className = 'absolute bg-gray-800 text-white px-3 py-2 rounded text-sm pointer-events-none z-50';
                    tooltip.innerHTML = `
                      <div class="font-medium">${new Date(proj.date).toLocaleDateString()}</div>
                      <div>Balance: NOK ${proj.projectedBalance.toLocaleString()}</div>
                      <div>Net Flow: NOK ${proj.netFlow.toLocaleString()}</div>
                    `;
                    document.body.appendChild(tooltip);
                    
                    const rect = e.currentTarget.getBoundingClientRect();
                    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
                    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
                  }}
                  onMouseLeave={() => {
                    const tooltip = document.getElementById('cashflow-tooltip');
                    if (tooltip) tooltip.remove();
                  }}
                />
              );
            })}
          </svg>
        </div>

        {/* Date labels */}
        <div className="flex justify-between text-xs text-gray-500 mb-4">
          {freeProjections.map((proj, index) => (
            <span key={index} className="text-center">
              {new Date(proj.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          ))}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">
              NOK {freeProjections[0].projectedBalance.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Current Balance</p>
          </div>
          <div className="text-center">
            <p className={`text-lg font-bold ${minBalance < 0 ? 'text-red-600' : 'text-green-600'}`}>
              NOK {minBalance.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Lowest Point</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">
              NOK {freeProjections[freeProjections.length - 1].projectedBalance.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">End of Period</p>
          </div>
        </div>
      </div>
      
      {/* Premium Upgrade Section */}
      {premiumProjections.length > 0 && (
        <div className="border-t bg-gradient-to-r from-purple-50 to-blue-50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Extended Cashflow Projections</h4>
                <p className="text-sm text-gray-600">
                  See up to 30 days ahead with premium insights
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-purple-600">+{premiumProjections.length} more days</p>
                <p className="text-xs text-gray-500">Premium feature</p>
              </div>
              <Lock className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
            Upgrade to Premium
          </button>
        </div>
      )}
    </div>
  );
};
export default CashflowProjectionChart;