import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface CriticalAlertsSectionProps {
  criticalAlerts: number;
  overdueCount: number;
  isDeficitProjected: boolean;
  daysUntilDeficit: number;
  highPriorityPayments: number;
}

const CriticalAlertsSection: React.FC<CriticalAlertsSectionProps> = ({
  criticalAlerts,
  overdueCount,
  isDeficitProjected,
  daysUntilDeficit,
  highPriorityPayments
}) => {
  if (criticalAlerts === 0) return null;

  return (
    <div className="bg-white border border-red-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-start">
        <AlertTriangle className="h-6 w-6 text-red-500 mr-3 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ⚠️ {criticalAlerts} Critical Alert{criticalAlerts > 1 ? 's' : ''} Need Your Attention
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
            {overdueCount > 0 && (
              <div className="rounded-lg border border-red-100 bg-red-50/60 p-3">
                <p className="font-medium">💳 Overdue Payments</p>
                <p>{overdueCount} payment{overdueCount > 1 ? 's' : ''} past due</p>
              </div>
            )}
            {isDeficitProjected && (
              <div className="rounded-lg border border-red-100 bg-red-50/60 p-3">
                <p className="font-medium">📉 Money Running Low</p>
                <p>Deficit projected in {daysUntilDeficit} days</p>
              </div>
            )}
            {highPriorityPayments > 0 && (
              <div className="rounded-lg border border-red-100 bg-red-50/60 p-3">
                <p className="font-medium">⚡ Urgent Bills</p>
                <p>{highPriorityPayments} high-priority payment{highPriorityPayments > 1 ? 's' : ''} due soon</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriticalAlertsSection;
