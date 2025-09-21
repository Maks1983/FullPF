import React from 'react';
import { Zap } from 'lucide-react';
import SmartInsightCard from '../common/SmartInsightCard';
import LicenseGate from '../common/LicenseGate';
import { useLicenseGating } from '../../hooks/useLicenseGating';

interface SmartInsightsProps {
  insights: Array<{
    type: 'opportunity' | 'warning' | 'achievement';
    title: string;
    message: string;
    impact: string;
    action: string;
    icon: React.ElementType;
    color: 'green' | 'yellow' | 'blue' | 'red';
  }>;
}

const SmartInsights: React.FC<SmartInsightsProps> = ({ insights }) => {
  const { canUseSmartInsights, getUpgradeMessage } = useLicenseGating();

  return (
    <LicenseGate
      isLicensed={canUseSmartInsights}
      featureName="Smart Insights"
      upgradeMessage={getUpgradeMessage('Smart Insights')}
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-yellow-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Smart Insights</h3>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <SmartInsightCard key={index} {...insight} />
            ))}
          </div>
        </div>
      </div>
    </LicenseGate>
  );
};

export default SmartInsights;