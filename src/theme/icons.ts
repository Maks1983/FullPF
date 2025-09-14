// Centralized icon theme system
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  Activity, 
  PiggyBank, 
  CreditCard, 
  Target,
  AlertTriangle,
  Award
} from 'lucide-react';

// Activity type icons
export const activityIcons = {
  income: TrendingUp,
  expense: TrendingDown,
  transfer: ArrowUpRight,
} as const;

// Smart insight type icons
export const insightIcons = {
  opportunity: TrendingUp,
  warning: AlertTriangle,
  achievement: Award,
} as const;

// Metric category icons
export const metricIcons = {
  wallet: Wallet,
  trending: TrendingUp,
  activity: Activity,
  savings: PiggyBank,
  debt: CreditCard,
  target: Target,
  warning: AlertTriangle,
  achievement: Award
} as const;

export type ActivityIconKey = keyof typeof activityIcons;
export type InsightIconKey = keyof typeof insightIcons;
export type MetricIconKey = keyof typeof metricIcons;