import React from 'react';
import { SmartInsightCard } from '../common/SmartInsightCard';
import { SmartInsight } from '../../types/financial';

interface SmartInsightsProps {
  insights: SmartInsight[];
}

export const SmartInsights: React.FC<SmartInsightsProps> = ({ insights }) => {
  if (!insights || insights.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Insights</h3>
        <p className="text-gray-500 text-center py-8">No insights available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Insights</h3>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <SmartInsightCard key={index} insight={insight} />
        ))}
      </div>
    </div>
  );
};