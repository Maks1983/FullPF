import { useMemo } from 'react';
import { mockCurrentPageData } from '../data/currentPageData';
import type { CurrentPageData } from '../types/current';

export const useCurrentPageData = (): CurrentPageData => {
  return useMemo(() => {
    return mockCurrentPageData;
  }, []);
};