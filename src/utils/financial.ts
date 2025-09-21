import { FINANCIAL_THRESHOLDS, CURRENCY } from '../constants/financial';

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

export const calculateDaysUntilDate = (targetDate: string): number => {
  const today = new Date();
  const target = new Date(targetDate);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getFinancialHealthStatus = (
  netAmount: number,
  monthlyIncome: number
): {
  status: 'excellent' | 'good' | 'tight' | 'at-risk' | 'critical';
  emoji: string;
  message: string;
} => {
  if (monthlyIncome <= 0) {
    return {
      status: 'critical',
      emoji: '😰',
      message: 'Let\'s get your income data set up to unlock insights!'
    };
  }

  // Calculate what percentage of monthly income you have left after bills
  const ratio = netAmount / monthlyIncome;
  
  // Financial Health Brackets:
  // 💎 Excellent: 25%+ of monthly income left (e.g., NOK 13,000+ if earning NOK 52,000)
  // 👍 Good: 10-25% of monthly income left (e.g., NOK 5,200-13,000)
  // 😬 Tight: 0-10% of monthly income left (e.g., NOK 0-5,200)
  // ⚠️ At Risk: -5% to 0% of monthly income (e.g., NOK -2,600 to 0)
  // 🚨 Critical: More than 5% short (e.g., less than NOK -2,600)

  if (ratio >= 0.25) {
    return {
      status: 'excellent',
      emoji: '💎',
      message: `Excellent! You have ${(ratio * 100).toFixed(1)}% of your income left after bills - you're building serious wealth! 🎉`
    };
  }
  
  if (ratio >= 0.10) {
    return {
      status: 'good',
      emoji: '👍',
      message: `Good work! You have ${(ratio * 100).toFixed(1)}% of your income as a cushion - you're in a solid position`
    };
  }
  
  if (ratio >= 0.00) {
    return {
      status: 'tight',
      emoji: '😬',
      message: `Things are tight with ${(ratio * 100).toFixed(1)}% left, but you're covering your bills - small improvements can help!`
    };
  }
  
  if (ratio >= -0.05) {
    return {
      status: 'at-risk',
      emoji: '⚠️',
      message: `At risk - you're ${Math.abs(ratio * 100).toFixed(1)}% short this period. Time to review expenses or find extra income`
    };
  }
  
  return {
    status: 'critical',
    emoji: '🚨',
    message: `Critical situation - you're ${Math.abs(ratio * 100).toFixed(1)}% short. Immediate action needed to avoid financial stress`
  };
};
export const calculateEmergencyFundCoverage = (
  totalSavings: number,
  monthlyExpenses: number
): {
  months: number;
  isAdequate: boolean;
  targetAmount: number;
} => {
  const months = totalSavings / monthlyExpenses;
  const targetAmount = monthlyExpenses * FINANCIAL_THRESHOLDS.EMERGENCY_FUND_MONTHS;
  
  return {
    months,
    isAdequate: months >= FINANCIAL_THRESHOLDS.EMERGENCY_FUND_MONTHS,
    targetAmount
  };
};

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


