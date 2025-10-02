import React from 'react';
import { AlertTriangle, CalendarDays } from 'lucide-react';
import type { UpcomingPayment } from '../../types/current';

interface UpcomingPaymentsTimelineProps {
  payments: UpcomingPayment[];
  limit?: number;
}

const UpcomingPaymentsTimeline: React.FC<UpcomingPaymentsTimelineProps> = ({
  payments,
  limit = 5
}) => {
  const activePayments = payments
    .filter(payment => payment.status !== 'paid')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, limit);

  if (activePayments.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 space-y-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <CalendarDays className="h-5 w-5 text-gray-600" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Next Payments</h3>
            <p className="text-xs text-gray-500">Top {activePayments.length} coming due</p>
          </div>
        </div>
        <span className="text-xs text-gray-500">See all in Payments modal</span>
      </header>

      <ol className="space-y-3">
        {activePayments.map(payment => {
          const isOverdue = payment.status === 'overdue';
          const dueDate = new Date(payment.dueDate);
          const timeToDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          const urgencyLabel = isOverdue
            ? `${payment.daysOverdue ?? Math.abs(timeToDue)} day${Math.abs(timeToDue) === 1 ? '' : 's'} overdue`
            : timeToDue <= 0
              ? 'Due today'
              : `In ${timeToDue} day${timeToDue === 1 ? '' : 's'}`;

          const dotColor = isOverdue ? 'bg-rose-500' : timeToDue <= 3 ? 'bg-amber-400' : 'bg-slate-300';
          const labelTone = isOverdue ? 'text-rose-600 font-medium' : timeToDue <= 3 ? 'text-amber-600 font-medium' : 'text-gray-500';

          return (
            <li
              key={payment.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm transition-colors hover:border-gray-300"
            >
              <div className="flex items-center space-x-3">
                <div className={`h-2 w-2 rounded-full ${dotColor}`} aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{payment.description}</p>
                  <p className="text-xs text-gray-500">
                    {dueDate.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })} • {payment.category}
                  </p>
                </div>
              </div>

              <div className="text-right space-y-1">
                <p className={`font-semibold ${isOverdue ? 'text-rose-600' : 'text-gray-900'}`}>
                  -NOK {Math.abs(payment.amount).toLocaleString('no-NO', { maximumFractionDigits: 0 })}
                </p>
                <div className={`flex items-center justify-end gap-1 text-xs ${labelTone}`}>
                  {isOverdue && <AlertTriangle className="h-3.5 w-3.5" />}
                  <span>{urgencyLabel}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default UpcomingPaymentsTimeline;
