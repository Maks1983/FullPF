import React from 'react';
import { Star } from 'lucide-react';
import { useLicenseGating } from '../../hooks/useLicenseGating';
import { SmartInsightCard } from '../common/SmartInsightCard';

interface SmartInsight {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'success' | 'info';
  icon: React.ComponentType<{ className?: string }>;
  priority: number;
}

interface SmartInsightsProps {
  insights?: SmartInsight[];
}

export const SmartInsights: React.FC<SmartInsightsProps> = ({ insights = [] }) => {
  const { hasFeature } = useLicenseGating();

  if (!hasFeature('smart_insights')) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">
              PREMIUM
            </span>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Upgrade to Premium
          </button>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Insights</h3>
        <p className="text-gray-600 text-sm mb-4">
          Get AI-powered insights about your financial patterns and personalized recommendations.
        </p>
        
        {/* Blurred preview content */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 rounded-lg"></div>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Smart Insights</h3>
      {insights.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No insights available at the moment.</p>
          <p className="text-sm">Check back later for personalized recommendations.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {insights.map((insight) => (
            <SmartInsightCard
              key={insight.id}
              title={insight.title}
              description={insight.description}
              type={insight.type}
              icon={insight.icon}
            />
          ))}
        </div>
      )}
    </div>
  );
};