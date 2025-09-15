import React from 'react';
import { Heart, Shield, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface FinancialHealthCheckProps {
  totalAvailable: number;
  netLeftover: number;
  savingsRate: number;
  overdueCount: number;
  biggestExpense: { name: string; spent: number; budget: number } | undefined;
  daysUntilPaycheck: number;
}

const FinancialHealthCheck: React.FC<FinancialHealthCheckProps> = ({
  totalAvailable,
  netLeftover,
  savingsRate,
  overdueCount,
  biggestExpense,
  daysUntilPaycheck
}) => {
  // Calculate health score
  const healthFactors = [
    { name: 'Available Money', score: totalAvailable > 10000 ? 100 : (totalAvailable / 10000) * 100, weight: 25 },
    { name: 'Cashflow Health', score: netLeftover >= 0 ? 100 : 0, weight: 30 },
    { name: 'Savings Rate', score: Math.min((savingsRate / 20) * 100, 100), weight: 25 },
    { name: 'Payment Status', score: overdueCount === 0 ? 100 : Math.max(0, 100 - (overdueCount * 25)), weight: 20 }
  ];

  const overallScore = healthFactors.reduce((sum, factor) => 
    sum + (factor.score * factor.weight / 100), 0);

  const getHealthStatus = (score: number) => {
    if (score >= 80) return { status: 'Excellent', color: 'green', icon: CheckCircle };
    if (score >= 60) return { status: 'Good', color: 'blue', icon: TrendingUp };
    if (score >= 40) return { status: 'Fair', color: 'yellow', icon: Shield };
    return { status: 'Needs Attention', color: 'red', icon: AlertTriangle };
  };

  const health = getHealthStatus(overallScore);
  const HealthIcon = health.icon;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Heart className="h-6 w-6 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900">Financial Health Check</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium bg-${health.color}-100 text-${health.color}-800`}>
          {health.status}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Score Circle */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke={health.color === 'green' ? '#10b981' : health.color === 'blue' ? '#3b82f6' : health.color === 'yellow' ? '#f59e0b' : '#ef4444'}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${(overallScore / 100) * 351.86} 351.86`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-2xl font-bold text-${health.color}-600`}>
                  {Math.round(overallScore)}
                </div>
                <div className="text-xs text-gray-500">Health Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Factors */}
        <div className="space-y-4">
          {healthFactors.map((factor, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{factor.name}</span>
                <span className={`text-sm font-semibold ${
                  factor.score >= 80 ? 'text-green-600' :
                  factor.score >= 60 ? 'text-blue-600' :
                  factor.score >= 40 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {Math.round(factor.score)}/100
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    factor.score >= 80 ? 'bg-green-500' :
                    factor.score >= 60 ? 'bg-blue-500' :
                    factor.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${factor.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Insights */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <HealthIcon className={`h-4 w-4 mr-2 text-${health.color}-600`} />
          What This Means for You
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700 mb-1">Strengths:</p>
            <ul className="text-gray-600 space-y-1">
              {savingsRate >= 15 && <li>• Great savings rate ({savingsRate.toFixed(1)}%)</li>}
              {overdueCount === 0 && <li>• All payments up to date</li>}
              {totalAvailable >= 15000 && <li>• Good cash reserves</li>}
              {netLeftover >= 0 && <li>• Positive cashflow until payday</li>}
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">Areas to Watch:</p>
            <ul className="text-gray-600 space-y-1">
              {savingsRate < 10 && <li>• Low savings rate - try to save more</li>}
              {overdueCount > 0 && <li>• {overdueCount} overdue payment{overdueCount > 1 ? 's' : ''}</li>}
              {totalAvailable < 5000 && <li>• Low cash reserves</li>}
              {netLeftover < 0 && <li>• May run short before payday</li>}
              {biggestExpense && biggestExpense.spent > biggestExpense.budget && 
                <li>• Over budget in {biggestExpense.name}</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialHealthCheck;