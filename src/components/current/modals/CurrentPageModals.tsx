import React, { memo, useEffect, useRef } from 'react';
import DetailedModal from '../DetailedModal';
import UpcomingPaymentsModal from '../UpcomingPaymentsModal';
import NetCashflowModal from '../NetCashflowModal';
import type { UpcomingPayment, SpendingCategory, RecentTransaction } from '../../../types/current';

interface CurrentPageModalsProps {
  isModalOpen: boolean;
  onCloseModal: () => void;
  isPaymentsModalOpen: boolean;
  onClosePaymentsModal: () => void;
  isNetCashflowModalOpen: boolean;
  onCloseNetCashflowModal: () => void;
  upcomingPayments: UpcomingPayment[];
  spendingCategories: SpendingCategory[];
  recentTransactions: RecentTransaction[];
  monthlyIncome: number;
  monthlyExpenses: number;
  totalAvailable: number;
  netLeftoverUntilPaycheck: number;
  daysUntilPaycheck: number;
  overdueCount: number;
}

const CurrentPageModals: React.FC<CurrentPageModalsProps> = memo(({
  isModalOpen,
  onCloseModal,
  isPaymentsModalOpen,
  onClosePaymentsModal,
  isNetCashflowModalOpen,
  onCloseNetCashflowModal,
  upcomingPayments,
  spendingCategories,
  recentTransactions,
  monthlyIncome,
  monthlyExpenses,
  totalAvailable,
  netLeftoverUntilPaycheck,
  daysUntilPaycheck,
  overdueCount
}) => {
  return (
    <>
      {/* Detailed Modal */}
      <DetailedModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        upcomingPayments={upcomingPayments}
        spendingCategories={spendingCategories}
        monthlyIncome={monthlyIncome}
        monthlyExpenses={monthlyExpenses}
        totalAvailable={totalAvailable}
        netLeftoverUntilPaycheck={netLeftoverUntilPaycheck}
        daysUntilPaycheck={daysUntilPaycheck}
      />

      {/* Upcoming Payments Modal */}
      <UpcomingPaymentsModal
        isOpen={isPaymentsModalOpen}
        onClose={onClosePaymentsModal}
        payments={upcomingPayments}
        overdueCount={overdueCount}
      />

      {/* Net Cashflow Modal */}
      <NetCashflowModal
        isOpen={isNetCashflowModalOpen}
        onClose={onCloseNetCashflowModal}
        monthlyIncome={monthlyIncome}
        monthlyExpenses={monthlyExpenses}
        spendingCategories={spendingCategories}
        recentTransactions={recentTransactions}
      />
    </>
  );
});

CurrentPageModals.displayName = 'CurrentPageModals';

export default CurrentPageModals;
