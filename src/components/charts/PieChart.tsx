import React from 'react';

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  size?: number;
}

const PieChart: React.FC<PieChartProps> = ({ data, size = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - 4) / 2;
  const centerX = size / 2;
  const centerY = size / 2;

  let cumulativePercentage = 0;

  const slices = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const startAngle = cumulativePercentage * 3.6; // Convert to degrees
    const endAngle = (cumulativePercentage + percentage) * 3.6;
    
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const largeArc = percentage > 50 ? 1 : 0;
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    cumulativePercentage += percentage;

    return {
      ...item,
      pathData,
      percentage
    };
  });

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="drop-shadow-sm">
        {slices.map((slice, index) => (
          <path
            key={index}
            d={slice.pathData}
            fill={slice.color}
            className="hover:opacity-80 transition-opacity cursor-pointer"
            onMouseEnter={(e) => {
              // Create tooltip
              const tooltip = document.createElement('div');
              tooltip.id = 'pie-chart-tooltip';
              tooltip.className = 'absolute bg-gray-800 text-white px-2 py-1 rounded text-sm pointer-events-none z-50';
              tooltip.textContent = `${slice.name}: ${slice.value.toLocaleString()} (${slice.percentage.toFixed(1)}%)`;
              document.body.appendChild(tooltip);
              
              const rect = e.currentTarget.getBoundingClientRect();
              tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
              tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
            }}
            onMouseLeave={() => {
              // Remove tooltip
              const tooltip = document.getElementById('pie-chart-tooltip');
              if (tooltip) {
                tooltip.remove();
              }
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default PieChart;