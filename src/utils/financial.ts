/**
 * Financial utility functions for calculations, formatting, and health assessments
 */

import { FINANCIAL_THRESHOLDS, CURRENCY } from '../constants/financial';

// ============================================================================
// FORMATTING UTILITIES
// ============================================================================

/**
 * Format currency amount with proper localization
 */
export const formatCurrency = (
  amount: number,
  options: {
    showSymbol?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string => {
  const {
    showSymbol = true,
    minimumFractionDigits = 0,
    maximumFractionDigits = 0
  } = options;

  const formatted = amount.toLocaleString(CURRENCY.LOCALE, {
    minimumFractionDigits,
    maximumFractionDigits
  });

  return showSymbol ? `${CURRENCY.SYMBOL} ${formatted}` : formatted;
};

// ============================================================================
// DATE UTILITIES
// ============================================================================

/**
 * Calculate days between now and target date
 */
export const calculateDaysUntilDate = (targetDate: string): number => {
  const today = new Date();
  const target = new Date(targetDate);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// ============================================================================
// FINANCIAL HEALTH ASSESSMENT
// ============================================================================

/**
 * Financial health status levels with thresholds
 */
const HEALTH_THRESHOLDS = {
  EXCELLENT: 0.25,  // 25%+ of income left
  GOOD: 0.10,       // 10-25% of income left
  TIGHT: 0.00,      // 0-10% of income left
  AT_RISK: -0.05,   // -5% to 0% of income
  // Critical: < -5% of income
} as const;

/**
 * Health status configuration with emojis and messages
 */
const HEALTH_STATUS_CONFIG = {
  excellent: {
    emoji: '💎',
    getTitle: (percentage: number) => 
      `Excellent! You have ${percentage.toFixed(1)}% of your income left after bills - you're building serious wealth! 🎉`,
  },
  good: {
    emoji: '👍',
    getTitle: (percentage: number) => 
      `Good work! You have ${percentage.toFixed(1)}% of your income as a cushion - you're in a solid position`,
  },
  tight: {
    emoji: '😬',
    getTitle: (percentage: number) => 
      `Things are tight with ${percentage.toFixed(1)}% left, but you're covering your bills - small improvements can help!`,
  },
  atRisk: {
    emoji: '⚠️',
    getTitle: (percentage: number) => 
      `At risk - you're ${Math.abs(percentage).toFixed(1)}% short this period. Time to review expenses or find extra income`,
  },
  critical: {
    emoji: '🚨',
    getTitle: (percentage: number) => 
      `Critical situation - you're ${Math.abs(percentage).toFixed(1)}% short. Immediate action needed to avoid financial stress`,
  },
} as const;

export type FinancialHealthStatus = keyof typeof HEALTH_STATUS_CONFIG;

export interface FinancialHealthResult {
  status: FinancialHealthStatus;
  emoji: string;
  message: string;
  percentage: number;
  isPositive: boolean;
}

/**
 * Assess financial health based on net amount after bills vs monthly income
 */
export const getFinancialHealthStatus = (
  netAmount: number,
  monthlyIncome: number
): FinancialHealthResult => {
  // Handle edge case: no income data
  if (monthlyIncome <= 0) {
    return {
      status: 'critical',
      emoji: '😰',
      message: 'Let\'s get your income data set up to unlock insights!',
      percentage: 0,
      isPositive: false,
    };
  }

  // Calculate percentage of monthly income remaining
  const ratio = netAmount / monthlyIncome;
  const percentage = ratio * 100;
  const isPositive = netAmount >= 0;

  // Determine status based on thresholds
  let status: FinancialHealthStatus;
  if (ratio >= HEALTH_THRESHOLDS.EXCELLENT) {
    status = 'excellent';
  } else if (ratio >= HEALTH_THRESHOLDS.GOOD) {
    status = 'good';
  } else if (ratio >= HEALTH_THRESHOLDS.TIGHT) {
    status = 'tight';
  } else if (ratio >= HEALTH_THRESHOLDS.AT_RISK) {
    status = 'atRisk';
  } else {
    status = 'critical';
  }

  const config = HEALTH_STATUS_CONFIG[status];

  return {
    status,
    emoji: config.emoji,
    message: config.getTitle(percentage),
    percentage,
    isPositive,
  };
};

// ============================================================================
// EMERGENCY FUND CALCULATIONS
// ============================================================================

export interface EmergencyFundAnalysis {
  months: number;
  isAdequate: boolean;
  targetAmount: number;
  shortfall: number;
}

/**
 * Calculate emergency fund coverage in months
 */
export const calculateEmergencyFundCoverage = (
  totalSavings: number,
  monthlyExpenses: number
): EmergencyFundAnalysis => {
  if (monthlyExpenses <= 0) {
    return {
      months: 0,
      isAdequate: false,
      targetAmount: 0,
      shortfall: 0,
    };
  }

  const months = totalSavings / monthlyExpenses;
  const targetAmount = monthlyExpenses * FINANCIAL_THRESHOLDS.EMERGENCY_FUND_MONTHS;
  const shortfall = Math.max(0, targetAmount - totalSavings);
  
  return {
    months,
    isAdequate: months >= FINANCIAL_THRESHOLDS.EMERGENCY_FUND_MONTHS,
    targetAmount,
    shortfall,
  };
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Debounce function to limit rapid function calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Safely convert value to number, returning 0 for invalid inputs
 */
export const safeNumber = (value: unknown): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

/**
 * Calculate percentage with safe division
 */
export const safePercentage = (numerator: number, denominator: number): number => {
  if (denominator === 0) return 0;
  return (numerator / denominator) * 100;
};

/**
 * Clamp number between min and max values
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};