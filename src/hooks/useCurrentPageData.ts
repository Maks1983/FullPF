import { useMemo } from 'react';
import { mockCurrentPageData } from '../data/currentPageData';

export const useCurrentPageData = () => {
  return useMemo(() => {
    return mockCurrentPageData;
  }, []);
};