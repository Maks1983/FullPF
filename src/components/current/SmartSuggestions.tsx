import React from "react";
import {
  Lightbulb,
  Target,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Calendar,
  Star,
} from "lucide-react";
import { useLicenseGating } from "../../hooks/useLicenseGating";
import type { SpendingCategory } from "../../types/current";

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

interface SmartSuggestionsProps {
  netLeftover: number;
  savingsRate: number;
  spendingCategories: SpendingCategory[];
  overdueCount: number;
  daysUntilPaycheck: number;
  totalAvailable: number;
  monthlyExpenses: number;
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  netLeftover,
  savingsRate,
  spendingCategories,
  overdueCount,
  daysUntilPaycheck,
  totalAvailable,
  monthlyExpenses,
}) => {
  const { canUseSmartSuggestions, getUpgradeMessage } = useLicenseGating();

  const suggestions: Suggestion[] = [];

  if (overdueCount > 0) {
    suggestions.push({
      type: "urgent",
      icon: AlertCircle,
      title: "Pay Overdue Bills Immediately",
      message: `You have ${overdueCount} overdue payment${overdueCount > 1 ? "s" : ""}. Late fees and credit score damage can be costly.`,
      action: "Review overdue payments",
      color: "red",
      priority: 1,
    });
  }

  if (netLeftover < 0) {
    suggestions.push({
      type: "warning",
      icon: AlertCircle,
      title: "Money Will Run Short",
      message: `You're projected to be NOK ${Math.abs(netLeftover).toLocaleString()} short before your next paycheck. Consider reducing expenses or using credit carefully.`,
      action: "Review upcoming expenses",
      color: "red",
      priority: 2,
    });
  }

  const overBudgetCategories = spendingCategories.filter(
    (category) => category.isOverBudget,
  );
  if (overBudgetCategories.length > 0) {
    const worstCategory = overBudgetCategories.reduce(
      (currentWorst, category) =>
        Math.abs(category.remaining) > Math.abs(currentWorst.remaining)
          ? category
          : currentWorst,
      overBudgetCategories[0],
    );

    suggestions.push({
      type: "improvement",
      icon: Target,
      title: `Reduce ${worstCategory.name} Spending`,
      message: `You're NOK ${Math.abs(worstCategory.remaining).toLocaleString()} over budget in ${worstCategory.name}. Small cuts here could improve your financial health.`,
      action: "Set spending limit",
      color: "yellow",
      priority: 3,
    });
  }

  const normalizedSavingsRate = Number.isFinite(savingsRate) ? savingsRate : 0;
  if (normalizedSavingsRate < 10) {
    suggestions.push({
      type: "improvement",
      icon: TrendingUp,
      title: "Boost Your Savings Rate",
      message: `Your current savings rate is ${normalizedSavingsRate.toFixed(1)}%. Try to reach 10-20% by finding small areas to cut back.`,
      action: "Find savings opportunities",
      color: "blue",
      priority: 4,
    });
  } else if (normalizedSavingsRate >= 20) {
    suggestions.push({
      type: "positive",
      icon: TrendingUp,
      title: "Excellent Savings Rate!",
      message: `Your ${normalizedSavingsRate.toFixed(1)}% savings rate is fantastic! Consider if you want to invest some of this for growth.`,
      action: "Explore investment options",
      color: "green",
      priority: 5,
    });
  }

  if (netLeftover > 0 && daysUntilPaycheck > 0) {
    const dailyBudget = netLeftover / daysUntilPaycheck;
    suggestions.push({
      type: "tip",
      icon: Calendar,
      title: "Daily Spending Budget",
      message: `You have NOK ${dailyBudget.toFixed(0)} per day until your next paycheck. Staying within this keeps you on track.`,
      action: "Set daily spending alert",
      color: "blue",
      priority: 6,
    });
  }

  const normalizedMonthlyExpenses =
    monthlyExpenses ||
    spendingCategories.reduce((sum, category) => sum + category.spent, 0);
  if (normalizedMonthlyExpenses > 0) {
    const emergencyFundMonths = totalAvailable / normalizedMonthlyExpenses;
    if (emergencyFundMonths < 3) {
      suggestions.push({
        type: "improvement",
        icon: DollarSign,
        title: "Build Emergency Fund",
        message: `Your current savings cover ${emergencyFundMonths.toFixed(1)} months of expenses. Aim for 3-6 months for financial security.`,
        action: "Start emergency fund",
        color: "blue",
        priority: 7,
      });
    }
  }

  const topSuggestions = suggestions
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);

  if (topSuggestions.length === 0) {
    topSuggestions.push({
      type: "positive",
      icon: TrendingUp,
      title: "Great Financial Health!",
      message:
        "Your finances look healthy. Keep up the good work with budgeting and saving.",
      action: "Keep it up",
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
        return "text-rose-500";
      case "yellow":
        return "text-amber-500";
      case "blue":
        return "text-blue-500";
      case "green":
        return "text-emerald-500";
      default:
        return "text-gray-500";
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

        <div className="bg-gray-50 rounded-lg p-6 mb-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg border border-gray-200"
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

          <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
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
        className="absolute -top-12 right-0 h-32 w-32 rounded-full bg-purple-200/40 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-16 left-4 h-32 w-32 rounded-full bg-blue-200/30 blur-3xl"
        aria-hidden
      />
      <div className="relative space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Lightbulb className="h-6 w-6 text-amber-500" />
            <h3 className="text-lg font-semibold text-purple-900">
              Smart Suggestions
            </h3>
            <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-white text-purple-700">
              PREMIUM
            </span>
          </div>
        </div>
        <p className="text-sm text-purple-700">
          Personalized tips to improve your finances.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {topSuggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <div
                key={`${suggestion.title}-${index}`}
                className={`p-4 rounded-xl border backdrop-blur-sm ${getColorClasses(suggestion.color)}`}
              >
                <div className="flex items-start space-x-3">
                  <Icon
                    className={`h-5 w-5 mt-0.5 ${getIconColor(suggestion.color)}`}
                  />
                  <div className="flex-1">
                    <h4 className="mb-1 font-semibold text-gray-900">
                      {suggestion.title}
                    </h4>
                    <p className="mb-3 text-sm text-gray-700">
                      {suggestion.message}
                    </p>
                    <button
                      className={`text-sm font-medium ${getIconColor(suggestion.color)} hover:underline`}
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
            💡 Financial Awareness Tips
          </h4>
          <div className="grid grid-cols-1 gap-4 text-sm text-gray-700 md:grid-cols-2">
            <div>
              <p className="mb-1 font-medium">Track Daily Spending</p>
              <p>
                Small purchases add up. Being aware of daily spending helps you
                stay on budget.
              </p>
            </div>
            <div>
              <p className="mb-1 font-medium">Review Weekly</p>
              <p>
                Check your finances weekly to catch issues early and stay on
                track with goals.
              </p>
            </div>
            <div>
              <p className="mb-1 font-medium">Automate Savings</p>
              <p>
                Set up automatic transfers to savings so you pay yourself first.
              </p>
            </div>
            <div>
              <p className="mb-1 font-medium">Plan for Irregular Expenses</p>
              <p>
                Car repairs, medical bills, and other surprises are easier to
                handle when planned for.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartSuggestions;
