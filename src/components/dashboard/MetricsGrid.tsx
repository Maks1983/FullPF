import React from 'react';
import EnhancedMetricCard from '../common/EnhancedMetricCard';

interface Metric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  color: 'blue' | 'green' | 'red' | 'purple' | 'indigo' | 'emerald' | 'yellow';
  subtitle?: string;
  sparklineData?: number[];
  compact?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

interface MetricsGridProps {
  primaryMetrics: Metric[];
  secondaryMetrics: Metric[];
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ primaryMetrics, secondaryMetrics }) => {
  return (
    <>
      {/* Primary KPIs - Enhanced Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {primaryMetrics.map((metric, index) => (
          <EnhancedMetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Secondary Metrics - Compact Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {secondaryMetrics.map((metric, index) => (
          <EnhancedMetricCard key={index} {...metric} compact />
        ))}
      </div>
    </>
  );
};

export default MetricsGrid;