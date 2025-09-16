import React from 'react';
import { Calendar, AlertTriangle, ChevronRight } from 'lucide-react';
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
  const pendingPayments = upcomingPayments.filter(p => p.status !== 'paid');
  const totalAmount = pendingPayments.reduce((sum, p) => sum + Math.abs(p.amount), 0);
  const nextPaymentDate = pendingPayments
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]
    ?.dueDate;

  return (
    <div 
      className={`bg-white p-6 rounded-xl shadow-sm border transition-all hover:shadow-md cursor-pointer group ${
        overdueCount > 0 ? 'border-red-200 hover:border-red-300' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${overdueCount > 0 ? 'bg-red-100' : 'bg-blue-100'}`}>
            <Calendar className={`h-5 w-5 ${overdueCount > 0 ? 'text-red-600' : 'text-blue-600'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Upcoming Payments</h3>
            <p className="text-sm text-gray-600">
              {pendingPayments.length} payment{pendingPayments.length !== 1 ? 's' : ''} scheduled
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {overdueCount > 0 && <AlertTriangle className="h-5 w-5 text-red-500" />}
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-red-600">
            NOK {totalAmount.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">Total amount due</p>
        </div>

        {overdueCount > 0 && (
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {overdueCount} overdue payment{overdueCount > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-600">Next payment due:</p>
          <p className="font-semibold text-gray-900">
            {nextPaymentDate ? new Date(nextPaymentDate).toLocaleDateString() : 'None scheduled'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpcomingPaymentsCard;