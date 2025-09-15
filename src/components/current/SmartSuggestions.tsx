import React from 'react';
import { Lightbulb, Target, AlertCircle, TrendingUp, DollarSign, Calendar, Star, Lock } from 'lucide-react';
import type { SpendingCategory } from '../../types/current';

interface SmartSuggestionsProps {
  netLeftover: number;
  savingsRate: number;
  spendingCategories: SpendingCategory[];
  overdueCount: number;
  daysUntilPaycheck: number;
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  netLeftover,
  savingsRate,
  spendingCategories,
  overdueCount,
  daysUntilPaycheck
}) => {
  const suggestions = [];

  // Generate smart suggestions based on financial situation
  if (overdueCount > 0) {
    suggestions.push({
      type: 'urgent',
      icon: AlertCircle,
      title: 'Pay Overdue Bills Immediately',
      message: `You have ${overdueCount} overdue payment${overdueCount > 1 ? 's' : ''}. Late fees and credit score damage can be costly.`,
      action: 'Review overdue payments',
      color: 'red',
      priority: 1
    });
  }

  if (netLeftover < 0) {
    suggestions.push({
      type: 'warning',
      icon: AlertCircle,
      title: 'Money Will Run Short',
      message: `You're projected to be NOK ${Math.abs(netLeftover).toLocaleString()} short before your next paycheck. Consider reducing expenses or using credit carefully.`,
      action: 'Review upcoming expenses',
      color: 'red',
      priority: 2
    });
  }

  // Check for over-budget categories
  const overBudgetCategories = spendingCategories.filter(cat => cat.isOverBudget);
  if (overBudgetCategories.length > 0) {
    const worstCategory = overBudgetCategories.reduce((worst, cat) => 
      Math.abs(cat.remaining) > Math.abs(worst.remaining) ? cat : worst
    );
    
    suggestions.push({
      type: 'improvement',
      icon: Target,
      title: `Reduce ${worstCategory.name} Spending`,
      message: `You're NOK ${Math.abs(worstCategory.remaining).toLocaleString()} over budget in ${worstCategory.name}. Small cuts here could improve your financial health.`,
      action: 'Set spending limit',
      color: 'yellow',
      priority: 3
    });
  }

  // Savings rate suggestions
  if (savingsRate < 10) {
    suggestions.push({
      type: 'improvement',
      icon: TrendingUp,
      title: 'Boost Your Savings Rate',
      message: `Your current savings rate is ${savingsRate.toFixed(1)}%. Try to reach 10-20% by finding small areas to cut back.`,
      action: 'Find savings opportunities',
      color: 'blue',
      priority: 4
    });
  } else if (savingsRate >= 20) {
    suggestions.push({
      type: 'positive',
      icon: TrendingUp,
      title: 'Excellent Savings Rate!',
      message: `Your ${savingsRate.toFixed(1)}% savings rate is fantastic! Consider if you want to invest some of this for growth.`,
      action: 'Explore investment options',
      color: 'green',
      priority: 5
    });
  }

  // Cash flow timing suggestions
  if (netLeftover > 0 && daysUntilPaycheck > 14) {
    const dailyBudget = netLeftover / daysUntilPaycheck;
    suggestions.push({
      type: 'tip',
      icon: Calendar,
      title: 'Daily Spending Budget',
      message: `You have NOK ${dailyBudget.toFixed(0)} per day until your next paycheck. Staying within this keeps you on track.`,
      action: 'Set daily spending alert',
      color: 'blue',
      priority: 6
    });
  }

  // Emergency fund suggestion
  const totalAvailable = 19017.50; // This would come from props
  const monthlyExpenses = spendingCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const emergencyFundMonths = totalAvailable / monthlyExpenses;
  
  if (emergencyFundMonths < 3) {
    suggestions.push({
      type: 'improvement',
      icon: DollarSign,
      title: 'Build Emergency Fund',
      message: `Your current savings cover ${emergencyFundMonths.toFixed(1)} months of expenses. Aim for 3-6 months for financial security.`,
      action: 'Start emergency fund',
      color: 'blue',
      priority: 7
    });
  }

  // Sort suggestions by priority and take top 4
  const topSuggestions = suggestions
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 4);

  if (topSuggestions.length === 0) {
    topSuggestions.push({
      type: 'positive',
      icon: TrendingUp,
      title: 'Great Financial Health!',
      message: 'Your finances look healthy. Keep up the good work with budgeting and saving.',
      action: 'Keep it up',
      color: 'green',
      priority: 1
    });
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-50 border-red-200 text-red-800';
      case 'yellow': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'blue': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'green': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'red': return 'text-red-600';
      case 'yellow': return 'text-yellow-600';
      case 'blue': return 'text-blue-600';
      case 'green': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  // Show only 2 suggestions for free users
  const freeSuggestions = topSuggestions.slice(0, 2);
  const premiumSuggestions = topSuggestions.slice(2);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Lightbulb className="h-6 w-6 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900">Smart Suggestions</h3>
        <span className="text-sm text-gray-500">Personalized tips to improve your finances</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {freeSuggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <div
              key={index}
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
        
        {/* Premium Suggestions Teaser */}
        {premiumSuggestions.length > 0 && (
          <div className="md:col-span-2">
            <div className="p-4 rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Star className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Advanced AI Insights</h4>
                    <p className="text-sm text-gray-600">
                      Get {premiumSuggestions.length} more personalized recommendations with premium
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Lock className="h-5 w-5 text-purple-600" />
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                    Upgrade
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Financial Awareness Tips */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
        <h4 className="font-semibold text-gray-900 mb-2">💡 Financial Awareness Tips</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-medium mb-1">Track Daily Spending</p>
            <p>Small purchases add up. Being aware of daily spending helps you stay on budget.</p>
          </div>
          <div>
            <p className="font-medium mb-1">Review Weekly</p>
            <p>Check your finances weekly to catch issues early and stay on track with goals.</p>
          </div>
          <div>
            <p className="font-medium mb-1">Automate Savings</p>
            <p>Set up automatic transfers to savings so you pay yourself first.</p>
          </div>
          <div>
            <p className="font-medium mb-1">Plan for Irregular Expenses</p>
            <p>Car repairs, medical bills, and other surprises are easier to handle when planned for.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartSuggestions;