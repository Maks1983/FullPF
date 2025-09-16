// Financial thresholds and configuration constants
export const FINANCIAL_THRESHOLDS = {
  // Balance thresholds (in NOK)
  CRITICAL_BALANCE: 1000,
  LOW_BALANCE: 5000,
  COMFORTABLE_BALANCE: 20000,
  
  // Time-based thresholds
  WARNING_DAYS: 7,
  CRITICAL_DAYS: 3,
  EMERGENCY_FUND_MONTHS: 3,
  
  // Percentage thresholds
  SAVINGS_RATE_EXCELLENT: 20,
  SAVINGS_RATE_GOOD: 10,
  DEBT_TO_INCOME_GOOD: 20,
  DEBT_TO_INCOME_WARNING: 36,
  
  // Credit utilization
  CREDIT_UTILIZATION_GOOD: 30,
  CREDIT_UTILIZATION_WARNING: 80,
} as const;

export const CURRENCY_FORMATS = {
  NOK: {
    symbol: 'NOK',
    locale: 'no-NO',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  },
  USD: {
    symbol: '$',
    locale: 'en-US',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
  EUR: {
    symbol: '€',
    locale: 'de-DE',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
} as const;

export const CHART_COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  neutral: '#6b7280',
} as const;

export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;