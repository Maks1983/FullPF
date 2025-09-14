import React from 'react';

interface LineChartProps {
  data: Array<{ month: string; [key: string]: any }>;
  dataKey: string;
  color: string;
  height?: number;
  showGrid?: boolean;
  targetLine?: number;
  showOverlay?: boolean;
  overlayData?: {
    assets?: string;
    liabilities?: string;
  };
}

const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  dataKey, 
  color, 
  height = 300, 
  showGrid = false,
  targetLine,
  showOverlay = false,
  overlayData
}) => {
  const values = data.map(item => item[dataKey]);
  const assetsValues = showOverlay && overlayData?.assets ? data.map(item => Math.abs(item[overlayData.assets])) : [];
  const liabilitiesValues = showOverlay && overlayData?.liabilities ? data.map(item => Math.abs(item[overlayData.liabilities])) : [];
  const maxValue = Math.max(...values, targetLine || 0, ...assetsValues, ...liabilitiesValues);
  const minValue = showOverlay ? 0 : Math.min(...values);
  const range = maxValue - minValue;
  const chartHeight = height - 80; // Account for labels and padding
  const chartWidth = 800; // Fixed width for proper spacing

  const getY = (value: number) => {
    return chartHeight - ((value - minValue) / range) * chartHeight;
  };

  const pathData = data.map((item, index) => {
    const x = 40 + (index * ((chartWidth - 80) / (data.length - 1)));
    const y = getY(item[dataKey]);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="w-full" style={{ height }}>
      <div className="relative w-full" style={{ height: chartHeight }}>
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          {/* Grid lines */}
          {showGrid && (
            <g>
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                <line
                  key={ratio}
                  x1="40"
                  y1={chartHeight * ratio}
                  x2={chartWidth - 40}
                  y2={chartHeight * ratio}
                  stroke="#f1f3f4"
                  strokeWidth="0.5"
                />
              ))}
              {/* Y-axis labels */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const value = minValue + (range * (1 - ratio));
                const y = chartHeight * ratio;
                return (
                  <text
                    key={index}
                    x="35"
                    y={y + 3}
                    textAnchor="end"
                    className="text-xs"
                    fill="#6b7280"
                    fontSize="11"
                  >
                    {value >= 1000 ? `${Math.round(value / 1000)}k` : Math.round(value)}
                  </text>
                );
              })}
            </g>
          )}
          
          {/* Overlay areas for assets and liabilities */}
          {showOverlay && overlayData && (
            <g>
              {/* Liabilities area - render first so it's behind assets */}
              {overlayData.liabilities && (
                <path
                  d={`M 40 ${chartHeight} ${data.map((item, index) => {
                    const x = 40 + (index * ((chartWidth - 80) / (data.length - 1)));
                    const y = getY(Math.abs(item[overlayData.liabilities]));
                    return `L ${x} ${y}`;
                  }).join(' ')} L ${40 + ((data.length - 1) * ((chartWidth - 80) / (data.length - 1)))} ${chartHeight} Z`}
                  fill="rgba(239, 68, 68, 0.15)"
                  stroke="rgba(239, 68, 68, 0.4)"
                  strokeWidth="1"
                />
              )}
              
              {/* Assets area - render second so it's on top */}
              {overlayData.assets && (
                <path
                  d={`M 40 ${chartHeight} ${data.map((item, index) => {
                    const x = 40 + (index * ((chartWidth - 80) / (data.length - 1)));
                    const y = getY(item[overlayData.assets]);
                    return `L ${x} ${y}`;
                  }).join(' ')} L ${40 + ((data.length - 1) * ((chartWidth - 80) / (data.length - 1)))} ${chartHeight} Z`}
                  fill="rgba(59, 130, 246, 0.12)"
                  stroke="rgba(59, 130, 246, 0.35)"
                  strokeWidth="1"
                />
              )}
            </g>
          )}
          
          {/* Target line */}
          {targetLine && (
            <line
              x1="40"
              y1={getY(targetLine)}
              x2={chartWidth - 40}
              y2={getY(targetLine)}
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="4,4"
              className="opacity-60"
            />
          )}
          
          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="3"
            className="drop-shadow-sm"
          />
          
          {/* Data points */}
          {data.map((item, index) => (
            <circle
              key={index}
              cx={40 + (index * ((chartWidth - 80) / (data.length - 1)))}
              cy={getY(item[dataKey])}
              r="4"
              fill={color}
              stroke="white"
              strokeWidth="2"
              className="hover:r-4 transition-all cursor-pointer"
              onMouseEnter={(e) => {
                // Create tooltip
                const tooltip = document.createElement('div');
                tooltip.id = 'line-chart-tooltip';
                tooltip.className = 'absolute bg-gray-800 text-white px-2 py-1 rounded text-sm pointer-events-none z-50';
                tooltip.textContent = `${item.month}: ${item[dataKey].toLocaleString()}`;
                document.body.appendChild(tooltip);
                
                const rect = e.currentTarget.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
              }}
              onMouseLeave={() => {
                // Remove tooltip
                const tooltip = document.getElementById('line-chart-tooltip');
                if (tooltip) {
                  tooltip.remove();
                }
              }}
            />
          ))}
        </svg>
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between mt-4 px-10">
        {data.map((item, index) => (
          <span key={index} className="text-xs font-medium text-gray-500">
            {item.month}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LineChart;