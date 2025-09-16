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
      className={`bg-gradient-to-br from-slate-700 to-slate-800 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer group relative ${
        overdueCount > 0 ? 'ring-2 ring-red-400' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        {/* Left side - Main info */}
        <div className="flex-1">
          <div className="text-xs text-slate-300 mb-1">
            Upcoming payments (in NOK)
          </div>
          <div className={`text-2xl font-bold mb-1 ${
            overdueCount > 0 ? 'text-red-400' : 'text-white'
          }`}>
            -{totalAmount.toLocaleString('no-NO', { 
              minimumFractionDigits: 0,
              maximumFractionDigits: 0 
            })}
          </div>
          <div className="text-xs text-slate-400">
            {pendingPayments.length} payments until payday
          </div>
        </div>
        
        {/* Right side - Circular progress */}
        <div className="relative ml-4">
          <div className="w-16 h-16">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                stroke="#475569"
                strokeWidth="3"
                fill="transparent"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                stroke={overdueCount > 0 ? "#ef4444" : "#3b82f6"}
                strokeWidth="3"
                strokeDasharray={`${Math.min((pendingPayments.length / 10) * 100, 100)}, 100`}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-lg font-bold text-white">
                {overdueCount > 0 ? overdueCount : pendingPayments.length}
              </div>
              <div className="text-xs text-slate-300">
                {overdueCount > 0 ? 'overdue' : 'pending'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom info */}
      <div className="mt-3 pt-3 border-t border-slate-600">
        <div className="text-sm font-medium text-white">
          {nextPaymentDate ? new Date(nextPaymentDate).toLocaleDateString() : 'None'}
        </div>
      </div>

      <div className="flex items-center justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs text-slate-400 mr-2">View details</span>
        <ChevronRight className="h-4 w-4 text-slate-400" />
      </div>
    </div>
  );
};

export default UpcomingPaymentsCard;