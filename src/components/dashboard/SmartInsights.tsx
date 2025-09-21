import React from 'react';
import { Zap, Star } from 'lucide-react';
import SmartInsightCard from '../common/SmartInsightCard';
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

  if (!canUseSmartInsights) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Smart Insights</h3>
            <span className="ml-2 px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">PREMIUM</span>
          </div>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 mb-4 border border-purple-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((index) => (
              <div key={index} className="p-4 bg-gray-100 rounded-lg border border-gray-200">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-1/4"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">{getUpgradeMessage('Smart Insights')}</p>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Upgrade to Premium
        </button>
      </div>
    );
  }

  return (
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
  );
};

export default SmartInsights;