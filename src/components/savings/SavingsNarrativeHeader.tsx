import React, { useMemo } from 'react';
import {
  CalendarClock,
  TrendingUp,
  Zap,
  Plus,
  BadgeDollarSign
} from 'lucide-react';
import type { TimeframeType } from '../../types/financial';

export interface SavingsKpi {
  id: string;
  label: string;
  value: string;
  helper?: string;
  tone?: 'positive' | 'caution' | 'info';
  icon: React.ComponentType<{ className?: string }>;
  iconClassName?: string;
  iconContainerClassName?: string;
  onClick?: () => void;
}

export interface PremiumSuggestion {
  id: string;
  title: string;
  description: string;
  action: string;
  color: 'red' | 'yellow' | 'blue' | 'green';
  icon: React.ComponentType<{ className?: string }>;
}
interface SavingsNarrativeHeaderProps {
  timeframe: TimeframeType;
  onTimeframeChange: (timeframe: TimeframeType) => void;
  state: 'foundationInProgress' | 'foundationCompleteNoGoals' | 'foundationCompleteWithGoals';
  heroTitle: string;
  heroSubtitle: string;
  kpis: SavingsKpi[];
  goalWeeksAhead: number;
}

const timeframeOptions: TimeframeType[] = ['1M', '3M', '6M', '1Y'];

const SavingsNarrativeHeader: React.FC<SavingsNarrativeHeaderProps> = ({
  timeframe,
  onTimeframeChange,
  heroTitle,
  heroSubtitle,
  kpis,
}) => {
  const quickActions = useMemo(
    () => ([
      { id: 'boost-plan', label: 'Boost Plan', icon: Zap },
      { id: 'deposit', label: 'Deposit', icon: Plus },
      { id: 'timeline', label: 'Adjust Timeline', icon: CalendarClock },
      { id: 'pay-debt', label: 'Pay Debt', icon: BadgeDollarSign },
      { id: 'invest', label: 'Invest', icon: TrendingUp },
    ]),
    []
  );


  return (
    <section className="bg-white text-gray-900 rounded-xl px-6 py-6 shadow-sm border border-gray-200">
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Savings cockpit</p>
            <h1 className="text-2xl font-semibold mt-1 leading-snug text-gray-900">{heroTitle}</h1>
            <p className="text-sm text-gray-600 mt-2 max-w-2xl leading-relaxed">{heroSubtitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-stretch xl:self-auto">
          <span className="text-xs uppercase tracking-wide text-gray-500">View:</span>
          <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
            {timeframeOptions.map((period) => (
              <button
                key={period}
                type="button"
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

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const toneClasses = kpi.tone === 'positive'
            ? 'border-emerald-200 bg-emerald-50'
            : kpi.tone === 'caution'
              ? 'border-amber-200 bg-amber-50'
              : 'border-gray-200 bg-gray-50';
          const Icon = kpi.icon;
          const iconContainerClasses = kpi.iconContainerClassName ?? 'bg-white border border-gray-200';
          const iconColorClass = kpi.iconClassName ?? 'text-blue-600';

          const cardContent = (
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${iconContainerClasses}`}>
                <Icon className={`h-5 w-5 ${iconColorClass}`} aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-gray-500">{kpi.label}</p>
                <p className="text-xl font-semibold text-gray-900">{kpi.value}</p>
                {kpi.helper && (
                  <p className="text-xs text-gray-600 leading-relaxed">{kpi.helper}</p>
                )}
              </div>
            </div>
          );

          if (kpi.onClick) {
            return (
              <button
                key={kpi.id}
                type="button"
                onClick={kpi.onClick}
                className={`rounded-lg px-4 py-4 border ${toneClasses} w-full text-left cursor-pointer transition-colors hover:border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-200`}
              >
                {cardContent}
              </button>
            );
          }

          return (
            <div
              key={kpi.id}
              className={`rounded-lg px-4 py-4 border ${toneClasses}`}
            >
              {cardContent}
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <p className="text-xs uppercase tracking-wide text-gray-500">Quick actions</p>
        <div className="flex flex-wrap gap-2">
          {quickActions.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
