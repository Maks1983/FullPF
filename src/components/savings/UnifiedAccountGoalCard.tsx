import React, { useState } from 'react';
import { TrendingUp, Plus, Edit3, Zap, Target, DollarSign } from 'lucide-react';

interface Goal {
  name: string;
  progress: number;
  isPrimary: boolean;
}

interface Account {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  monthlyContribution: number;
  goals: Goal[];
  runwayMonths: number;
  trend: 'up' | 'down' | 'neutral';
  recentGrowth: number;
}

interface UnifiedAccountGoalCardProps {
  account: Account;
}

const UnifiedAccountGoalCard: React.FC<UnifiedAccountGoalCardProps> = ({ account }) => {
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [celebrateGoal, setCelebrateGoal] = useState<string | null>(null);

  const primaryGoal = account.goals.find(goal => goal.isPrimary);
  const secondaryGoals = account.goals.filter(goal => !goal.isPrimary);

  const handleGoalCelebration = (goalName: string) => {
    setCelebrateGoal(goalName);
    setTimeout(() => setCelebrateGoal(null), 2000);
  };

  const getRunwayBadge = (months: number) => {
    if (months >= 6) return { text: '6+ months', color: 'bg-emerald-100 text-emerald-800', icon: '💎' };
    if (months >= 3) return { text: '3+ months', color: 'bg-green-100 text-green-800', icon: '🛡️' };
    if (months >= 1) return { text: '1+ month', color: 'bg-blue-100 text-blue-800', icon: '🏃' };
    return { text: 'Building', color: 'bg-yellow-100 text-yellow-800', icon: '🌱' };
  };

  const runwayBadge = getRunwayBadge(account.runwayMonths);

  // Calculate if ahead of schedule based on account performance
  const isAheadOfSchedule = account.trend === 'up' && account.recentGrowth > 5;

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 relative overflow-hidden"
      onMouseEnter={() => setShowQuickActions(true)}
      onMouseLeave={() => setShowQuickActions(false)}
    >
      {/* Celebration Animation */}
      {celebrateGoal && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-orange-100 opacity-90 flex items-center justify-center z-10 animate-pulse">
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <p className="font-bold text-orange-800">{celebrateGoal} Milestone!</p>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Account Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{account.name}</h3>
              <p className="text-sm text-gray-600">{account.interestRate}% APY</p>
            </div>
          </div>
          
          {/* Runway Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${runwayBadge.color} flex items-center space-x-1`}>
            <span>{runwayBadge.icon}</span>
            <span>{runwayBadge.text}</span>
          </div>
        </div>

        {/* Balance & Growth */}
        <div className="mb-6">
          <div className="flex items-baseline space-x-2 mb-2">
            <span className="text-3xl font-bold text-gray-900">
              NOK {account.balance.toLocaleString()}
            </span>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">
                +{account.recentGrowth}%
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            +NOK {account.monthlyContribution.toLocaleString()}/month contribution
          </p>
        </div>

        {/* Goal Progress Overlays */}
        <div className="space-y-3 mb-6">
          {/* Primary Goal */}
          {primaryGoal && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-gray-900">{primaryGoal.name}</span>
                </div>
                <span className="text-sm font-semibold text-blue-600">
                  {primaryGoal.progress}%
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-3 relative overflow-hidden">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-700"
                  style={{ width: `${Math.min(primaryGoal.progress, 100)}%` }}
                />
                {/* Milestone markers */}
                {[25, 50, 75].map(milestone => (
                  <div
                    key={milestone}
                    className={`absolute top-0 h-3 w-0.5 ${
                      primaryGoal.progress >= milestone ? 'bg-yellow-400' : 'bg-gray-400'
                    }`}
                    style={{ left: `${milestone}%` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Secondary Goals */}
          {secondaryGoals.map((goal, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{goal.name}</span>
                <span className="text-xs font-medium text-gray-500">{goal.progress}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full bg-gray-400 transition-all duration-500"
                  style={{ width: `${Math.min(goal.progress, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions (on hover) */}
        <div className={`transition-all duration-300 ${showQuickActions ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'} overflow-hidden`}>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Deposit
              </button>
              <button className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                <Edit3 className="h-4 w-4 mr-1" />
                Adjust
              </button>
              <button className="flex-1 flex items-center justify-center px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm">
                <Zap className="h-4 w-4 mr-1" />
                What if?
              </button>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="mt-4 text-center">
          <p className="text-xs text-green-600 font-medium">
            {isAheadOfSchedule ? 'You\'re crushing it! Ahead by 2 weeks! 🚀' : 'Steady progress builds lasting wealth 📈'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnifiedAccountGoalCard;