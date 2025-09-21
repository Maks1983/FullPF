import React from 'react';
import { Lightbulb, Target, AlertCircle, TrendingUp, DollarSign, Calendar, Star, Zap } from 'lucide-react';
import { useLicenseGating } from '../../hooks/useLicenseGating';

type SuggestionColor = 'red' | 'yellow' | 'blue' | 'green';

type Suggestion = {
  type: 'urgent' | 'warning' | 'improvement' | 'positive' | 'tip';
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  message: string;
  action: string;
  color: SuggestionColor;
  priority: number;
};

interface SmartSavingsSuggestionsProps {
  currentSavings: number;
  monthlyContribution: number;
  savingsRate: number;
  monthsOfCoverage: number;
  goalProgress: number;
  targetAmount: number;
  monthsToGoal: number;
  averageMonthlyGrowth: number;
  totalMonthlyIncome: number;
}

const SmartSavingsSuggestions: React.FC<SmartSavingsSuggestionsProps> = ({
  currentSavings,
  monthlyContribution,
  savingsRate,
  monthsOfCoverage,
  goalProgress,
  targetAmount,
  monthsToGoal,
  averageMonthlyGrowth,
  totalMonthlyIncome
}) => {
  const { canUseSmartSuggestions, getUpgradeMessage } = useLicenseGating();

  const suggestions: Suggestion[] = [];

  // Emergency fund coverage analysis
  if (monthsOfCoverage < 3) {
    suggestions.push({
      type: 'urgent',
      icon: AlertCircle,
      title: 'Build Emergency Foundation',
      message: `You have ${monthsOfCoverage.toFixed(1)} months of coverage. Aim for 3-6 months to protect against unexpected expenses.`,
      action: 'Boost emergency fund',
      color: 'red',
      priority: 1
    });
  } else if (monthsOfCoverage >= 6) {
    suggestions.push({
      type: 'positive',
      icon: TrendingUp,
      title: 'Outstanding Emergency Fund!',
      message: `Your ${monthsOfCoverage.toFixed(1)} months of coverage provides excellent financial security. Consider investing surplus for growth.`,
      action: 'Explore investment options',
      color: 'green',
      priority: 5
    });
  }

  // Savings rate optimization
  if (savingsRate < 10) {
    suggestions.push({
      type: 'improvement',
      icon: Target,
      title: 'Boost Your Savings Rate',
      message: `Your ${savingsRate.toFixed(1)}% savings rate has room for improvement. Try to reach 15-20% by finding small areas to optimize.`,
      action: 'Find savings opportunities',
      color: 'yellow',
      priority: 2
    });
  } else if (savingsRate >= 25) {
    suggestions.push({
      type: 'positive',
      icon: Zap,
      title: 'Exceptional Savings Discipline!',
      message: `Your ${savingsRate.toFixed(1)}% savings rate is outstanding! You're building wealth faster than most people.`,
      action: 'Keep up the momentum',
      color: 'green',
      priority: 6
    });
  }

  // Goal acceleration opportunities
  if (monthsToGoal > 0 && monthlyContribution > 0) {
    const boostAmount = 500;
    const acceleratedMonths = Math.ceil((targetAmount - currentSavings) / (monthlyContribution + boostAmount));
    const timeSaved = monthsToGoal - acceleratedMonths;
    
    if (timeSaved > 0) {
      suggestions.push({
        type: 'tip',
        icon: Target,
        title: 'Accelerate Your Goal',
        message: `Adding just NOK ${boostAmount.toLocaleString()}/month could reach your goal ${timeSaved} month${timeSaved === 1 ? '' : 's'} faster!`,
        action: 'Boost contributions',
        color: 'blue',
        priority: 3
      });
    }
  }

  // Momentum analysis
  if (averageMonthlyGrowth > 0) {
    const growthRate = (averageMonthlyGrowth / currentSavings) * 100;
    if (growthRate > 8) {
      suggestions.push({
        type: 'positive',
        icon: TrendingUp,
        title: 'Incredible Savings Momentum!',
        message: `Your ${growthRate.toFixed(1)}% monthly growth rate is exceptional. You're on track for serious wealth building.`,
        action: 'Maintain this pace',
        color: 'green',
        priority: 4
      });
    } else if (growthRate < 3) {
      suggestions.push({
        type: 'improvement',
        icon: DollarSign,
        title: 'Increase Savings Velocity',
        message: `Your ${growthRate.toFixed(1)}% monthly growth could be accelerated. Consider automating larger transfers.`,
        action: 'Set up auto-save',
        color: 'blue',
        priority: 3
      });
    }
  }

  // Interest rate optimization
  const currentRate = 4.2; // This could be passed as prop
  if (currentRate < 4.0) {
    suggestions.push({
      type: 'improvement',
      icon: TrendingUp,
      title: 'Optimize Interest Earnings',
      message: `Your ${currentRate}% rate is decent, but high-yield accounts offer 4.5%+. Extra interest compounds over time.`,
      action: 'Compare rates',
      color: 'blue',
      priority: 4
    });
  }

  // Goal completion celebration
  if (goalProgress >= 100) {
    suggestions.push({
      type: 'positive',
      icon: Target,
      title: '🎉 Goal Achieved!',
      message: 'Congratulations on reaching your savings goal! Time to set your next wealth-building milestone.',
      action: 'Set new goal',
      color: 'green',
      priority: 1
    });
  }

  const topSuggestions = suggestions
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);

  if (topSuggestions.length === 0) {
    topSuggestions.push({
      type: 'positive',
      icon: TrendingUp,
      title: 'Excellent Savings Health!',
      message: 'Your savings strategy is working beautifully. Keep building wealth with your disciplined approach.',
      action: 'Stay the course',
      color: 'green',
      priority: 8
    });
  }

  const getColorClasses = (color: SuggestionColor) => {
    switch (color) {
      case 'red': return 'bg-red-50 border-red-200 text-red-800';
      case 'yellow': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'blue': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'green': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIconColor = (color: SuggestionColor) => {
    switch (color) {
      case 'red': return 'text-red-600';
      case 'yellow': return 'text-yellow-600';
      case 'blue': return 'text-blue-600';
      case 'green': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (!canUseSmartSuggestions) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Smart Savings Suggestions</h3>
            <span className="ml-2 px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">PREMIUM</span>
          </div>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 mb-4 border border-purple-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          
          <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
            <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">{getUpgradeMessage('Smart Savings Suggestions')}</p>
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
            <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Smart Savings Suggestions</h3>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topSuggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <div
                key={`${suggestion.title}-${index}`}
                className={`p-4 rounded-lg border ${getColorClasses(suggestion.color)}`}
              >
                <div className="flex items-start space-x-3">
                  <Icon className={`h-5 w-5 mt-0.5 ${getIconColor(suggestion.color)}`} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{suggestion.title}</h4>
                    <p className="text-sm text-gray-700 mb-3">{suggestion.message}</p>
                    <button className={`text-sm font-medium ${getIconColor(suggestion.color)} hover:underline`}>
                      {suggestion.action} →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
          <h4 className="font-semibold text-gray-900 mb-2">💡 Wealth-Building Wisdom</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-medium mb-1">Automate Your Success</p>
              <p>Set up automatic transfers so you pay yourself first, before you can spend it.</p>
            </div>
            <div>
              <p className="font-medium mb-1">Compound Interest Magic</p>
              <p>Every month you delay saving costs you future wealth. Start now, even with small amounts.</p>
            </div>
            <div>
              <p className="font-medium mb-1">Emergency Fund First</p>
              <p>Build 3-6 months of expenses before aggressive investing. Security enables risk-taking.</p>
            </div>
            <div>
              <p className="font-medium mb-1">Celebrate Milestones</p>
              <p>Acknowledge your progress! Each deposit is a step toward financial independence.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartSavingsSuggestions;