import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { TimeframeType } from '../types/financial';

interface DashboardError {
  message: string;
  code?: string;
  timestamp: number;
}

interface DashboardContextType {
  timeframe: TimeframeType;
  setTimeframe: (timeframe: TimeframeType) => void;
  refreshing: boolean;
  setRefreshing: (refreshing: boolean) => void;
  handleRefresh: () => Promise<void>;
  error: DashboardError | null;
  setError: (error: DashboardError | null) => void;
  retryCount: number;
  incrementRetry: () => void;
  resetRetry: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [timeframe, setTimeframe] = useState<TimeframeType>('6M');
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<DashboardError | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);
    // Simulate API call
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate occasional failures for demo
          if (Math.random() > 0.8 && retryCount < 2) {
            reject(new Error('Network timeout'));
          } else {
            resolve(undefined);
          }
        }, 1500);
      });
      setRetryCount(0);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Unknown error',
        code: 'REFRESH_FAILED',
        timestamp: Date.now()
      });
    }
    setRefreshing(false);
  };

  const incrementRetry = () => setRetryCount(prev => prev + 1);
  const resetRetry = () => setRetryCount(0);

  const value = {
    timeframe,
    setTimeframe,
    refreshing,
    setRefreshing,
    handleRefresh,
    error,
    setError,
    retryCount,
    incrementRetry,
    resetRetry,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};