import React from 'react';
import { Brain } from 'lucide-react';

interface FinancialAwarenessSummaryProps {
  totalMonthlyIncome: number;
  totalMonthlyExpenses: number;
  biggestExpenseCategory: { name: string; spent: number } | undefined;
  savingsRate: number;
  paycheckDays: number;
  netLeftoverUntilPaycheck: number;
}

const FinancialAwarenessSummary: React.FC<FinancialAwarenessSummaryProps> = ({
  totalMonthlyIncome,
  totalMonthlyExpenses,
  biggestExpenseCategory,
  savingsRate,
  paycheckDays,
  netLeftoverUntilPaycheck
}) => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Brain className="h-6 w-6 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">Your Money Story This Month</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            NOK {totalMonthlyIncome.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600">Money Coming In</p>
          <p className="text-xs text-gray-500 mt-1">Your total income this month</p>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">
            NOK {totalMonthlyExpenses.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600">Money Going Out</p>
          <p className="text-xs text-gray-500 mt-1">Your total expenses this month</p>
        </div>
        
        <div className="text-center">
          <div className={`text-3xl font-bold mb-2 ${
            totalMonthlyIncome - totalMonthlyExpenses > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            NOK {(totalMonthlyIncome - totalMonthlyExpenses).toLocaleString()}
          </div>
          <p className="text-sm text-gray-600">Net Result</p>
          <p className="text-xs text-gray-500 mt-1">
            {totalMonthlyIncome - totalMonthlyExpenses > 0 ? 'Money saved' : 'Overspent'} this month
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-2">💡 Key Insights About Your Money</h4>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>• Your biggest expense category is <strong>{biggestExpenseCategory?.name}</strong> at NOK {biggestExpenseCategory?.spent.toLocaleString()}</li>
          <li>• You're saving <strong>{savingsRate.toFixed(1)}%</strong> of your income {savingsRate >= 20 ? '(Excellent!)' : savingsRate >= 10 ? '(Good)' : '(Could improve)'}</li>
          <li>• You have <strong>{paycheckDays} days</strong> until your next paycheck</li>
          <li>• Your money will {netLeftoverUntilPaycheck >= 0 ? 'last until payday' : 'run short before payday'}</li>
        </ul>
      </div>
    </div>
  );
};

export default FinancialAwarenessSummary;