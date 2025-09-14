import React from 'react';

interface BarChartProps {
  data: Array<{ month: string; [key: string]: any }>;
  categories: string[];
  colors: string[];
  height?: number;
  showCashflowLine?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  categories, 
  colors, 
  height = 350, 
  showCashflowLine = false 
}) => {
  const maxValue = Math.max(...data.flatMap(item => categories.map(cat => item[cat] || 0)));
  const maxCashflow = showCashflowLine ? Math.max(...data.map(item => Math.abs(item.cashflow || 0))) : 0;
  const chartMax = Math.max(maxValue, maxCashflow) * 1.1;
  
  const chartHeight = height - 100;
  const chartWidth = 800; // Increased width for proper month spacing
  const barGroupWidth = 80 / data.length;
  const barWidth = barGroupWidth / categories.length * 0.7;
  const barSpacing = barGroupWidth * 0.15;

  // Y-axis grid lines and labels
  const yAxisSteps = 5;
  const yAxisLabels = Array.from({ length: yAxisSteps + 1 }, (_, i) => {
    const value = (chartMax / yAxisSteps) * i;
    return Math.round(value / 1000) * 1000;
  });

  return (
    <div className="w-full bg-white" style={{ height }}>
      <div className="relative w-full" style={{ height: chartHeight }}>
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          {/* Y-axis grid lines - subtle horizontal lines */}
          {yAxisLabels.slice(1).map((label, index) => {
            const y = chartHeight - ((index + 1) / yAxisSteps) * chartHeight;
            return (
              <line
                key={index}
                x1="8"
                y1={y}
                x2={chartWidth - 2}
                y2={y}
                stroke="#f1f3f4"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Y-axis labels */}
          {yAxisLabels.map((label, index) => {
            const y = chartHeight - (index / yAxisSteps) * chartHeight;
            return (
              <text
                key={index}
                x="6"
                y={y + 3}
                textAnchor="end"
                className="text-xs"
                fill="#8b9098"
                fontSize="11"
              >
                {label >= 1000 ? `${label / 1000}k` : label}
              </text>
            );
          })}
          
          {/* Bars */}
          {data.map((item, index) => {
            const xCenter = 40 + (index * ((chartWidth - 80) / (data.length - 1)));
            
            return (
              <g key={index}>
                {categories.map((category, catIndex) => {
                  const value = item[category] || 0;
                  const barHeight = (value / chartMax) * chartHeight;
                  const yPosition = chartHeight - barHeight;
                  const barX = xCenter - 15 + (catIndex * 18); // Fixed spacing between income/expense bars
                  
                  // Chart.js style colors
                  const isIncome = category === 'income';
                  const backgroundColor = isIncome ? 'rgba(16, 185, 129, 0.7)' : 'rgba(239, 68, 68, 0.7)';
                  const borderColor = isIncome ? '#10b981' : '#ef4444';
                  
                  return (
                    <rect
                      key={`${index}-${category}`}
                      x={barX}
                      y={yPosition}
                      width="15"
                      height={barHeight}
                      fill={backgroundColor}
                      stroke={borderColor}
                      strokeWidth="1"
                      className="hover:opacity-100 transition-opacity cursor-pointer"
                      style={{ opacity: 0.8 }}
                      rx="2"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.fill = isIncome ? 'rgba(40, 167, 69, 1)' : 'rgba(220, 53, 69, 1)';
                        
                        // Create tooltip
                        const tooltip = document.createElement('div');
                        tooltip.id = 'chart-tooltip';
                        tooltip.className = 'absolute bg-gray-800 text-white px-2 py-1 rounded text-sm pointer-events-none z-50';
                        tooltip.textContent = `${item.month} ${category}: NOK ${value.toLocaleString()}`;
                        document.body.appendChild(tooltip);
                        
                        const rect = e.currentTarget.getBoundingClientRect();
                        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
                        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0.8';
                        e.currentTarget.style.fill = backgroundColor;
                        
                        // Remove tooltip
                        const tooltip = document.getElementById('chart-tooltip');
                        if (tooltip) {
                          tooltip.remove();
                        }
                      }}
                    />
                  );
                })}
              </g>
            );
          })}
          
          {/* Cashflow line overlay - Chart.js style dashed line */}
          {showCashflowLine && (
            <g>
              {/* Dashed line path */}
              <path
                d={data.map((item, index) => {
                  const x = 40 + (index * ((chartWidth - 80) / (data.length - 1)));
                  const y = chartHeight - ((Math.abs(item.cashflow) / chartMax) * chartHeight);
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                fill="none"
                stroke="#adb5bd"
                strokeWidth="2"
                strokeDasharray="4,4"
                className="drop-shadow-sm"
              />
              
              {/* Data points */}
              {data.map((item, index) => {
                const x = 40 + (index * ((chartWidth - 80) / (data.length - 1)));
                const y = chartHeight - ((Math.abs(item.cashflow) / chartMax) * chartHeight);
                
                return (
                  <circle
                    key={`cashflow-${index}`}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="#adb5bd"
                    stroke="white"
                    strokeWidth="2"
                    className="hover:r-4 transition-all cursor-pointer drop-shadow-sm"
                    onMouseEnter={(e) => {
                      const tooltip = document.createElement('div');
                      tooltip.id = 'cashflow-point-tooltip';
                      tooltip.className = 'absolute bg-gray-800 text-white px-2 py-1 rounded text-sm pointer-events-none z-50';
                      tooltip.textContent = `${item.month} Cashflow: NOK ${item.cashflow?.toLocaleString()}`;
                      document.body.appendChild(tooltip);
                      
                      const rect = e.currentTarget.getBoundingClientRect();
                      tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
                      tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
                    }}
                    onMouseLeave={() => {
                      const tooltip = document.getElementById('cashflow-point-tooltip');
                      if (tooltip) {
                        tooltip.remove();
                      }
                    }}
                  >
                  </circle>
                );
              })}
            </g>
          )}
        </svg>
      </div>
      
      {/* Mouse move handler for cashflow line tooltips */}
      <div 
        className="absolute inset-0 pointer-events-none"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const dataIndex = Math.round((x - 40) / ((chartWidth - 80) / (data.length - 1)));
          
          if (dataIndex >= 0 && dataIndex < data.length && showCashflowLine) {
            const existingTooltip = document.getElementById('cashflow-tooltip');
            if (existingTooltip) existingTooltip.remove();
            
            const tooltip = document.createElement('div');
            tooltip.id = 'cashflow-tooltip';
            tooltip.className = 'absolute bg-gray-800 text-white px-2 py-1 rounded text-sm pointer-events-none z-50';
            tooltip.textContent = `${data[dataIndex].month} Cashflow: NOK ${data[dataIndex].cashflow?.toLocaleString()}`;
            document.body.appendChild(tooltip);
            tooltip.style.left = `${e.clientX - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${e.clientY - tooltip.offsetHeight - 10}px`;
          }
        }}
      />
      {/* X-axis labels */}
      <div className="flex justify-between mt-4 px-4">
        {data.map((item, index) => (
          <span key={index} className="text-xs font-medium" style={{ color: '#8b9098' }}>
            {item.month}
          </span>
        ))}
      </div>
      
      {/* Legend - Chart.js style */}
      <div className="flex justify-center items-center space-x-6 mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <div
            className="w-4 h-3 rounded border"
            style={{ 
              backgroundColor: 'rgba(40, 167, 69, 0.8)', 
              borderColor: '#28a745',
              borderWidth: '1px'
            }}
          />
          <span className="text-sm font-medium" style={{ color: '#8b9098' }}>Income</span>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className="w-4 h-3 rounded border"
            style={{ 
              backgroundColor: 'rgba(220, 53, 69, 0.8)', 
              borderColor: '#dc3545',
              borderWidth: '1px'
            }}
          />
          <span className="text-sm font-medium" style={{ color: '#8b9098' }}>Expenses</span>
        </div>
        {showCashflowLine && (
          <div className="flex items-center space-x-2">
            <div 
              className="w-6 h-0.5 rounded"
              style={{ 
                backgroundColor: '#adb5bd',
                backgroundImage: 'repeating-linear-gradient(to right, #adb5bd 0, #adb5bd 4px, transparent 4px, transparent 8px)'
              }}
            />
            <span className="text-sm font-medium" style={{ color: '#8b9098' }}>Cashflow</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarChart;