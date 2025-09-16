import React from 'react';
import { Eye } from 'lucide-react';
import ResponsiveGrid from '../common/ResponsiveGrid';
import AvailableMoneyCard from './AvailableMoneyCard';
import UpcomingPaymentsCard from './UpcomingPaymentsCard';
import NetCashflowCard from './NetCashflowCard';
import { MOCK_FINANCIAL_VALUES } from '../../data/mockData';
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
  totalMonthlyIncome = MOCK_FINANCIAL_VALUES.MONTHLY_INCOME,
  totalMonthlyExpenses = MOCK_FINANCIAL_VALUES.MONTHLY_EXPENSES,
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
      <ResponsiveGrid 
        columns={{ mobile: 1, tablet: 2, desktop: 3 }}
        gap="lg"
      >
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
      </ResponsiveGrid>
    </div>
  );
};

export default CurrentPageHeader;