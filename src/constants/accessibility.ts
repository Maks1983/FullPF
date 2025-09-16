// Accessibility constants and utilities
export const ARIA_LABELS = {
  // Navigation
  mainNavigation: 'Main navigation',
  breadcrumb: 'Breadcrumb navigation',
  pagination: 'Pagination navigation',
  
  // Financial cards
  balanceCard: 'Account balance information',
  paymentsCard: 'Upcoming payments information',
  cashflowCard: 'Net cashflow information',
  
  // Actions
  viewDetails: 'View detailed information',
  closeModal: 'Close dialog',
  openMenu: 'Open menu',
  refresh: 'Refresh data',
  
  // Status indicators
  positiveBalance: 'Positive balance indicator',
  negativeBalance: 'Negative balance indicator',
  warningStatus: 'Warning status indicator',
  criticalStatus: 'Critical status indicator',
} as const;

export const ARIA_DESCRIPTIONS = {
  balanceCard: 'Shows current account balance and days until next paycheck',
  paymentsCard: 'Displays upcoming payments and overdue items',
  cashflowCard: 'Shows monthly income versus expenses',
  progressIndicator: 'Visual progress indicator showing completion percentage',
} as const;

export const KEYBOARD_SHORTCUTS = {
  ESCAPE: 'Escape',
  ENTER: 'Enter',
  SPACE: ' ',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
} as const;

export const FOCUS_CLASSES = {
  default: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  card: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50',
  button: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  input: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
} as const;