import React from 'react';
import { Plus, ArrowUpRight, Target } from 'lucide-react';
import RecentActivityItem from '../common/RecentActivityItem';

interface Activity {
  id: number;
  type: 'income' | 'expense' | 'transfer';
  description: string;
  amount: number;
  date: string;
  icon: React.ElementType;
}

interface QuickActionsProps {
  recentActivities: Activity[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ recentActivities }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button className="flex items-center justify-center p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
            <Plus className="h-5 w-5 mr-2" />
            Add Income
          </button>
          <button className="flex items-center justify-center p-4 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
            <Plus className="h-5 w-5 mr-2" />
            Add Expense
          </button>
          <button className="flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
            <ArrowUpRight className="h-5 w-5 mr-2" />
            Transfer
          </button>
          <button className="flex items-center justify-center p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
            <Target className="h-5 w-5 mr-2" />
            Set Goal
          </button>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
        </div>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <RecentActivityItem key={activity.id} {...activity} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;