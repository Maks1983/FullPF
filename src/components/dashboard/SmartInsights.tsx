import React from "react";
import { Zap, Star } from "lucide-react";
import SmartInsightCard from "../common/SmartInsightCard";
import { useLicenseGating } from "../../hooks/useLicenseGating";

interface SmartInsightsProps {
  insights: Array<{
    type: "opportunity" | "warning" | "achievement";
    title: string;
    message: string;
    impact: string;
    action: string;
    icon: React.ElementType;
    color: "green" | "yellow" | "blue" | "red";
  }>;
}

const SmartInsights: React.FC<SmartInsightsProps> = ({ insights }) => {
  const { canUseSmartInsights, getUpgradeMessage } = useLicenseGating();

  if (!canUseSmartInsights) {
    return (
      <div className="rounded-2xl bg-gradient-to-r from-purple-100 to-purple-50 border border-purple-200 p-6 text-purple-900 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-purple-900">
              Smart Insights
            </h3>
            <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-white text-purple-700">
              PREMIUM
            </span>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 mb-4 border border-purple-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        </div>

        <p className="mb-4 text-purple-800">
          {getUpgradeMessage("Smart Insights")}
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
            <Zap className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-purple-900">
              Smart Insights
            </h3>
          </div>
          <button className="inline-flex items-center rounded-full border border-purple-200 bg-white/70 px-3 py-1 text-sm font-medium text-purple-700 shadow-sm transition-colors hover:bg-white">
            View All
          </button>
        </div>
        <p className="text-sm text-purple-700">
          Premium insights blend your balances, goals, and trends into quick
          wins and risk alerts.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {insights.map((insight, index) => (
            <SmartInsightCard key={index} {...insight} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartInsights;
