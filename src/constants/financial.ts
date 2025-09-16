// Financial constants and thresholds
export const FINANCIAL_THRESHOLDS = {
  EMERGENCY_FUND_MONTHS: 6,
  COMFORTABLE_DTI_RATIO: 0.2,
  ADEQUATE_DTI_RATIO: 0.36,
  HIGH_CREDIT_UTILIZATION: 0.8,
  LOW_BALANCE_THRESHOLD: 500,
  DAYS_UNTIL_CRITICAL: 3,
  DAYS_UNTIL_WARNING: 7,
  MINIMUM_SAVINGS_RATE: 0.1,
  GOOD_SAVINGS_RATE: 0.2,
} as const;

export const CURRENCY = {
  DEFAULT: 'NOK',
  SYMBOL: 'NOK',
  LOCALE: 'no-NO',
} as const;

export const COLORS = {
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6',
  NEUTRAL: '#6b7280',
} as const;

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;