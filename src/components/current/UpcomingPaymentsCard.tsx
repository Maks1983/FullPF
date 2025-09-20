import React from 'react';
import { ChevronRight, CalendarClock, AlertTriangle } from 'lucide-react';
import type { UpcomingPayment } from '../../types/current';

interface UpcomingPaymentsCardProps {
  upcomingPayments: UpcomingPayment[];
  overdueCount: number;
  onClick: () => void;
}

const UpcomingPaymentsCard: React.FC<UpcomingPaymentsCardProps> = ({
  upcomingPayments,
  overdueCount,
  onClick
}) => {
  const activePayments = upcomingPayments.filter(payment => payment.status !== 'paid');
  const totalUpcoming = activePayments.reduce((sum, payment) => sum + Math.abs(payment.amount), 0);
  const nextPayment = activePayments
    .slice()
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-full w-full rounded-lg border p-4 text-left transition hover:border-slate-300 hover:bg-white ${
        overdueCount > 0 ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-slate-50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${overdueCount > 0 ? 'bg-red-100' : 'bg-slate-100'}`}>
            <CalendarClock className={`h-5 w-5 ${overdueCount > 0 ? 'text-red-600' : 'text-slate-600'}`} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Upcoming payments</p>
            <p className={`text-2xl font-semibold ${overdueCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              -NOK {totalUpcoming.toLocaleString('no-NO', { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
      </div>

      <div className="mt-4 space-y-2 text-xs text-slate-500">
        {overdueCount > 0 ? (
          <div className="flex items-center space-x-1 text-red-600 font-medium">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{overdueCount} overdue</span>
          </div>
        ) : (
          <p>{activePayments.length} payments until payday</p>
        )}
        {nextPayment && (
          <p>
            Next: {nextPayment.description} • {new Date(nextPayment.dueDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
          </p>
        )}
      </div>
    </button>
  );
};

export default UpcomingPaymentsCard;
