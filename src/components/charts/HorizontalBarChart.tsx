import React from 'react';

interface HorizontalBarChartData {
  category: string;
  amount: number;
  color: string;
}

interface HorizontalBarChartProps {
  data: HorizontalBarChartData[];
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ data }) => {
  const maxAmount = Math.max(...data.map(item => item.amount));

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-900">{item.category}</span>
            <span className="text-gray-600">${item.amount.toLocaleString()}</span>
          </div>
          <div className="bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${(item.amount / maxAmount) * 100}%`,
                backgroundColor: item.color
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default HorizontalBarChart;