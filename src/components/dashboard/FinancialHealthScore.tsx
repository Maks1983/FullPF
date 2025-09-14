import React, { useState } from 'react';
import { Shield } from 'lucide-react';

interface FinancialHealthScoreProps {
  score: number;
  previousScore: number;
  healthScoreData: Array<{ month: string; score: number }>;
}

const FinancialHealthScore: React.FC<FinancialHealthScoreProps> = ({
  score,
  previousScore,
  healthScoreData
}) => {
  const [showHealthBreakdown, setShowHealthBreakdown] = useState(false);
  const scoreChange = score - previousScore;

  const getHealthMessage = (score: number) => {
    if (score >= 90) return 'Outstanding financial health';
    if (score >= 80) return 'Excellent financial position with room for optimization';
    if (score >= 70) return 'Good financial standing with improvement opportunities';
    if (score >= 60) return 'Fair financial health - focus on key areas';
    return 'Financial health needs attention';
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const scoreFactors = [
    { category: 'Debt-to-Income Ratio', score: 92, weight: 25, status: 'excellent', description: '19.6% - Well below 36% threshold' },
    { category: 'Emergency Fund', score: 85, weight: 20, status: 'good', description: '6.2 months of expenses covered' },
    { category: 'Savings Rate', score: 88, weight: 20, status: 'excellent', description: '28.5% of income saved monthly' },
    { category: 'Investment Diversification', score: 78, weight: 15, status: 'good', description: 'Good spread across asset classes' },
    { category: 'Credit Utilization', score: 82, weight: 10, status: 'good', description: '23% of available credit used' },
    { category: 'Net Worth Growth', score: 90, weight: 10, status: 'excellent', description: '+18% annual growth rate' },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-gray-200 flex items-center justify-center bg-white shadow-sm">
              <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                {score}
              </div>
            </div>
            <div className="absolute -top-1 -right-1">
              <Shield className="h-7 w-7 text-blue-600 drop-shadow-sm" />
            </div>
            {scoreChange > 0 && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                +{scoreChange}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Financial Health Score</h3>
            <p className="text-gray-600 mb-2">{getHealthMessage(score)}</p>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-green-600 font-medium">+{scoreChange} points this month</span>
              <button 
                onClick={() => setShowHealthBreakdown(!showHealthBreakdown)}
                className="text-blue-600 hover:text-blue-800 font-medium underline"
              >
                {showHealthBreakdown ? 'Hide Details' : 'View Breakdown'}
              </button>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-1">6-Month Trend</div>
            <svg width="120" height="40" className="opacity-80">
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={healthScoreData.map((item, index) => {
                  const x = (index / (healthScoreData.length - 1)) * 110 + 5;
                  const y = 35 - ((item.score - 75) / 20) * 30;
                  return `${x},${y}`;
                }).join(' ')}
              />
              {healthScoreData.map((item, index) => {
                const x = (index / (healthScoreData.length - 1)) * 110 + 5;
                const y = 35 - ((item.score - 75) / 20) * 30;
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="2"
                    fill="#10b981"
                    className="opacity-70"
                  />
                );
              })}
            </svg>
          </div>
          <div className="text-sm text-gray-600 mb-1">Next Review</div>
          <div className="font-semibold text-gray-900">Jan 31, 2024</div>
        </div>
      </div>
      
      {/* Health Score Breakdown */}
      {showHealthBreakdown && (
        <div className="mt-6 pt-6 border-t border-blue-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Score Breakdown</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scoreFactors.map((factor, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{factor.category}</h5>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(factor.status)}`}>
                      {factor.status}
                    </span>
                    <span className="font-bold text-gray-900">{factor.score}</span>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        factor.score >= 90 ? 'bg-emerald-500' :
                        factor.score >= 80 ? 'bg-green-500' :
                        factor.score >= 70 ? 'bg-blue-500' :
                        factor.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${factor.score}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600">{factor.description}</p>
                <div className="text-xs text-gray-500 mt-1">Weight: {factor.weight}% of total score</div>
              </div>
            ))}
          </div>
          
          {/* Improvement Recommendations */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h5 className="font-semibold text-blue-900 mb-2">💡 Recommendations to Reach 90+</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Reduce credit utilization below 20% for +3 points</li>
              <li>• Increase investment diversification with international exposure for +2 points</li>
              <li>• Build emergency fund to 8 months for +2 points</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialHealthScore;