import React from 'react';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import AnimatedCard from '../common/AnimatedCard';
import { MOCK_FINANCIAL_VALUES } from '../../data/mockData';
import type { SpendingCategory, RecentTransaction } from '../../types/current';
import { ARIA_LABELS, ARIA_DESCRIPTIONS } from '../../constants/accessibility';

interface NetCashflowCardProps {
  monthlyIncome: number;
  monthlyExpenses: number;
  onClick: () => void;
}

const NetCashflowCard: React.FC<NetCashflowCardProps> = ({
  monthlyIncome = MOCK_FINANCIAL_VALUES.MONTHLY_INCOME,
  monthlyExpenses = MOCK_FINANCIAL_VALUES.MONTHLY_EXPENSES,
  onClick
}) => {
  const netCashflow = monthlyIncome - monthlyExpenses;
  const isPositive = netCashflow >= 0;
  const cashflowPercentage = Math.abs(netCashflow / monthlyIncome) * 100;

  return (
    <AnimatedCard
      onClick={onClick}
      ariaLabel={ARIA_LABELS.cashflowCard}
      ariaDescription={ARIA_DESCRIPTIONS.cashflowCard}
      animationType="slideIn"
    >
    <div className={`bg-gradient-to-br from-slate-700 to-slate-800 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer group relative`}
    >
      <div className="flex items-center justify-between">
        {/* Left side - Main info */}
        <div className="flex-1">
          <div className="text-xs text-slate-300 mb-1">
            Net cashflow (in NOK)
          </div>
          <div className={`text-2xl font-bold mb-1 ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {isPositive ? '+' : ''}
            {netCashflow.toLocaleString('no-NO', { 
              minimumFractionDigits: 0,
              maximumFractionDigits: 0 
            })}
          </div>
          <div className="text-xs text-slate-400">
            Monthly net flow
          </div>
        </div>
        
        {/* Right side - Circular progress */}
        <div className="relative ml-4">
          <div className="w-16 h-16">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                stroke="#475569"
                strokeWidth="3"
                fill="transparent"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                stroke={isPositive ? "#10b981" : "#ef4444"}
                strokeWidth="3"
                strokeDasharray={`${Math.min(cashflowPercentage, 100)}, 100`}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-lg font-bold ${
                isPositive ? 'text-green-400' : 'text-red-400'
              }`}>
                {Math.round(cashflowPercentage)}%
              </div>
              <div className="text-xs text-slate-300">
                {isPositive ? 'surplus' : 'deficit'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom info */}
      <div className="mt-3 pt-3 border-t border-slate-600">
        <div className="text-sm font-medium text-white">
          In: {monthlyIncome.toLocaleString()} • Out: {monthlyExpenses.toLocaleString()}
        </div>
      </div>

      <div className="flex items-center justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs text-slate-400 mr-2">View details</span>
        <ChevronRight className="h-4 w-4 text-slate-400" />
      </div>
    </div>
    </AnimatedCard>
  );
};

export default NetCashflowCard;