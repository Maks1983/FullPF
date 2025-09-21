import React, { useState } from 'react';
import { Tag, Plus, Edit3, Trash2, BarChart3 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  budget?: number;
  isDefault: boolean;
  isActive: boolean;
}

interface CategoriesSettingsProps {
  onChanged: () => void;
}

const CategoriesSettings: React.FC<CategoriesSettingsProps> = ({ onChanged }) => {
  const [categories, setCategories] = useState<Category[]>([
    { id: 'cat1', name: 'Housing', type: 'expense', color: '#ef4444', budget: 15000, isDefault: true, isActive: true },
    { id: 'cat2', name: 'Food & Dining', type: 'expense', color: '#f59e0b', budget: 5000, isDefault: true, isActive: true },
    { id: 'cat3', name: 'Transportation', type: 'expense', color: '#3b82f6', budget: 3500, isDefault: true, isActive: true },
    { id: 'cat4', name: 'Entertainment', type: 'expense', color: '#8b5cf6', budget: 1500, isDefault: false, isActive: true },
    { id: 'cat5', name: 'Shopping', type: 'expense', color: '#ec4899', budget: 2000, isDefault: false, isActive: true },
    { id: 'cat6', name: 'Utilities', type: 'expense', color: '#10b981', budget: 2200, isDefault: true, isActive: true },
    { id: 'cat7', name: 'Healthcare', type: 'expense', color: '#06b6d4', budget: 1200, isDefault: true, isActive: true },
    { id: 'cat8', name: 'Salary', type: 'income', color: '#22c55e', isDefault: true, isActive: true },
    { id: 'cat9', name: 'Freelance', type: 'income', color: '#059669', isDefault: false, isActive: true },
    { id: 'cat10', name: 'Investment Income', type: 'income', color: '#047857', isDefault: false, isActive: false }
  ]);

  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredCategories = categories.filter(cat => {
    if (filter === 'all') return true;
    return cat.type === filter;
  });

  const handleToggleCategory = (id: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
    ));
    onChanged();
  };

  const handleUpdateBudget = (id: string, budget: number) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, budget } : cat
    ));
    onChanged();
  };

  const totalExpenseBudget = categories
    .filter(cat => cat.type === 'expense' && cat.isActive && cat.budget)
    .reduce((sum, cat) => sum + (cat.budget || 0), 0);

  return (
    <div className="space-y-6">
      {/* Categories Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Tag className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Categories & Budgets</h2>
              <p className="text-sm text-gray-600">Organize your income and expenses</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </button>
          </div>
        </div>

        {/* Budget Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {categories.filter(cat => cat.type === 'income' && cat.isActive).length}
            </p>
            <p className="text-sm text-gray-600">Income Categories</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {categories.filter(cat => cat.type === 'expense' && cat.isActive).length}
            </p>
            <p className="text-sm text-gray-600">Expense Categories</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              NOK {totalExpenseBudget.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Budget</p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className={`p-4 rounded-lg border transition-all ${
                category.isActive ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className={`px-2 py-1 rounded-full ${
                        category.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {category.type}
                      </span>
                      {category.isDefault && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleCategory(category.id)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      category.isActive
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category.isActive ? 'Active' : 'Inactive'}
                  </button>
                  {!category.isDefault && (
                    <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {category.type === 'expense' && category.budget && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Monthly Budget</span>
                    <span className="font-medium">NOK {category.budget.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    step="100"
                    value={category.budget}
                    onChange={(e) => handleUpdateBudget(category.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${category.color} 0%, ${category.color} ${(category.budget / 20000) * 100}%, #e5e7eb ${(category.budget / 20000) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Smart Categorization Rules */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <BarChart3 className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Smart Categorization Rules</h3>
            <p className="text-sm text-gray-600">Automatically categorize transactions</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Active Rules</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rema 1000, ICA, Coop → Food & Dining</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shell, Circle K, Esso → Transportation</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Netflix, Spotify, HBO → Entertainment</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
            </div>
          </div>

          <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Plus className="h-4 w-4 mr-2 inline" />
            Add New Rule
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriesSettings;