import React from 'react';
import { Wallet2, Timer, CalendarClock } from 'lucide-react';
import type { UpcomingPayment } from '../../types/current';

interface AtAGlanceBannerProps {
  totalAvailable: number;
  daysUntilPaycheck: number;
  nextPayment?: UpcomingPayment;
  deficitDays?: number;
  netLeftover: number;
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('no-NO', { maximumFractionDigits: 0 });
};

const AtAGlanceBanner: React.FC<AtAGlanceBannerProps> = ({
  totalAvailable,
  daysUntilPaycheck,
  nextPayment,
  deficitDays,
  netLeftover
}) => {
  const runwayLabel = (() => {
    if (typeof deficitDays === 'number' && deficitDays >= 0 && deficitDays !== 999) {
      return deficitDays === 0 ? 'Cash runs out today' : `${deficitDays} day${deficitDays === 1 ? '' : 's'} of runway`;
    }
    if (daysUntilPaycheck <= 0) {
      return 'Payday today';
    }
    return `${daysUntilPaycheck} day${daysUntilPaycheck === 1 ? '' : 's'} to payday`;
  })();

  const runwayTone = netLeftover >= 0 ? 'text-emerald-500' : 'text-amber-500';

  return (
    <div className="bg-slate-900 text-white rounded-xl px-6 py-4 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-800 rounded-lg">
            <Wallet2 className="h-5 w-5 text-sky-300" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Available Now</p>
            <p className="text-2xl font-bold">NOK {formatCurrency(totalAvailable)}</p>
            <p className="text-xs text-slate-400">Net after bills: NOK {formatCurrency(netLeftover)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-800 rounded-lg">
            <Timer className="h-5 w-5 text-sky-300" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Runway</p>
            <p className={`text-2xl font-bold ${runwayTone}`}>{runwayLabel}</p>
            <p className="text-xs text-slate-400">Projected balance stays {netLeftover >= 0 ? 'positive' : 'negative'} before payday</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-800 rounded-lg">
            <CalendarClock className="h-5 w-5 text-sky-300" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Next Payment</p>
            {nextPayment ? (
              <>
                <p className="text-2xl font-bold">{Math.abs(nextPayment.amount).toLocaleString('no-NO', { maximumFractionDigits: 0 })} NOK</p>
                <p className="text-xs text-slate-400">
                  {nextPayment.description} • {new Date(nextPayment.dueDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                </p>
              </>
            ) : (
              <p className="text-base text-slate-300">No payments scheduled</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtAGlanceBanner;
