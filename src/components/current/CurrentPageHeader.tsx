import React from 'react';
import { Eye } from 'lucide-react';
import AvailableMoneyCard from './AvailableMoneyCard';
import UpcomingPaymentsCard from './UpcomingPaymentsCard';
import NetCashflowCard from './NetCashflowCard';
import type { CurrentAccount, PaycheckInfo, UpcomingPayment } from '../../types/current';

interface CurrentPageHeaderProps {
  accounts: CurrentAccount[];
  totalAvailable: number;
  netLeftover: number;
  paycheckInfo: PaycheckInfo;
  upcomingPayments: UpcomingPayment[];
  overdueCount: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  onOpenDetailedModal: () => void;
  onOpenPaymentsModal: () => void;
  onOpenNetCashflowModal: () => void;
}

const CurrentPageHeader: React.FC<CurrentPageHeaderProps> = ({
  accounts,
  totalAvailable,
  netLeftover,
  paycheckInfo,
  upcomingPayments,
  overdueCount,
  monthlyIncome,
  monthlyExpenses,
  onOpenDetailedModal,
  onOpenPaymentsModal,
  onOpenNetCashflowModal
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
          netLeftover={netLeftover}
          paycheckInfo={paycheckInfo}
          upcomingPayments={upcomingPayments}
          onViewDetails={onOpenDetailedModal}
        />
        
        <UpcomingPaymentsCard
          upcomingPayments={upcomingPayments}
          overdueCount={overdueCount}
          onClick={onOpenPaymentsModal}
        />
        
        <NetCashflowCard
          monthlyIncome={monthlyIncome}
          monthlyExpenses={monthlyExpenses}
          onClick={onOpenNetCashflowModal}
        />
      </div>
    </div>
  );
};

export default CurrentPageHeader;