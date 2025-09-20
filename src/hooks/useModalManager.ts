import { useState, useCallback, useMemo, useEffect, useRef } from 'react';

export type ModalType = 'details' | 'payments' | 'netCashflow' | null;

interface ModalState {
  activeModal: ModalType;
  isModalOpen: boolean;
  isPaymentsModalOpen: boolean;
  isNetCashflowModalOpen: boolean;
}

interface ModalActions {
  openModal: (type: ModalType) => void;
  closeModal: () => void;
  closeAllModals: () => void;
  toggleModal: (type: ModalType) => void;
}

interface UseModalManagerReturn extends ModalState, ModalActions {
  anyModalOpen: boolean;
}

export const useModalManager = (): UseModalManagerReturn => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const previousOverflowRef = useRef<string | null>(null);

  // Derived state
  const modalState = useMemo((): ModalState => ({
    activeModal,
    isModalOpen: activeModal === 'details',
    isPaymentsModalOpen: activeModal === 'payments',
    isNetCashflowModalOpen: activeModal === 'netCashflow',
  }), [activeModal]);

  const anyModalOpen = activeModal !== null;

  // Modal actions
  const openModal = useCallback((type: ModalType) => {
    if (type === null) return;
    setActiveModal(type);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const closeAllModals = useCallback(() => {
    setActiveModal(null);
  }, []);

  const toggleModal = useCallback((type: ModalType) => {
    if (type === null) return;
    setActiveModal(prev => prev === type ? null : type);
  }, []);

  // Handle body scroll lock when modals are open
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const { style } = document.body;

    if (anyModalOpen) {
      if (previousOverflowRef.current === null) {
        previousOverflowRef.current = style.overflow;
      }
      style.overflow = 'hidden';
    } else if (previousOverflowRef.current !== null) {
      style.overflow = previousOverflowRef.current;
      previousOverflowRef.current = null;
    }

    return () => {
      if (previousOverflowRef.current !== null) {
        style.overflow = previousOverflowRef.current;
        previousOverflowRef.current = null;
      }
    };
  }, [anyModalOpen]);

  // Handle escape key to close modals
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && anyModalOpen) {
        closeModal();
      }
    };

    if (anyModalOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [anyModalOpen, closeModal]);

  return {
    ...modalState,
    anyModalOpen,
    openModal,
    closeModal,
    closeAllModals,
    toggleModal,
  };
};