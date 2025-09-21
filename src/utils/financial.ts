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
  status: 'excellent' | 'good' | 'fair' | 'poor';
  emoji: string;
  message: string;
} => {
  if (monthlyIncome <= 0) {
    return {
      status: 'poor',
      emoji: '😰',
      message: 'Let\'s get your income data set up to unlock insights!'
    };
  }

  // Calculate what percentage of monthly income you have left after bills
  const ratio = netAmount / monthlyIncome;
  
  // Financial Health Brackets:
  // Excellent: 15%+ of monthly income left (e.g., NOK 7,800+ if earning NOK 52,000)
  // Good: 5-15% of monthly income left (e.g., NOK 2,600-7,800)
  // Fair: -5% to +5% of monthly income (e.g., NOK -2,600 to +2,600)
  // Poor: More than 5% short (e.g., less than NOK -2,600)

  if (ratio >= 0.15) {
    return {
      status: 'excellent',
      emoji: '😎',
      message: `You're crushing it! You have ${(ratio * 100).toFixed(1)}% of your income left after bills 🎉`
    };
  }
  
  if (ratio >= 0.05) {
    return {
      status: 'good',
      emoji: '👍',
      message: `Nice work! You have ${(ratio * 100).toFixed(1)}% of your income cushion`
    };
  }
  
  if (ratio >= -0.05) {
    return {
      status: 'fair',
      emoji: '😬',
      message: `Things are tight (${Math.abs(ratio * 100).toFixed(1)}% ${ratio >= 0 ? 'cushion' : 'short'}), but you've got this!`
    };
  }
  
  return {
    status: 'poor',
    emoji: '😰',
    message: `You're ${Math.abs(ratio * 100).toFixed(1)}% short this period - time to take action!`
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


