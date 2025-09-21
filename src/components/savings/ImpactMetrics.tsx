import React from 'react';
import { Shield, TrendingUp, Target, Zap } from 'lucide-react';

interface ImpactMetricsProps {
  monthsOfCoverage: number;
  growthMultiplier: number;
  runwayAmount: number;
  totalSavings: number;
}

const ImpactMetrics: React.FC<ImpactMetricsProps> = ({
  monthsOfCoverage,
  growthMultiplier,
  runwayAmount,
  totalSavings
}) => {
  const getImpactMessage = (metric: string, value: number | string) => {
    switch (metric) {
      case 'coverage':
        return `You've built ${value} months of financial security - that's real peace of mind`;
      case 'growth':
        return `Your wealth is accelerating ${value}× faster than last quarter - momentum is building!`;
      case 'runway':
        return `Just NOK ${typeof value === 'number' ? value.toLocaleString() : value} away from ultimate financial freedom (12-month runway)`;
      case 'momentum':
        return `Your disciplined saving is creating unstoppable wealth momentum`;
      default:
        return '';
    }
  };

  const getCoverageColor = (months: number) => {
    if (months >= 6) return 'from-emerald-500 to-green-500';
    if (months >= 3) return 'from-blue-500 to-cyan-500';
    return 'from-yellow-500 to-orange-500';
  };

  const getGrowthColor = (multiplier: number) => {
    if (multiplier >= 2) return 'from-purple-500 to-pink-500';
    if (multiplier >= 1.5) return 'from-blue-500 to-indigo-500';
    return 'from-gray-500 to-slate-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Coverage Metric */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${getCoverageColor(monthsOfCoverage)}`}>
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Coverage</h3>
            <p className="text-xs text-gray-600">Emergency protection</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-gray-900">
            {monthsOfCoverage.toFixed(1)} months
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {getImpactMessage('coverage', monthsOfCoverage.toFixed(1))}
          </p>
        </div>
      </div>

      {/* Growth Multiplier */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${getGrowthColor(growthMultiplier)}`}>
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Growth Rate</h3>
            <p className="text-xs text-gray-600">Acceleration</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-gray-900">
            {growthMultiplier}× faster
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {getImpactMessage('growth', growthMultiplier)}
          </p>
        </div>
      </div>

      {/* Financial Independence Runway */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Independence</h3>
            <p className="text-xs text-gray-600">12-month runway</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-gray-900">
            NOK {runwayAmount.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {getImpactMessage('runway', runwayAmount)}
          </p>
        </div>
      </div>

      {/* Savings Momentum */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Momentum</h3>
            <p className="text-xs text-gray-600">Wealth building</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-gray-900">
            {((totalSavings / 360000) * 100).toFixed(0)}%
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {getImpactMessage('momentum', '')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImpactMetrics;