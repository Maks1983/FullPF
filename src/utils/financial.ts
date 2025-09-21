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

  const ratio = netAmount / monthlyIncome;

  if (ratio >= 0.15) {
    return {
      status: 'excellent',
      emoji: '😎',
      message: 'You\'re crushing it! Your finances are in excellent shape 🎉'
    };
  }
  
  if (ratio >= 0.05) {
    return {
      status: 'good',
      emoji: '👍',
      message: 'Nice work! You\'re in a solid financial position'
    };
  }
  
  if (ratio >= -0.05) {
    return {
      status: 'fair',
      emoji: '😬',
      message: 'Things are tight, but you\'ve got this! Small adjustments can help'
    };
  }
  
  return {
    status: 'poor',
    emoji: '😰',
    message: 'Time to take action - every small step forward counts!'
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


