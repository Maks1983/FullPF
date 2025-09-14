import React from 'react';
import { Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import type { PaydayInfo } from '../../types/current';

interface PaydayCountdownProps {
  payday: PaydayInfo;
  projectedBalance: number;
}

const PaydayCountdown: React.FC<PaydayCountdownProps> = ({ payday, projectedBalance }) => {
  const isNegative = projectedBalance < 0;
  const urgency = payday.daysUntil <= 7 ? 'high' : payday.daysUntil <= 14 ? 'medium' : 'low';

  const getUrgencyColors = () => {
    if (isNegative && urgency === 'high') {
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-900',
        accent: 'text-red-600'
      };
    }
    if (isNegative) {
      return {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-900',
        accent: 'text-orange-600'
      };
    }
    return {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-900',
      accent: 'text-green-600'
    };
  };

  const colors = getUrgencyColors();

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border ${colors.border} hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-xl ${colors.bg}`}>
            <Calendar className={`h-6 w-6 ${colors.accent}`} />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-gray-900">Next Payday</h3>
            <p className="text-sm text-gray-600">{payday.date}</p>
          </div>
        </div>
        {isNegative && (
          <AlertCircle className="h-5 w-5 text-red-500" />
        )}
      </div>

      {/* Countdown Circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke={isNegative ? '#ef4444' : '#10b981'}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${(payday.daysUntil / 30) * 314} 314`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-3xl font-bold ${colors.text}`}>
                {payday.daysUntil}
              </div>
              <div className="text-sm text-gray-600">days</div>
            </div>
          </div>
        </div>
      </div>

      {/* Payday Details */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Expected Amount</span>
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="font-semibold text-green-600">
              NOK {payday.amount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Projected Balance</span>
          <span className={`font-bold ${
            projectedBalance >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            NOK {Math.abs(projectedBalance).toLocaleString()}
            {projectedBalance < 0 && ' deficit'}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Confidence</span>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            payday.confidence === 'high' ? 'bg-green-100 text-green-800' :
            payday.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {payday.confidence.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Warning Message */}
      {isNegative && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-700">
            ⚠️ Projected deficit - consider reducing expenses or transferring funds
          </p>
        </div>
      )}
    </div>
  );
};

export default PaydayCountdown;