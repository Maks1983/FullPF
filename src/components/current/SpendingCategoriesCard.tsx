import React from 'react';
import { PieChart, AlertTriangle } from 'lucide-react';
import type { SpendingCategory } from '../../types/current';

interface SpendingCategoriesCardProps {
  categories: SpendingCategory[];
  className?: string;
}

const SpendingCategoriesCard: React.FC<SpendingCategoriesCardProps> = ({
  categories,
  className
}) => {
  const overBudgetCategories = categories.filter(cat => cat.isOverBudget);
  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const overallUtilization = (totalSpent / totalBudget) * 100;

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md ${className ?? ''}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <PieChart className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Spending Categories</h3>
            <p className="text-sm text-gray-600">
              {overallUtilization.toFixed(1)}% of budget used
            </p>
          </div>
        </div>
        {overBudgetCategories.length > 0 && (
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            <AlertTriangle className="h-4 w-4" />
            <span>{overBudgetCategories.length} over budget</span>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4">
          {categories.map((category) => (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium text-gray-900">{category.name}</span>
                  {category.isOverBudget && (
                    <AlertTriangle className="h-4 w-4 text-rose-500" />
                  )}
                </div>
                <div className="text-right">
                  <span className={`font-semibold ${category.isOverBudget ? 'text-rose-600' : 'text-gray-900'}`}>
                    NOK {category.spent.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-600 ml-1">
                    / {category.budget.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-gray-200/80 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    category.isOverBudget ? 'bg-rose-400' : 'bg-blue-400'
                  }`}
                  style={{ width: `${Math.min(category.percentUsed, 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-xs">
                <span className={`${category.isOverBudget ? 'text-rose-600' : 'text-gray-600'}`}>
                  {category.isOverBudget ?
                    `Over by NOK ${Math.abs(category.remaining).toLocaleString()}` :
                    `NOK ${category.remaining.toLocaleString()} remaining`
                  }
                </span>
                <span className="text-gray-500">
                  {category.percentUsed.toFixed(1)}% used
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              NOK {totalSpent.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Total Spent</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              NOK {(totalBudget - totalSpent).toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Remaining Budget</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingCategoriesCard;

