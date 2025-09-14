import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { BudgetCategory } from '../../types/current';

interface BudgetProgressCardProps {
  category: BudgetCategory;
}

const BudgetProgressCard: React.FC<BudgetProgressCardProps> = ({ category }) => {
  const percentage = (category.spent / category.budget) * 100;
  const remaining = category.budget - category.spent;
  const isOverBudget = percentage > 100;
  const isNearLimit = percentage > 80 && !isOverBudget;

  const getTrendIcon = () => {
    switch (category.trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendColor = () => {
    switch (category.trend) {
      case 'up': return 'text-red-500';
      case 'down': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getProgressColor = () => {
    if (isOverBudget) return 'bg-red-500';
    if (isNearLimit) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const TrendIcon = getTrendIcon();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900">{category.name}</h4>
        <div className="flex items-center">
          <TrendIcon className={`h-4 w-4 ${getTrendColor()}`} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            NOK {category.spent.toLocaleString()} / {category.budget.toLocaleString()}
          </span>
          <span className={`font-semibold ${
            isOverBudget ? 'text-red-600' : 'text-gray-900'
          }`}>
            {percentage.toFixed(0)}%
          </span>
        </div>

        <div className="bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
          {isOverBudget && (
            <div className="bg-red-200 h-2 rounded-full -mt-2 opacity-50" />
          )}
        </div>

        <div className="flex justify-between text-xs">
          <span className={`${
            remaining >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {remaining >= 0 ? 'NOK ' + remaining.toLocaleString() + ' left' : 
             'NOK ' + Math.abs(remaining).toLocaleString() + ' over'}
          </span>
          <span className="text-gray-500">
            {category.daysLeft} days left
          </span>
        </div>
      </div>

      {isOverBudget && (
        <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
          <p className="text-xs text-red-700">
            Over budget by NOK {Math.abs(remaining).toLocaleString()}
          </p>
        </div>
      )}

      {isNearLimit && !isOverBudget && (
        <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
          <p className="text-xs text-yellow-700">
            Approaching budget limit
          </p>
        </div>
      )}
    </div>
  );
};

export default BudgetProgressCard;