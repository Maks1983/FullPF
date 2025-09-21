import React from 'react';
import {
  Wallet2,
  Timer,
  CalendarClock,
  TrendingUp,
  ArrowRight,
  BellRing
} from 'lucide-react';
import type { UpcomingPayment } from '../../types/current';
import type { TimeframeType } from '../../types/financial';

interface HealthStatus {
  status: string;
  emoji: string;
  message: string;
}

interface AtAGlanceBannerProps {
  totalAvailable: number;
  netLeftover: number;
  daysUntilPaycheck: number;
  deficitDays?: number;
  nextPayment?: UpcomingPayment;
  monthlyIncome: number;
  monthlyExpenses: number;
  overdueCount: number;
  todaySpending: number;
  healthStatus?: HealthStatus;
  timeframe: TimeframeType;
  onTimeframeChange: (timeframe: TimeframeType) => void;
  onViewDetails: () => void;
  onViewPayments: () => void;
  onViewNetCashflow: () => void;
}

const formatCurrency = (value: number) => value.toLocaleString('no-NO', { maximumFractionDigits: 0 });

const AtAGlanceBanner: React.FC<AtAGlanceBannerProps> = ({
  totalAvailable,
  netLeftover,
  daysUntilPaycheck,
  deficitDays,
  nextPayment,
  monthlyIncome,
  monthlyExpenses,
  overdueCount,
  todaySpending,
  healthStatus,
  timeframe,
  onTimeframeChange,
  onViewDetails,
  onViewPayments,
  onViewNetCashflow
}) => {
  const netCashflow = monthlyIncome - monthlyExpenses;
  const runwayLabel = (() => {
    if (typeof deficitDays === 'number' && deficitDays >= 0 && deficitDays !== 999) {
      return deficitDays === 0 ? 'Cash runs out today' : `${deficitDays} day${deficitDays === 1 ? '' : 's'} of runway`;
    }

    if (daysUntilPaycheck <= 0) {
      return 'Payday today';
    }

    return `${daysUntilPaycheck} day${daysUntilPaycheck === 1 ? '' : 's'} to payday`;
  })();

  const runwayTone = netLeftover >= 0 ? 'text-emerald-400' : 'text-amber-400';
  const cashflowTone = netCashflow >= 0 ? 'text-emerald-400' : 'text-amber-400';

  return (
    <section className="bg-slate-900 text-white rounded-xl px-6 py-5 shadow-lg border border-slate-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Cash cockpit</p>
          <h2 className="text-2xl font-semibold mt-1">
            Right now {healthStatus?.emoji ?? ''}
          </h2>
          {healthStatus?.message && (
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              {healthStatus.message}
            </p>
          )}
        </div>

        {/* Timeframe Filter */}
        <div className="flex bg-slate-800/70 rounded-lg p-1">
          {(['1M', '3M', '6M', '1Y'] as const).map((period) => (
            <button
              key={period}
              onClick={() => onTimeframeChange(period)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                timeframe === period
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="flex items-center space-x-3 bg-slate-800/60 rounded-lg px-4 py-3"
        >
          <div className="p-2 bg-slate-900/60 rounded-lg">
            <Wallet2 className="h-5 w-5 text-sky-300" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Available now</p>
            <p className="text-2xl font-semibold">NOK {formatCurrency(totalAvailable)}</p>
            <p className="text-xs text-slate-400">After bills: NOK {formatCurrency(netLeftover)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-slate-800/60 rounded-lg px-4 py-3">
          <div className="p-2 bg-slate-900/60 rounded-lg">
            <Timer className="h-5 w-5 text-sky-300" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Runway</p>
            <p className={`text-2xl font-semibold ${runwayTone}`}>{runwayLabel}</p>
            <p className="text-xs text-slate-400">Projected balance stays {netLeftover >= 0 ? 'positive' : 'negative'} before payday</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-slate-800/60 rounded-lg px-4 py-3">
          <div className="p-2 bg-slate-900/60 rounded-lg">
            <TrendingUp className={`h-5 w-5 ${netCashflow >= 0 ? 'text-emerald-300' : 'text-amber-300'}`} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Net cashflow</p>
            <p className={`text-2xl font-semibold ${cashflowTone}`}>
              {netCashflow >= 0 ? '+' : '-'}NOK {formatCurrency(Math.abs(netCashflow))}
            </p>
            <p className="text-xs text-slate-400">In: {formatCurrency(monthlyIncome)} • Out: {formatCurrency(monthlyExpenses)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-slate-800/60 rounded-lg px-4 py-3">
          <div className="p-2 bg-slate-900/60 rounded-lg">
            <CalendarClock className="h-5 w-5 text-sky-300" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Next payment</p>
            {nextPayment ? (
              <>
                <p className="text-2xl font-semibold">{formatCurrency(Math.abs(nextPayment.amount))} NOK</p>
                <p className="text-xs text-slate-400">
                  {nextPayment.description} • {new Date(nextPayment.dueDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-300">No payments scheduled before payday</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <p className="text-xs uppercase tracking-wide text-slate-400">Quick actions</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onViewDetails}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/70 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            <Wallet2 className="h-4 w-4" aria-hidden="true" />
            Cash details
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onViewPayments}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/70 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            <BellRing className="h-4 w-4" aria-hidden="true" />
            Upcoming bills
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onViewNetCashflow}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/70 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            <TrendingUp className="h-4 w-4" aria-hidden="true" />
            Net cashflow modal
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AtAGlanceBanner;

