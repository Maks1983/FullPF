import { useMemo } from 'react';
import { FINANCIAL_DATA } from '../data/centralizedData';
import type { Currency } from '../features/loans/types';

export const getDefaultCurrency = (): Currency => {
  return (FINANCIAL_DATA?.user?.currency as Currency) ?? 'NOK';
};

export const useDefaultCurrency = (): Currency => {
  return useMemo(() => getDefaultCurrency(), []);
};
