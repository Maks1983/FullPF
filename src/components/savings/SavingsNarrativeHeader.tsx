import React from 'react';
import { Target, TrendingUp, Calendar, Sparkles, Plus, Zap } from 'lucide-react';
import type { TimeframeType } from '../../types/financial';

interface SavingsNarrativeHeaderProps {
  timeframe: TimeframeType;
  onTimeframeChange: (timeframe: TimeframeType) => void;
  goalName: string;
  targetAmount: number;
  currentSavings: number;
  remainingToGoal: number;
  coverageMonths: number;
  savingsRate: number;
  averageMonthlyGrowth: number;
  monthsToGoal: number;
  monthsSaved: number;
  goalWeeksAhead: number;
  momentumMultiplier: number;
  isAheadOfSchedule: boolean;
}

const timeframeOptions: TimeframeType[] = ['1M', '3M', '6M', '1Y'];

const formatCurrency = (value: number) =>
  `NOK ${value.toLocaleString('no-NO', { maximumFractionDigits: 0 })}`;

const formatSignedCurrency = (value: number) =>
  `${value >= 0 ? '+' : '-'}${formatCurrency(Math.abs(value))}`;

const formatPercentage = (value: number) =>
  `${value.toFixed(1)}%`;

const SavingsNarrativeHeader: React.FC<SavingsNarrativeHeaderProps> = ({
  timeframe,
  onTimeframeChange,
  goalName,
  targetAmount,
  currentSavings,
  remainingToGoal,
  coverageMonths,
  savingsRate,
  averageMonthlyGrowth,
  monthsToGoal,
  monthsSaved,
  goalWeeksAhead,
  momentumMultiplier,
  isAheadOfSchedule
}) => {
  const coveragePercentage = targetAmount > 0 ? (currentSavings / targetAmount) * 100 : 0;

  const statusMessage = (() => {
    if (monthsToGoal <= 0) {
      return `🎉 ${goalName} is fully funded. Time to define your next savings milestone.`;
    }

    if (monthsSaved > 0) {
      return `You are ${monthsToGoal} months away from ${goalName}. Boosting contributions trims about ${monthsSaved} month${monthsSaved === 1 ? '' : 's'} off that timeline.`;
    }

    return `About ${monthsToGoal} month${monthsToGoal === 1 ? '' : 's'} remain to reach ${goalName}. Keep saving consistently to stay on track.`;
  })();

  const coverageMessage = (() => {
    if (coverageMonths >= 6) return 'Safety net secured — six months of expenses covered.';
    if (coverageMonths >= 3) return 'Solid footing — over three months of expenses covered.';
    return 'Keep building your cushion — aim for at least three months of coverage.';
  })();

  const quickActions = [
    { id: 'deposit', label: 'Add deposit', icon: Plus },
    { id: 'boost', label: 'Boost plan', icon: Zap },
    { id: 'schedule', label: 'Adjust timeline', icon: Calendar }
  ];

  return (
    <section className="bg-slate-900 text-white rounded-xl px-6 py-6 shadow-lg border border-slate-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Savings cockpit</p>
          <h1 className="text-2xl font-semibold mt-1">{goalName} status</h1>
          <p className="text-sm text-slate-300 mt-2 max-w-xl">{statusMessage}</p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs uppercase tracking-wide text-slate-400">View:</span>
          <div className="flex bg-slate-800/70 rounded-lg p-1">
            {timeframeOptions.map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => onTimeframeChange(period)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  timeframe === period
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center space-x-3 bg-slate-800/60 rounded-lg px-4 py-4">
          <div className="p-2 bg-slate-900/60 rounded-lg text-sky-300">
            <TrendingUp className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Savings momentum</p>
            <p className="text-2xl font-semibold text-white">{momentumMultiplier > 0 ? `${momentumMultiplier.toFixed(1)}× faster` : 'On hold'}</p>
            <p className="text-xs text-slate-400">vs previous period in this view</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-slate-800/60 rounded-lg px-4 py-4">
          <div className="p-2 bg-slate-900/60 rounded-lg text-indigo-300">
            <Calendar className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Emergency coverage</p>
            <p className="text-2xl font-semibold text-white">{coverageMonths.toFixed(1)} months</p>
            <p className="text-xs text-slate-400">How long your savings cover expenses</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-slate-800/60 rounded-lg px-4 py-4">
          <div className="p-2 bg-slate-900/60 rounded-lg text-fuchsia-300">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Savings rate</p>
            <p className="text-2xl font-semibold text-white">{formatPercentage(savingsRate)}</p>
            <p className={`text-xs font-semibold ${isAheadOfSchedule ? 'text-emerald-300' : 'text-slate-400'}`}>
              {isAheadOfSchedule ? 'Ahead of target' : 'Aim for 20% savings rate'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-slate-800/60 rounded-lg px-4 py-4">
          <div className="p-2 bg-slate-900/60 rounded-lg text-emerald-300">
            <Target className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Goal progress</p>
            <p className="text-2xl font-semibold text-white">
              {coveragePercentage >= 100 ? 'Goal reached' : `${coveragePercentage.toFixed(0)}% complete`}
            </p>
            <p className="text-xs text-slate-400">
              {goalWeeksAhead > 0
                ? `Ahead by ~${goalWeeksAhead} week${goalWeeksAhead === 1 ? '' : 's'} 🚀`
                : remainingToGoal > 0
                  ? `${formatCurrency(remainingToGoal)} remaining`
                  : `${formatCurrency(Math.abs(remainingToGoal))} surplus`}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <p className="text-xs uppercase tracking-wide text-slate-400">Quick actions</p>
        <div className="flex flex-wrap gap-2">
          {quickActions.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/70 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label={label}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SavingsNarrativeHeader;
