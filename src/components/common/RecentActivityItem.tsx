import React from 'react';

interface RecentActivityItemProps {
  id: number;
  type: 'income' | 'expense' | 'transfer';
  description: string;
  amount: number;
  date: string;
  icon: React.ElementType;
}

const RecentActivityItem: React.FC<RecentActivityItemProps> = ({
  type,
  description,
  amount,
  date,
  icon: Icon
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'income':
        return {
          bg: 'bg-green-100',
          icon: 'text-green-600',
          amount: 'text-green-600'
        };
      case 'expense':
        return {
          bg: 'bg-red-100',
          icon: 'text-red-600',
          amount: 'text-red-600'
        };
      case 'transfer':
        return {
          bg: 'bg-blue-100',
          icon: 'text-blue-600',
          amount: 'text-blue-600'
        };
      default:
        return {
          bg: 'bg-gray-100',
          icon: 'text-gray-600',
          amount: 'text-gray-600'
        };
    }
  };

  const styles = getTypeStyles();
  const formattedAmount = type === 'expense' 
    ? `-NOK ${Math.abs(amount).toLocaleString()}`
    : type === 'income'
    ? `+NOK ${amount.toLocaleString()}`
    : `NOK ${amount.toLocaleString()}`;

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center">
        <div className={`w-8 h-8 ${styles.bg} rounded-full flex items-center justify-center mr-3`}>
          <Icon className={`h-4 w-4 ${styles.icon}`} />
        </div>
        <div>
          <p className="font-medium text-gray-900 text-sm">{description}</p>
          <p className="text-xs text-gray-600">{date}</p>
        </div>
      </div>
      <span className={`font-semibold ${styles.amount}`}>{formattedAmount}</span>
    </div>
  );
};

export default RecentActivityItem;