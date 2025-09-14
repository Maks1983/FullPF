import React from 'react';
import { Target, Plus } from 'lucide-react';
import GoalCard from '../common/GoalCard';

interface Goal {
  name: string;
  current: number;
  target: number;
  deadline: string;
  onTrack: boolean;
  monthlyContribution: number;
  projectedCompletion: string;
}

interface GoalsSectionProps {
  goals: Goal[];
}

const GoalsSection: React.FC<GoalsSectionProps> = ({ goals }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Target className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Goal Progress & Projections</h3>
          </div>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            New Goal
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, index) => (
            <GoalCard key={index} {...goal} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoalsSection;