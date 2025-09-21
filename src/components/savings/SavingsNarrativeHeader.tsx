import React from 'react';
import { Target, TrendingUp, Calendar, Sparkles } from 'lucide-react';

interface SavingsNarrativeHeaderProps {
  monthsToGoal: number;
  acceleratedMonths: number;
  monthsSaved: number;
  monthsOfCoverage: number;
  isAheadOfSchedule: boolean;
  currentSavings: number;
  savingsRate: number;
}

const SavingsNarrativeHeader: React.FC<SavingsNarrativeHeaderProps> = ({
  monthsToGoal,
  acceleratedMonths,
  monthsSaved,
  monthsOfCoverage,
  isAheadOfSchedule,
  currentSavings,
  savingsRate
}) => {
  const getMainNarrative = () => {
    if (monthsToGoal <= 0) {
      return "🎉 Congratulations! You've reached your Emergency Fund goal. Time to set your next savings target!";
    }
    
    if (monthsSaved > 0) {
      return `At your current pace, you'll hit your Emergency Fund goal in ${monthsToGoal} months. If you add NOK 500 more per month, you'll reach it ${monthsSaved} months earlier.`;
    }
    
    return `You're ${monthsToGoal} months away from your Emergency Fund goal. Your current savings rate of ${savingsRate.toFixed(1)}% is ${isAheadOfSchedule ? 'excellent' : 'on track'}.`;
  };

  const getCoverageMessage = () => {
    if (monthsOfCoverage >= 6) {
      return `Your savings can cover ${monthsOfCoverage.toFixed(1)} months of expenses - you're in excellent shape! 💎`;
    } else if (monthsOfCoverage >= 3) {
      return `Your savings can cover ${monthsOfCoverage.toFixed(1)} months of expenses - you're building solid security 👍`;
    } else {
      return `Your savings can cover ${monthsOfCoverage.toFixed(1)} months of expenses - keep building that safety net 💪`;
    }
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Savings Story</h1>
              <p className="text-green-700 font-medium">Financial security in progress</p>
            </div>
          </div>
          
          {/* Main Narrative */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 mb-4 border border-green-100">
            <p className="text-lg text-gray-800 leading-relaxed">
              {getMainNarrative()}
            </p>
          </div>
          
          {/* Coverage Insight */}
          <div className="flex items-center space-x-3 text-green-800">
            <Sparkles className="h-5 w-5" />
            <p className="font-medium">{getCoverageMessage()}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-col space-y-4 text-right">
          <div className="bg-white/90 rounded-lg p-4 border border-green-100">
            <div className="text-2xl font-bold text-green-600">
              NOK {currentSavings.toLocaleString()}
            </div>
            <p className="text-sm text-green-700">Total Saved</p>
          </div>
          
          <div className="bg-white/90 rounded-lg p-4 border border-green-100">
            <div className="text-2xl font-bold text-emerald-600">
              {monthsOfCoverage.toFixed(1)}
            </div>
            <p className="text-sm text-green-700">Months Coverage</p>
          </div>
          
          {isAheadOfSchedule && (
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-3 border border-yellow-200">
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-semibold text-yellow-800">Ahead of Schedule!</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Suggestions */}
      <div className="flex flex-wrap gap-3">
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Add NOK 500/month
        </button>
        <button className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          <Zap className="h-4 w-4 mr-2" />
          One-time boost
        </button>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Calendar className="h-4 w-4 mr-2" />
          Adjust timeline
        </button>
      </div>
    </div>
  );
};

export default SavingsNarrativeHeader;