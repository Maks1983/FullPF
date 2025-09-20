import React from 'react';
import AvailableMoneyCard from './AvailableMoneyCard';
import UpcomingPaymentsCard from './UpcomingPaymentsCard';
import NetCashflowCard from './NetCashflowCard';
import type { CurrentAccount, PaycheckInfo, UpcomingPayment } from '../../types/current';

interface CurrentPageHeaderProps {
  accounts: CurrentAccount[];
  totalAvailable: number;
  netLeftoverUntilPaycheck: number;
  paycheckInfo: PaycheckInfo;
  upcomingPayments: UpcomingPayment[];
  overdueCount: number;
  totalMonthlyIncome: number;
  totalMonthlyExpenses: number;
  healthStatus?: {
    status: string;
    emoji: string;
    message: string;
  };
  onViewDetails: () => void;
  onViewPayments: () => void;
  onViewNetCashflow: () => void;
}

const CurrentPageHeader: React.FC<CurrentPageHeaderProps> = ({
  totalAvailable,
  netLeftoverUntilPaycheck,
  paycheckInfo,
  upcomingPayments,
  overdueCount,
  totalMonthlyIncome,
  totalMonthlyExpenses,
  healthStatus,
  onViewDetails,
  onViewPayments,
  onViewNetCashflow
}) => {
  return (
    <header className="bg-white border border-gray-200 rounded-xl shadow-sm px-6 py-5 space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Today&apos;s focus</p>
        <h1 className="text-2xl font-semibold text-gray-900 mt-1">
          Your money snapshot {healthStatus?.emoji ?? ''}
        </h1>
        {healthStatus?.message && (
          <p className="text-sm text-gray-500 mt-1">
            {healthStatus.message}
          </p>
        )}
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        role="group"
        aria-label="Financial summary cards"
      >
        <AvailableMoneyCard
          totalAvailable={totalAvailable}
          netLeftover={netLeftoverUntilPaycheck}
          paycheckInfo={paycheckInfo}
          monthlyExpenses={totalMonthlyExpenses}
          upcomingPayments={upcomingPayments}
          onViewDetails={onViewDetails}
        />

        <UpcomingPaymentsCard
          upcomingPayments={upcomingPayments}
          overdueCount={overdueCount}
          onClick={onViewPayments}
        />

        <NetCashflowCard
          monthlyIncome={totalMonthlyIncome}
          monthlyExpenses={totalMonthlyExpenses}
          onClick={onViewNetCashflow}
        />
      </div>
    </header>
  );
};

export default CurrentPageHeader;
