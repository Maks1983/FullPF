import React from 'react';
import { Wallet, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
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
  // Calculate net change (mock data - in real app this would come from props)
  const previousTotalAvailable = 17250;
  const netChange = totalAvailable - previousTotalAvailable;
  const isPositiveChange = netChange >= 0;
  
  return (
    <a 
      href="#" 
      className="block text-decoration-none text-inherit hover:shadow-lg transition-shadow"
      onClick={(e) => e.preventDefault()}
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-32 cursor-pointer hover:border-blue-300 transition-colors">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-lg font-semibold text-gray-900 m-0">Available Money</h5>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Wallet className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        
        {/* Main Value */}
        <div className="mb-3">
          <h1 className="text-2xl font-bold text-gray-900 m-0">
            NOK {totalAvailable.toLocaleString()}
          </h1>
        </div>
        
        {/* Change Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isPositiveChange ? (
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
            )}
            <span className={`text-xs font-medium ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
              {isPositiveChange ? '+' : ''}NOK {Math.abs(netChange).toLocaleString()}
            </span>
            <span className="text-xs text-gray-500 ml-2">Since last month</span>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </a>
  );
};

export default AvailableMoneyCard;