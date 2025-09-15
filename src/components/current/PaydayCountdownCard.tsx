import React from 'react';
import { Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import type { PaydayInfo } from '../../types/current';

interface PaydayCountdownCardProps {
  paydayInfo: PaydayInfo;
}

const PaydayCountdownCard: React.FC<PaydayCountdownCardProps> = ({ paydayInfo }) => {
  const { currentSaldo, remainingPayments, remainingPaymentsTotal, netLeftover, daysUntilPayday } = paydayInfo;
  
  const isPositive = netLeftover >= 0;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const progress = Math.max(0, Math.min(1, (30 - daysUntilPayday) / 30)); // Assuming 30-day cycle
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Leftover Until Next Payday</h2>
        <Calendar className="h-6 w-6 text-blue-600" />
      </div>

      <div className="flex items-center justify-center mb-8">
        {/* Doughnut Chart */}
        <div className="relative">
          <svg width="200" height="200" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="45"
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="transparent"
            />
            
            {/* Progress circle (outer ring) */}
            <circle
              cx="100"
              cy="100"
              r="45"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d1d5db" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Inner content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {daysUntilPayday}
            </div>
            <div className="text-sm text-gray-600 text-center">
              days until<br />payday
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
          <span className="text-gray-700 font-medium">Current Saldo:</span>
          <span className="text-lg font-bold text-blue-600">
            {currentSaldo.toFixed(2)} NOK
          </span>
        </div>

        <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
          <span className="text-gray-700 font-medium">
            Remaining Payments ({remainingPayments}):
          </span>
          <span className="text-lg font-bold text-red-600">
            {remainingPaymentsTotal.toFixed(2)} NOK
          </span>
        </div>

        <div className={`flex justify-between items-center p-4 rounded-lg border-2 ${
          isPositive 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            {isPositive ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            )}
            <span className="text-gray-700 font-medium">Net Leftover:</span>
          </div>
          <span className={`text-xl font-bold ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {netLeftover.toFixed(2)} NOK
          </span>
        </div>
      </div>

      {!isPositive && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-sm text-red-800 font-medium">
            ⚠️ You'll be short {Math.abs(netLeftover).toFixed(2)} NOK before payday
          </p>
        </div>
      )}
    </div>
  );
};

export default PaydayCountdownCard;