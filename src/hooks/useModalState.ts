import { useState } from 'react';

export const useModalState = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false);
  const [isNetCashflowModalOpen, setIsNetCashflowModalOpen] = useState(false);

  return {
    isModalOpen,
    setIsModalOpen,
    isPaymentsModalOpen,
    setIsPaymentsModalOpen,
    isNetCashflowModalOpen,
    setIsNetCashflowModalOpen,
  };
};