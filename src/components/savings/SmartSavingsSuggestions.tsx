import React from "react";
import {
  Lightbulb,
  Target,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Star,
  Zap,
} from "lucide-react";
import { useLicenseGating } from "../../hooks/useLicenseGating";

type SuggestionColor = "red" | "yellow" | "blue" | "green";

type Suggestion = {
  type: "urgent" | "warning" | "improvement" | "positive" | "tip";
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
}) => {
  const { canUseSmartSuggestions, getUpgradeMessage } = useLicenseGating();

  const suggestions: Suggestion[] = [];

  // Emergency fund coverage analysis
  if (monthsOfCoverage < 3) {
    suggestions.push({
      type: "urgent",
      icon: AlertCircle,
      title: "Build Emergency Foundation",
      message: `You have ${monthsOfCoverage.toFixed(1)} months of coverage. Aim for 3-6 months to protect against unexpected expenses.`,
      action: "Boost emergency fund",
      color: "red",
      priority: 1,
    });
  } else if (monthsOfCoverage >= 6) {
    suggestions.push({
      type: "positive",
      icon: TrendingUp,
      title: "Outstanding Emergency Fund!",
      message: `Your ${monthsOfCoverage.toFixed(1)} months of coverage provides excellent financial security. Consider investing surplus for growth.`,
      action: "Explore investment options",
      color: "green",
      priority: 5,
    });
  }

  // Savings rate optimization
  if (savingsRate < 10) {
    suggestions.push({
      type: "improvement",
      icon: Target,
      title: "Boost Your Savings Rate",
      message: `Your ${savingsRate.toFixed(1)}% savings rate has room for improvement. Try to reach 15-20% by finding small areas to optimize.`,
      action: "Find savings opportunities",
      color: "yellow",
      priority: 2,
    });
  } else if (savingsRate >= 25) {
    suggestions.push({
      type: "positive",
      icon: Zap,
      title: "Exceptional Savings Discipline!",
      message: `Your ${savingsRate.toFixed(1)}% savings rate is outstanding! You're building wealth faster than most people.`,
      action: "Keep up the momentum",
      color: "green",
      priority: 6,
    });
  }

  // Goal acceleration opportunities
  if (monthsToGoal > 0 && monthlyContribution > 0) {
    const boostAmount = 500;
    const acceleratedMonths = Math.ceil(
      (targetAmount - currentSavings) / (monthlyContribution + boostAmount),
    );
    const timeSaved = monthsToGoal - acceleratedMonths;

    if (timeSaved > 0) {
      suggestions.push({
        type: "tip",
        icon: Target,
        title: "Accelerate Your Goal",
        message: `Adding just NOK ${boostAmount.toLocaleString()}/month could reach your goal ${timeSaved} month${timeSaved === 1 ? "" : "s"} faster!`,
        action: "Boost contributions",
        color: "blue",
        priority: 3,
      });
    }
  }

  // Momentum analysis
  if (averageMonthlyGrowth > 0) {
    const growthRate = (averageMonthlyGrowth / currentSavings) * 100;
    if (growthRate > 8) {
      suggestions.push({
        type: "positive",
        icon: TrendingUp,
        title: "Incredible Savings Momentum!",
        message: `Your ${growthRate.toFixed(1)}% monthly growth rate is exceptional. You're on track for serious wealth building.`,
        action: "Maintain this pace",
        color: "green",
        priority: 4,
      });
    } else if (growthRate < 3) {
      suggestions.push({
        type: "improvement",
        icon: DollarSign,
        title: "Increase Savings Velocity",
        message: `Your ${growthRate.toFixed(1)}% monthly growth could be accelerated. Consider automating larger transfers.`,
        action: "Set up auto-save",
        color: "blue",
        priority: 3,
      });
    }
  }

  // Interest rate optimization
  const currentRate = 4.2; // This could be passed as prop
  if (currentRate < 4.0) {
    suggestions.push({
      type: "improvement",
      icon: TrendingUp,
      title: "Optimize Interest Earnings",
      message: `Your ${currentRate}% rate is decent, but high-yield accounts offer 4.5%+. Extra interest compounds over time.`,
      action: "Compare rates",
      color: "blue",
      priority: 4,
    });
  }

  // Goal completion celebration
  if (goalProgress >= 100) {
    suggestions.push({
      type: "positive",
      icon: Target,
      title: "🎉 Goal Achieved!",
      message:
        "Congratulations on reaching your savings goal! Time to set your next wealth-building milestone.",
      action: "Set new goal",
      color: "green",
      priority: 1,
    });
  }

  const topSuggestions = suggestions
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);

  if (topSuggestions.length === 0) {
    topSuggestions.push({
      type: "positive",
      icon: TrendingUp,
      title: "Excellent Savings Health!",
      message:
        "Your savings strategy is working beautifully. Keep building wealth with your disciplined approach.",
      action: "Stay the course",
      color: "green",
      priority: 8,
    });
  }

  const getColorClasses = (color: SuggestionColor) => {
    switch (color) {
      case "red":
        return "border-red-200 bg-white/80 text-red-700";
      case "yellow":
        return "border-amber-200 bg-white/80 text-amber-700";
      case "blue":
        return "border-blue-200 bg-white/80 text-blue-700";
      case "green":
        return "border-emerald-200 bg-white/80 text-emerald-700";
      default:
        return "border-gray-200 bg-white/80 text-gray-800";
    }
  };

  const getIconColor = (color: SuggestionColor) => {
    switch (color) {
      case "red":
        return "text-red-600";
      case "yellow":
        return "text-yellow-600";
      case "blue":
        return "text-blue-600";
      case "green":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  if (!canUseSmartSuggestions) {
    return (
      <div className="rounded-2xl bg-gradient-to-r from-purple-100 to-purple-50 border border-purple-200 p-6 text-purple-900 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-purple-900">
              Smart Suggestions
            </h3>
            <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-white text-purple-700">
              PREMIUM
            </span>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 mb-4 border border-purple-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="p-4 bg-gray-100 rounded-lg border border-gray-200"
              >
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

        <p className="mb-4 text-purple-800">
          {getUpgradeMessage("Smart Suggestions")}
        </p>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Upgrade to Premium
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-100 via-purple-50 to-purple-100 p-6 text-purple-900 shadow-sm">
      <div
        className="absolute -top-12 right-2 h-32 w-32 rounded-full bg-purple-200/40 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-16 left-2 h-32 w-32 rounded-full bg-blue-200/30 blur-3xl"
        aria-hidden
      />
      <div className="relative space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-purple-900">
              Smart Suggestions
            </h3>
            <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-white text-purple-700">
              PREMIUM
            </span>
          </div>
        </div>
        <p className="text-sm text-purple-700">
          Guided savings opportunities tailored to your goals and emergency
          plan.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topSuggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <div
                key={`${suggestion.title}-${index}`}
                className={`rounded-xl border p-4 backdrop-blur-sm ${getColorClasses(suggestion.color)}`}
              >
                <div className="flex items-start space-x-3">
                  <Icon
                    className={`mt-0.5 h-5 w-5 ${getIconColor(suggestion.color)}`}
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {suggestion.title}
                    </h4>
                    <p className="mt-1 text-sm text-gray-700">
                      {suggestion.message}
                    </p>
                    <button
                      className={`mt-3 text-sm font-medium ${getIconColor(suggestion.color)} hover:underline`}
                    >
                      {suggestion.action} →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-white/60 bg-white/70 p-4 backdrop-blur-sm">
          <h4 className="mb-2 font-semibold text-gray-900">
            💡 Wealth-Building Wisdom
          </h4>
          <div className="grid grid-cols-1 gap-4 text-sm text-gray-700 md:grid-cols-2">
            <div>
              <p className="mb-1 font-medium">Automate Your Success</p>
              <p>
                Set up automatic transfers so you pay yourself first, before you
                can spend it.
              </p>
            </div>
            <div>
              <p className="mb-1 font-medium">Compound Interest Magic</p>
              <p>
                Every month you delay saving costs you future wealth. Start now,
                even with small amounts.
              </p>
            </div>
            <div>
              <p className="mb-1 font-medium">Emergency Fund First</p>
              <p>
                Build 3-6 months of expenses before aggressive investing.
                Security enables risk-taking.
              </p>
            </div>
            <div>
              <p className="mb-1 font-medium">Celebrate Milestones</p>
              <p>
                Acknowledge your progress! Each deposit is a step toward
                financial independence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartSavingsSuggestions;
