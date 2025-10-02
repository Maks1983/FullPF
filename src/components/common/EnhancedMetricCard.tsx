import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { colors } from '../../theme/colors';
import type { ColorKey } from '../../theme/colors';

interface EnhancedMetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  color: ColorKey;
  subtitle?: string;
  sparklineData?: number[];
  compact?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

const EnhancedMetricCard: React.FC<EnhancedMetricCardProps> = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  color, 
  subtitle, 
  sparklineData, 
  compact = false,
  priority = 'medium'
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className={`h-4 w-4 mr-1 text-green-600`} />;
    if (trend === 'down') return <TrendingDown className={`h-4 w-4 mr-1 text-red-600`} />;
    return null;
  };

  const trendIcon = getTrendIcon();
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';

  // Enhanced sparkline with better rendering
  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null;
    
    const max = Math.max(...sparklineData);
    const min = Math.min(...sparklineData);
    const range = max - min;
    
    if (range === 0) return null;
    
    const points = sparklineData.map((value, index) => {
      const x = (index / (sparklineData.length - 1)) * 60;
      const y = 20 - ((value - min) / range) * 15;
      return `${x},${y}`;
    }).join(' ');

    const strokeColor = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#6b7280';

    return (
      <svg width="60" height="20" className="opacity-70">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {/* Add dots for data points */}
        {sparklineData.map((value, index) => {
          const x = (index / (sparklineData.length - 1)) * 60;
          const y = 20 - ((value - min) / range) * 15;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1.5"
              fill={strokeColor}
              className="opacity-60"
            />
          );
        })}
      </svg>
    );
  };

  const cardClasses = compact 
    ? "bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    : "bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow";

  const titleSize = compact ? "text-sm" : "text-lg";
  const valueSize = compact ? "text-xl" : "text-3xl";
  const iconSize = compact ? "h-5 w-5" : "h-6 w-6";
  const iconPadding = compact ? "p-2" : "p-3";

  return (
    <div className={cardClasses}>
      <div className={`flex items-center justify-between ${compact ? 'mb-3' : 'mb-6'}`}>
        <h3 className={`${titleSize} font-medium text-gray-500`}>{title}</h3>
        <div className={`${iconPadding} rounded-xl ${colors[color].bg} ${colors[color].text}`}>
          <Icon className={iconSize} />
        </div>
      </div>
      <div className="space-y-2">
        <p className={`${valueSize} font-bold text-gray-900`}>{value}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {trendIcon}
              <span className={`text-sm font-semibold ${trendColor}`}>{change}</span>
            </div>
            {!compact && renderSparkline()}
          </div>
          <p className="text-xs text-gray-500">{subtitle || 'vs last month'}</p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMetricCard;