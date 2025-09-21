/**
 * Financial constants, thresholds, and configuration values
 */

// ============================================================================
// FINANCIAL HEALTH THRESHOLDS
// ============================================================================

export const FINANCIAL_THRESHOLDS = {
  // Emergency fund should cover this many months of expenses
  EMERGENCY_FUND_MONTHS: 6,
  
  // Debt-to-income ratio thresholds
  COMFORTABLE_DTI_RATIO: 0.2,  // 20% or less is comfortable
  ADEQUATE_DTI_RATIO: 0.36,    // 36% is generally considered max acceptable
  
  // Credit utilization thresholds
  HIGH_CREDIT_UTILIZATION: 0.8,  // 80% utilization is concerning
  OPTIMAL_CREDIT_UTILIZATION: 0.3, // 30% or less is optimal
  
  // Account balance thresholds
  LOW_BALANCE_THRESHOLD: 500,     // NOK amount considered "low"
  MINIMUM_BUFFER_AMOUNT: 1000,    // Minimum recommended buffer
  
  // Time-based warning thresholds
  DAYS_UNTIL_CRITICAL: 3,   // Show critical warning
  DAYS_UNTIL_WARNING: 7,    // Show warning
  
  // Savings rate thresholds
  MINIMUM_SAVINGS_RATE: 0.1,  // 10% minimum recommended
  GOOD_SAVINGS_RATE: 0.2,     // 20% is considered good
  EXCELLENT_SAVINGS_RATE: 0.3, // 30%+ is excellent
  
  // Investment allocation thresholds
  MAX_CASH_ALLOCATION: 0.15,   // Don't hold more than 15% in cash
  MIN_EMERGENCY_FUND_RATIO: 0.05, // At least 5% should be emergency fund
} as const;

// ============================================================================
// CURRENCY CONFIGURATION
// ============================================================================

export const CURRENCY = {
  DEFAULT: 'NOK',
  SYMBOL: 'NOK',
  LOCALE: 'no-NO',
  
  // Formatting options
  DECIMAL_PLACES: {
    DEFAULT: 0,
    PRECISE: 2,
    PERCENTAGE: 1,
  },
} as const;

// ============================================================================
// UI/UX CONSTANTS
// ============================================================================

export const COLORS = {
  SUCCESS: '#10b981',    // Green for positive values
  WARNING: '#f59e0b',    // Amber for warnings
  ERROR: '#ef4444',      // Red for negative/critical values
  INFO: '#3b82f6',       // Blue for informational
  NEUTRAL: '#6b7280',    // Gray for neutral values
} as const;

export const ANIMATION_DURATION = {
  FAST: 150,     // Quick transitions
  NORMAL: 300,   // Standard transitions
  SLOW: 500,     // Slower, more noticeable transitions
} as const;

// ============================================================================
// ACCOUNT TYPE DEFINITIONS
// ============================================================================

export const ACCOUNT_TYPES = {
  CHECKING: 'checking',
  SAVINGS: 'savings',
  CREDIT: 'credit',
  INVESTMENT: 'investment',
  LOAN: 'loan',
} as const;

export type AccountType = typeof ACCOUNT_TYPES[keyof typeof ACCOUNT_TYPES];

// ============================================================================
// TRANSACTION CATEGORIES
// ============================================================================

export const EXPENSE_CATEGORIES = {
  HOUSING: 'Housing',
  FOOD: 'Food & Dining',
  TRANSPORTATION: 'Transportation',
  UTILITIES: 'Utilities',
  ENTERTAINMENT: 'Entertainment',
  SHOPPING: 'Shopping',
  HEALTHCARE: 'Healthcare',
  INSURANCE: 'Insurance',
  DEBT_PAYMENTS: 'Debt Payments',
  PERSONAL_CARE: 'Personal Care',
  MISCELLANEOUS: 'Miscellaneous',
} as const;

export const INCOME_CATEGORIES = {
  SALARY: 'Salary',
  FREELANCE: 'Freelance',
  INVESTMENT: 'Investment Income',
  RENTAL: 'Rental Income',
  OTHER: 'Other Income',
} as const;

// ============================================================================
// PRIORITY LEVELS
// ============================================================================

export const PRIORITY_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export type PriorityLevel = typeof PRIORITY_LEVELS[keyof typeof PRIORITY_LEVELS];

// ============================================================================
// STATUS DEFINITIONS
// ============================================================================

export const PAYMENT_STATUS = {
  SCHEDULED: 'scheduled',
  OVERDUE: 'overdue',
  PAID: 'paid',
  PENDING: 'pending',
} as const;

export const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  LOW: 'low',
  OVERDRAWN: 'overdrawn',
  FROZEN: 'frozen',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];
export type AccountStatus = typeof ACCOUNT_STATUS[keyof typeof ACCOUNT_STATUS];