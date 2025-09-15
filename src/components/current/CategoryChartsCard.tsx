import React from 'react';
import { BarChart3 } from 'lucide-react';
import type { CategoryData } from '../../types/current';

interface CategoryChartsCardProps {
  categories: CategoryData[];
}

const CategoryChartsCard: React.FC<CategoryChartsCardProps> = ({ categories }) => {
  const incomeCategories = categories
    .filter(cat => cat.type === 'income')
    .sort((a, b) => b.amount - a.amount);
  
  const expenseCategories = categories
    .filter(cat => cat.type === 'expense')
    .sort((a, b) => a.amount - b.amount); // Sort by most negative first

  const maxIncome = Math.max(...incomeCategories.map(cat => cat.amount));
  const maxExpense = Math.max(...expenseCategories.map(cat => Math.abs(cat.amount)));

  const renderBar = (category: CategoryData, maxValue: number, isIncome: boolean) => {
    const percentage = (Math.abs(category.amount) / maxValue) * 100;
    
    return (
      <div key={category.name} className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{category.name}</span>
          <span className={`text-sm font-bold ${
            isIncome ? 'text-green-600' : 'text-red-600'
          }`}>
            {isIncome ? '+' : ''}{category.amount.toLocaleString()} NOK
          </span>
        </div>
        <div className="bg-gray-200 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              backgroundColor: category.color
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Category Overview</h3>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Income Categories */}
          <div>
            <h4 className="text-md font-semibold text-green-700 mb-4">Income Categories</h4>
            <div className="space-y-3">
              {incomeCategories.map(category => 
                renderBar(category, maxIncome, true)
              )}
            </div>
          </div>

          {/* Expense Categories */}
          <div>
            <h4 className="text-md font-semibold text-red-700 mb-4">Expense Categories</h4>
            <div className="space-y-3">
              {expenseCategories.map(category => 
                renderBar(category, maxExpense, false)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryChartsCard;