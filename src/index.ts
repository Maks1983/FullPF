// Barrel exports for cleaner imports
export { default as ErrorBoundary } from './components/common/ErrorBoundary';
export { default as SkeletonLoader } from './components/common/SkeletonLoader';
export { default as LoadingSpinner } from './components/common/LoadingSpinner';

// Hooks
export { useCurrentPageLogic } from './hooks/useCurrentPageLogic';
export { useCurrentPageData } from './hooks/useCurrentPageData';
export { useFinancialCalculations } from './hooks/useFinancialCalculations';
export { useModalState } from './hooks/useModalState';

// Utils
export * from './utils/financial';

// Constants
export * from './constants/financial';

// Types
export type * from './types/current';
export type * from './types/financial';
export type * from './types/insights';
export type * from './types/activities';
export type * from './types/metrics';