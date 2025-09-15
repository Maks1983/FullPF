import React from 'react';
import { Calendar, AlertTriangle, TrendingDown } from 'lucide-react';
import type { CurrentAccount, PaycheckInfo } from '../../types/current';

interface AvailableMoneyCardProps {
  accounts: CurrentAccount[];
  totalAvailable: number;
  netLeftover: number;
  paycheckInfo: PaycheckInfo;
}

const AvailableMoneyCard: React.FC<AvailableMoneyCardProps> = ({
  accounts,
  totalAvailable,
  netLeftover,
  paycheckInfo
}) => {
  const isDeficit = netLeftover < 0;
  
  // Calculate progress for circular indicator
  const progress = Math.max(0, Math.min(100, ((30 - paycheckInfo.daysUntilPaycheck) / 30) * 100));

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all ${
      isDeficit ? 'border-red-200 bg-red-50' : ''
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${isDeficit ? 'bg-red-100' : 'bg-blue-100'}`}>
            <Calendar className={`h-5 w-5 ${isDeficit ? 'text-red-600' : 'text-blue-600'}`} />
          </div>
          <div className="ml-3">
            <h3 className="text-base font-medium text-gray-500">Available Money</h3>
            <p className="text-sm text-gray-600">Until next payday</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center mb-6">
        {/* Circular progress indicator */}
        <div className="relative">
          <div className="w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {/* Background circle */}
              <path
                className="text-gray-200"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Progress circle */}
              <path
                className={isDeficit ? 'text-red-500' : 'text-blue-500'}
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${progress}, 100`}
                strokeLinecap="round"
                fill="transparent"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-3xl font-bold ${isDeficit ? 'text-red-600' : 'text-gray-900'}`}>
                {paycheckInfo.daysUntilPaycheck}
              </div>
              <div className="text-sm text-gray-500">
                {paycheckInfo.daysUntilPaycheck === 1 ? 'day' : 'days'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-center">
          <p className={`text-3xl font-bold ${isDeficit ? 'text-red-600' : 'text-gray-900'}`}>
            NOK {Math.abs(netLeftover).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            {isDeficit ? 'Short until payday' : 'Left until payday'}
          </p>
        </div>
        
        <div className="text-center pt-2 border-t">
          <p className="text-sm text-gray-600">
            Total available: <span className="font-medium">NOK {totalAvailable.toLocaleString()}</span>
          </p>
        </div>
        
        {isDeficit && (
          <div className="flex items-center justify-center text-red-600 text-sm">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span>May run short before payday</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableMoneyCard;