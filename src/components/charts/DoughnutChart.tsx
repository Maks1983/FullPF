import React from 'react';

interface DoughnutChartProps {
  value: number;
  total: number;
  color: string;
  size?: number;
  centerText?: string;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ 
  value, 
  total, 
  color, 
  size = 120, 
  centerText 
}) => {
  const percentage = (value / total) * 100;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      
      {/* Center text */}
      {centerText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-900">{centerText}</span>
        </div>
      )}
    </div>
  );
};

export default DoughnutChart;