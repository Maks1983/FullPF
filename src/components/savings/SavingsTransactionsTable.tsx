import React from 'react';
import { Activity, Filter, Plus, Download } from 'lucide-react';
import Table from '../common/Table';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: string;
  account: string;
  goalImpact: string;
}

interface SavingsTransactionsTableProps {
  transactions: Transaction[];
  columns: any[];
  sortConfig: any;
  onSort: (config: any) => void;
}

const SavingsTransactionsTable: React.FC<SavingsTransactionsTableProps> = ({
  transactions,
  columns,
  sortConfig,
  onSort
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Your Wealth-Building Actions</h3>
              <p className="text-sm text-gray-600">Every transaction moves you closer to your goals</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </button>
          </div>
        </div>
      </div>
      
      <Table 
        data={transactions} 
        columns={columns}
        sortConfig={sortConfig}
        onSort={onSort}
      />
      
      {/* Summary Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-lg font-bold text-green-600">
              +NOK {transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Total Deposits</p>
          </div>
          <div>
            <div className="text-lg font-bold text-red-600">
              NOK {Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Total Withdrawals</p>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              +NOK {(transactions.reduce((sum, t) => sum + t.amount, 0)).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Net Growth</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsTransactionsTable;