import React from 'react';
import { Lightbulb, AlertTriangle, TrendingUp, PiggyBank, CreditCard, DollarSign } from 'lucide-react';
import type { MoneyRecommendation } from '../../types/current';

interface MoneyRecommendationsCardProps {
  recommendations: MoneyRecommendation[];
}

const MoneyRecommendationsCard: React.FC<MoneyRecommendationsCardProps> = ({
  recommendations
}) => {
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'save': return PiggyBank;
      case 'invest': return TrendingUp;
      case 'pay_debt': return CreditCard;
      case 'emergency': return AlertTriangle;
      case 'spend': return DollarSign;
      default: return Lightbulb;
    }
  };

  const getRecommendationColor = (priority: string, type: string) => {
    if (priority === 'high') {
      return type === 'emergency' ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50';
    }
    if (priority === 'medium') return 'border-yellow-200 bg-yellow-50';
    return 'border-blue-200 bg-blue-50';
  };

  const getIconColor = (priority: string, type: string) => {
    if (priority === 'high') {
      return type === 'emergency' ? 'text-red-600 bg-red-100' : 'text-orange-600 bg-orange-100';
    }
    if (priority === 'medium') return 'text-yellow-600 bg-yellow-100';
    return 'text-blue-600 bg-blue-100';
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };
    return colors[priority] || colors.low;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Lightbulb className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Smart Money Recommendations</h3>
            <p className="text-sm text-gray-600">
              Actionable suggestions for your leftover money
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Lightbulb className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No recommendations at this time</p>
          </div>
        ) : (
          recommendations.map((recommendation) => {
            const Icon = getRecommendationIcon(recommendation.type);
            
            return (
              <div 
                key={recommendation.id} 
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-sm ${
                  getRecommendationColor(recommendation.priority, recommendation.type)
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getIconColor(recommendation.priority, recommendation.type)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{recommendation.description}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(recommendation.priority)}`}>
                    {recommendation.priority.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <span className="text-gray-600">Amount: </span>
                      <span className="font-semibold text-gray-900">
                        NOK {recommendation.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Impact: </span>
                      <span className="font-medium text-green-600">{recommendation.impact}</span>
                    </div>
                  </div>
                  <button className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    recommendation.priority === 'high' 
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : recommendation.priority === 'medium'
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}>
                    {recommendation.action}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MoneyRecommendationsCard;