import { useState } from 'react';

export const useModalState = () => {
  const [isDetailedModalOpen, setIsDetailedModalOpen] = useState(false);
  const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false);
  const [isNetCashflowModalOpen, setIsNetCashflowModalOpen] = useState(false);

  const openDetailedModal = () => setIsDetailedModalOpen(true);
  const closeDetailedModal = () => setIsDetailedModalOpen(false);
  
  const openPaymentsModal = () => setIsPaymentsModalOpen(true);
  const closePaymentsModal = () => setIsPaymentsModalOpen(false);
  
  const openNetCashflowModal = () => setIsNetCashflowModalOpen(true);
  const closeNetCashflowModal = () => setIsNetCashflowModalOpen(false);

  return {
    // State
    isDetailedModalOpen,
    isPaymentsModalOpen,
    isNetCashflowModalOpen,
    
    // Actions
    openDetailedModal,
    closeDetailedModal,
    openPaymentsModal,
    closePaymentsModal,
    openNetCashflowModal,
    closeNetCashflowModal,
  };
};