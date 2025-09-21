import React, { useState } from 'react';
import { Target, Plus, Edit3, Trash2, Calendar, DollarSign } from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  monthlyContribution: number;
  priority: 'high' | 'medium' | 'low';
  category: 'emergency' | 'savings' | 'investment' | 'purchase' | 'debt';
  isActive: boolean;
  linkedAccountId?: string;
}

interface GoalsSettingsProps {
  onChanged: () => void;
}

const GoalsSettings: React.FC<GoalsSettingsProps> = ({ onChanged }) => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 'goal1',
      name: 'Emergency Fund',
      targetAmount: 180000,
      currentAmount: 129200,
      deadline: '2024-12-31',
      monthlyContribution: 5000,
      priority: 'high',
      category: 'emergency',
      isActive: true,
      linkedAccountId: 'acc_emergency'
    },
    {
      id: 'goal2',
      name: 'Travel Fund',
      targetAmount: 60000,
      currentAmount: 47200,
      deadline: '2024-08-15',
      monthlyContribution: 3000,
      priority: 'medium',
      category: 'savings',
      isActive: true,
      linkedAccountId: 'acc_highyield'
    },
    {
      id: 'goal3',
      name: 'House Down Payment',
      targetAmount: 500000,
      currentAmount: 125000,
      deadline: '2026-06-30',
      monthlyContribution: 8000,
      priority: 'high',
      category: 'purchase',
      isActive: true,
      linkedAccountId: 'acc_investment'
    },
    {
      id: 'goal4',
      name: 'New Car',
      targetAmount: 350000,
      currentAmount: 45000,
      deadline: '2025-03-31',
      monthlyContribution: 4000,
      priority: 'low',
      category: 'purchase',
      isActive: false
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredGoals = goals.filter(goal => {
    if (filter === 'active') return goal.isActive;
    if (filter === 'completed') return goal.currentAmount >= goal.targetAmount;
    return true;
  });

  const handleToggleGoal = (id: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, isActive: !goal.isActive } : goal
    ));
    onChanged();
  };

  const handleUpdateContribution = (id: string, contribution: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, monthlyContribution: contribution } : goal
    ));
    onChanged();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'savings': return 'bg-blue-100 text-blue-800';
      case 'investment': return 'bg-purple-100 text-purple-800';
      case 'purchase': return 'bg-green-100 text-green-800';
      case 'debt': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Goals Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Financial Goals</h2>
              <p className="text-sm text-gray-600">Set and track your savings targets</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Goals</option>
              <option value="active">Active Only</option>
              <option value="completed">Completed</option>
            </select>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </button>
          </div>
        </div>

        {/* Goals Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {goals.filter(goal => goal.isActive).length}
            </p>
            <p className="text-sm text-gray-600">Active Goals</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              NOK {goals.filter(goal => goal.isActive).reduce((sum, goal) => sum + goal.monthlyContribution, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Monthly Savings</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              NOK {goals.reduce((sum, goal) => sum + goal.currentAmount, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Saved</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {goals.filter(goal => goal.currentAmount >= goal.targetAmount).length}
            </p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          {filteredGoals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const monthsToComplete = Math.ceil((goal.targetAmount - goal.currentAmount) / goal.monthlyContribution);
            
            return (
              <div
                key={goal.id}
                className={`p-4 rounded-lg border transition-all ${
                  goal.isActive ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">{goal.name}</h4>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className={`px-2 py-1 rounded-full ${getCategoryColor(goal.category)}`}>
                          {goal.category}
                        </span>
                        <span className={`px-2 py-1 rounded-full ${getPriorityColor(goal.priority)}`}>
                          {goal.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        NOK {goal.currentAmount.toLocaleString()} / {goal.targetAmount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">{progress.toFixed(0)}% complete</p>
                    </div>
                    <button
                      onClick={() => handleToggleGoal(goal.id)}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        goal.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {goal.isActive ? 'Active' : 'Paused'}
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Goal Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Monthly:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <input
                        type="number"
                        value={goal.monthlyContribution}
                        onChange={(e) => handleUpdateContribution(goal.id, parseInt(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-xs"
                      />
                      <span className="text-gray-500">NOK</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Deadline:</span>
                    <p className="font-medium text-gray-900 mt-1">
                      {new Date(goal.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">ETA:</span>
                    <p className="font-medium text-gray-900 mt-1">
                      {monthsToComplete > 0 ? `${monthsToComplete} months` : 'Complete!'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Remaining:</span>
                    <p className="font-medium text-gray-900 mt-1">
                      NOK {(goal.targetAmount - goal.currentAmount).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Goal Templates */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Goal Templates</h3>
            <p className="text-sm text-gray-600">Quick start with common financial goals</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Emergency Fund', amount: 180000, months: 6, category: 'emergency' },
            { name: 'Vacation Fund', amount: 50000, months: 12, category: 'savings' },
            { name: 'New Car', amount: 300000, months: 24, category: 'purchase' },
            { name: 'Home Renovation', amount: 150000, months: 18, category: 'purchase' },
            { name: 'Wedding Fund', amount: 200000, months: 15, category: 'savings' },
            { name: 'Education Fund', amount: 100000, months: 36, category: 'investment' }
          ].map((template, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
              <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Target: NOK {template.amount.toLocaleString()}</p>
                <p>Timeline: {template.months} months</p>
                <p>Monthly: NOK {Math.round(template.amount / template.months).toLocaleString()}</p>
              </div>
              <button className="mt-3 w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Use Template
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoalsSettings;