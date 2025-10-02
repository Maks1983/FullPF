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
  timeframe: TimeframeType;
  onTimeframeChange: (timeframe: TimeframeType) => void;
  totalAvailable: number;
  netLeftover: number;
  daysUntilPaycheck: number;
  deficitDays?: number;
  nextPayment?: UpcomingPayment;
  monthlyIncome: number;
  monthlyExpenses: number;
  overdueCount: number;
  healthStatus?: HealthStatus;
  onViewDetails: () => void;
  onViewPayments: () => void;
  onViewNetCashflow: () => void;
}

const formatCurrency = (value: number) => value.toLocaleString('no-NO', { maximumFractionDigits: 0 });

const AtAGlanceBanner: React.FC<AtAGlanceBannerProps> = ({
  timeframe,
  onTimeframeChange,
  totalAvailable,
  netLeftover,
  daysUntilPaycheck,
  deficitDays,
  nextPayment,
  monthlyIncome,
  monthlyExpenses,
  healthStatus,
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

  const runwayTone = netLeftover >= 0 ? 'text-emerald-600' : 'text-amber-600';
  const cashflowTone = netCashflow >= 0 ? 'text-emerald-600' : 'text-amber-600';

  return (
    <section className="bg-white text-gray-900 rounded-xl px-6 py-5 shadow-sm border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Cash cockpit</p>
          <h2 className="text-2xl font-semibold mt-1 text-gray-900">
            Right now {healthStatus?.emoji ?? ''}
          </h2>
          {healthStatus?.message && (
            <p className="text-sm text-gray-600 mt-1 max-w-xl">
              {healthStatus.message}
            </p>
          )}
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center space-x-3">
          <span className="text-xs uppercase tracking-wide text-gray-500">View:</span>
          <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
            {(['1M', '3M', '6M', '1Y'] as const).map((period) => (
              <button
                key={period}
                onClick={() => onTimeframeChange(period)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  timeframe === period
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
        >
          <div className="p-2 bg-white border border-gray-200 rounded-lg">
            <Wallet2 className="h-5 w-5 text-blue-600" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Available now</p>
            <p className="text-2xl font-semibold text-gray-900">NOK {formatCurrency(totalAvailable)}</p>
            <p className="text-xs text-gray-500">After bills: NOK {formatCurrency(netLeftover)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
          <div className="p-2 bg-white border border-gray-200 rounded-lg">
            <Timer className="h-5 w-5 text-blue-600" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Runway</p>
            <p className={`text-2xl font-semibold ${runwayTone}`}>{runwayLabel}</p>
            <p className="text-xs text-gray-500">Projected balance stays {netLeftover >= 0 ? 'positive' : 'negative'} before payday</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
          <div className="p-2 bg-white border border-gray-200 rounded-lg">
            <TrendingUp className={`h-5 w-5 ${netCashflow >= 0 ? 'text-emerald-600' : 'text-amber-600'}`} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Net cashflow</p>
            <p className={`text-2xl font-semibold ${cashflowTone}`}>
              {netCashflow >= 0 ? '+' : '-'}NOK {formatCurrency(Math.abs(netCashflow))}
            </p>
            <p className="text-xs text-gray-500">In: {formatCurrency(monthlyIncome)} • Out: {formatCurrency(monthlyExpenses)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
          <div className="p-2 bg-white border border-gray-200 rounded-lg">
            <CalendarClock className="h-5 w-5 text-blue-600" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Next payment</p>
            {nextPayment ? (
              <>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(Math.abs(nextPayment.amount))} NOK</p>
                <p className="text-xs text-gray-500">
                  {nextPayment.description} • {new Date(nextPayment.dueDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-600">No payments scheduled before payday</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <p className="text-xs uppercase tracking-wide text-gray-500">Quick actions</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onViewDetails}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <Wallet2 className="h-4 w-4" aria-hidden="true" />
            Cash details
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onViewPayments}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <BellRing className="h-4 w-4" aria-hidden="true" />
            Upcoming bills
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onViewNetCashflow}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
