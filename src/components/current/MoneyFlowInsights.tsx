import React, { useMemo } from 'react';
import { PieChart, TrendingUp, Compass, Star } from 'lucide-react';
import type { SpendingCategory, RecentTransaction } from '../../types/current';
import { useLicenseGating } from '../../hooks/useLicenseGating';

interface MoneyFlowInsightsProps {
  monthlyIncome: number;
  monthlyExpenses: number;
  spendingCategories: SpendingCategory[];
  todaySpending: number;
  recentTransactions: RecentTransaction[];
}

const MoneyFlowInsights: React.FC<MoneyFlowInsightsProps> = ({
  monthlyIncome,
  monthlyExpenses,
  spendingCategories,
  todaySpending,
  recentTransactions
}) => {
  const { canUseSmartSuggestions, getUpgradeMessage } = useLicenseGating();

  if (!canUseSmartSuggestions) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-purple-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-purple-900">
              Money Flow Insights
            </h3>
            <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
              ADVANCED
            </span>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6 mb-4 border border-purple-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((index) => (
              <div key={index} className="p-4 bg-gray-100 rounded-lg border border-gray-200">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mb-4 text-purple-800">
          {getUpgradeMessage('smartSuggestions')}
        </p>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Upgrade to Advanced
        </button>
      </div>
    );
  }
  const categories = spendingCategories ?? [];
  const transactions = recentTransactions ?? [];

  const topCategories = useMemo(() => {
    return [...categories]
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 3);
  }, [categories]);

  const totalTracked = categories.reduce((sum, category) => sum + category.spent, 0);

  const lastSevenDays = useMemo(() => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    const periodTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate >= sevenDaysAgo && txDate <= today;
    });

    const spending = periodTransactions
      .filter(tx => tx.amount < 0)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    const income = periodTransactions
      .filter(tx => tx.amount > 0)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const averageDailySpend = monthlyExpenses > 0 ? monthlyExpenses / 30 : 0;
    const averageDailyIncome = monthlyIncome > 0 ? monthlyIncome / 30 : 0;

    return {
      income,
      spending,
      spendDelta: averageDailySpend > 0 ? ((spending / 7) / averageDailySpend) - 1 : 0,
      incomeDelta: averageDailyIncome > 0 ? ((income / 7) / averageDailyIncome) - 1 : 0,
    };
  }, [transactions, monthlyExpenses, monthlyIncome]);

  const spotlight = useMemo(() => {
    if (todaySpending === 0 && monthlyExpenses === 0) {
      return {
        title: 'Track your spending baseline',
        message: 'Connect more accounts or log a purchase to start seeing personalised tips.',
        tone: 'info' as const
      };
    }

    const dailyAverageSpending = monthlyExpenses > 0 ? monthlyExpenses / 30 : 0;
    if (dailyAverageSpending > 0 && todaySpending > dailyAverageSpending * 1.25) {
      return {
        title: 'Spending is running hot',
        message: `Today is NOK ${(todaySpending - dailyAverageSpending).toLocaleString('no-NO', { maximumFractionDigits: 0 })} above your daily baseline. Consider pausing discretionary purchases.`,
        tone: 'warn' as const
      };
    }

    if (categories.some(category => category.isOverBudget)) {
      const worst = categories
        .filter(category => category.isOverBudget)
        .sort((a, b) => Math.abs(b.remaining) - Math.abs(a.remaining))[0];
      return {
        title: `Watch ${worst.name}`,
        message: `You are NOK ${Math.abs(worst.remaining).toLocaleString('no-NO', { maximumFractionDigits: 0 })} over budget. Trim this category to stay on track.`,
        tone: 'warn' as const
      };
    }

    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
    if (savingsRate >= 20) {
      return {
        title: 'Great savings momentum',
        message: `You are keeping ${savingsRate.toFixed(1)}% of your income. Think about directing some into investments or an emergency fund.`,
        tone: 'positive' as const
      };
    }

    return {
      title: 'You are on track',
      message: 'Spending is sitting within typical levels today. Keep following your plan.',
      tone: 'info' as const
    };
  }, [todaySpending, monthlyExpenses, monthlyIncome, categories]);

  const getSpotlightTone = (tone: 'warn' | 'positive' | 'info') => {
    switch (tone) {
      case 'warn':
        return 'border-amber-300 bg-amber-50 text-amber-800';
      case 'positive':
        return 'border-emerald-300 bg-emerald-50 text-emerald-800';
      default:
        return 'border-slate-200 bg-slate-50 text-slate-700';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="col-span-1 lg:col-span-1 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="flex items-center space-x-3 px-5 pt-5">
          <div className="p-2 bg-slate-100 rounded-lg">
            <PieChart className="h-5 w-5 text-slate-600" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Where is money going?</h3>
            <p className="text-xs text-gray-500">Top categories this month</p>
          </div>
        </div>
        <div className="px-5 py-6 space-y-4">
          {topCategories.map(category => {
            const percentage = totalTracked > 0 ? (category.spent / totalTracked) * 100 : 0;
            return (
              <div key={category.name}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                  <span className="text-sm text-gray-600">{percentage.toFixed(0)}%</span>
                </div>
                <div className="mt-2 h-2 w-full bg-gray-200 rounded-full">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: category.color
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  NOK {category.spent.toLocaleString('no-NO', { maximumFractionDigits: 0 })}
                </p>
              </div>
            );
          })}

          {topCategories.length === 0 && (
            <p className="text-sm text-gray-500">No category data yet. Connect accounts to see category insights.</p>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="flex items-center space-x-3 px-5 pt-5">
          <div className="p-2 bg-slate-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-slate-600" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">What changed this week?</h3>
            <p className="text-xs text-gray-500">Last 7 days versus daily baseline</p>
          </div>
        </div>

        <div className="px-5 py-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 bg-slate-50 px-3 py-3 text-center">
              <p className="text-xs uppercase tracking-wide text-slate-500">Income</p>
              <p className="text-lg font-semibold text-gray-900">NOK {lastSevenDays.income.toLocaleString('no-NO', { maximumFractionDigits: 0 })}</p>
              <p className={`text-xs ${lastSevenDays.incomeDelta >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {lastSevenDays.incomeDelta >= 0 ? '+' : ''}{(lastSevenDays.incomeDelta * 100).toFixed(0)}% vs avg
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-slate-50 px-3 py-3 text-center">
              <p className="text-xs uppercase tracking-wide text-slate-500">Spending</p>
              <p className="text-lg font-semibold text-gray-900">NOK {lastSevenDays.spending.toLocaleString('no-NO', { maximumFractionDigits: 0 })}</p>
              <p className={`text-xs ${lastSevenDays.spendDelta <= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {lastSevenDays.spendDelta >= 0 ? '+' : ''}{(lastSevenDays.spendDelta * 100).toFixed(0)}% vs avg
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white px-4 py-3">
            <h4 className="text-sm font-medium text-gray-900">Daily spend pattern</h4>
            <p className="text-xs text-gray-500 mt-1">
              Today you have spent NOK {todaySpending.toLocaleString('no-NO', { maximumFractionDigits: 0 })}. Your average day is NOK {(monthlyExpenses / 30).toLocaleString('no-NO', { maximumFractionDigits: 0 })}.
            </p>
          </div>
        </div>
      </div>

      <div className={`border rounded-xl shadow-sm px-5 py-6 ${getSpotlightTone(spotlight.tone)}`}>
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-white/40 rounded-lg">
            <Compass className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-semibold">What should you do now?</h3>
            <p className="text-xs opacity-80">One focused recommendation</p>
          </div>
        </div>
        <h4 className="text-lg font-semibold mb-2">{spotlight.title}</h4>
        <p className="text-sm leading-relaxed">{spotlight.message}</p>
      </div>
    </div>
  );
};

export default MoneyFlowInsights;
