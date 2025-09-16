import React from 'react';
import { Eye } from 'lucide-react';
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
  onViewDetails: () => void;
  onViewPayments: () => void;
  onViewNetCashflow: () => void;
}

const CurrentPageHeader: React.FC<CurrentPageHeaderProps> = ({
  accounts,
  totalAvailable,
  netLeftoverUntilPaycheck,
  paycheckInfo,
  upcomingPayments,
  overdueCount,
  totalMonthlyIncome,
  totalMonthlyExpenses,
  onViewDetails,
  onViewPayments,
  onViewNetCashflow
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
      <div className="flex items-center space-x-3 mb-4">
        <Eye className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Money Right Now</h1>
          <p className="text-gray-600 mt-1">
            Complete awareness of your day-to-day finances and what's happening with your money
          </p>
        </div>
      </div>
      
      {/* Comprehensive Money Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AvailableMoneyCard
          accounts={accounts}
          totalAvailable={totalAvailable}
          netLeftover={netLeftoverUntilPaycheck}
          paycheckInfo={paycheckInfo}
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
    </div>
  );
};

export default CurrentPageHeader;