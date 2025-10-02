import React from 'react';
import { RefreshCw, Plus } from 'lucide-react';
import BankConnectionStatus from './BankConnectionStatus';

interface DashboardHeaderProps {
  timeframe: string;
  setTimeframe: (timeframe: string) => void;
  refreshing: boolean;
  onRefresh: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  timeframe,
  setTimeframe,
  refreshing,
  onRefresh
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Command Center</h1>
          <p className="text-gray-600 mt-1">Your complete financial overview and insights</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Time Range Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  timeframe === period
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          
          {/* Action Buttons */}
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Sync
          </button>
          
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Bank Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BankConnectionStatus />
        
        {/* Placeholder for other status widgets */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Data Sync Status</h3>
          <p className="text-sm text-gray-600">All accounts up to date</p>
          <p className="text-xs text-gray-500 mt-1">Last sync: 2 minutes ago</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">System Health</h3>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600">All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;