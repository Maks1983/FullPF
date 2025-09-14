import React from 'react';

interface GoalCardProps {
  name: string;
  current: number;
  target: number;
  deadline: string;
  onTrack: boolean;
  monthlyContribution: number;
  projectedCompletion: string;
}

const GoalCard: React.FC<GoalCardProps> = ({
  name,
  current,
  target,
  deadline,
  onTrack,
  monthlyContribution,
  projectedCompletion
}) => {
  const progress = (current / target) * 100;
  
  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900">{name}</h4>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          onTrack ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {onTrack ? 'On Track' : 'Behind'}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">NOK {current.toLocaleString()} / {target.toLocaleString()}</span>
        </div>
        <div className="bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              onTrack ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{width: `${Math.min(progress, 100)}%`}}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{progress.toFixed(0)}% complete</span>
          <span>Target: {deadline}</span>
        </div>
      </div>
      
      <div className="text-xs text-gray-600">
        <div className="flex justify-between mb-1">
          <span>Monthly: NOK {monthlyContribution.toLocaleString()}</span>
          <span>ETA: {projectedCompletion}</span>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;