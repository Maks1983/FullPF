import React from 'react';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';

interface NetCashflowCardProps {
  monthlyIncome: number;
  monthlyExpenses: number;
  onClick: () => void;
}

const NetCashflowCard: React.FC<NetCashflowCardProps> = ({
  monthlyIncome,
  monthlyExpenses,
  onClick
}) => {
  const netCashflow = monthlyIncome - monthlyExpenses;
  const isPositive = netCashflow >= 0;
  const flowPercentage = Math.abs(netCashflow / monthlyIncome) * 100;

  return (
    <div 
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
            {isPositive ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Net Cashflow</h3>
            <p className="text-sm text-gray-600">Monthly money direction</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <p className={`text-3xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}NOK {netCashflow.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            {flowPercentage.toFixed(1)}% of income {isPositive ? 'saved' : 'overspent'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-green-600">
              NOK {monthlyIncome.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Income</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-red-600">
              NOK {monthlyExpenses.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Expenses</p>
          </div>
        </div>

        <div className={`p-3 rounded-lg ${
          isPositive ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <p className={`text-sm font-medium text-center ${
            isPositive ? 'text-green-800' : 'text-red-800'
          }`}>
            {isPositive 
              ? `Building wealth at NOK ${Math.abs(netCashflow).toLocaleString()}/month`
              : `Spending NOK ${Math.abs(netCashflow).toLocaleString()} more than earning`
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default NetCashflowCard;