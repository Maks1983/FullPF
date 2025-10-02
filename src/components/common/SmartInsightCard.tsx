import React from 'react';
import { colors } from '../../theme/colors';

interface SmartInsightCardProps {
  type: 'opportunity' | 'warning' | 'achievement';
  title: string;
  message: string;
  impact: string;
  action: string;
  icon: React.ElementType;
  color: ColorKey;
}

const SmartInsightCard: React.FC<SmartInsightCardProps> = ({
  type,
  title,
  message,
  impact,
  action,
  icon: Icon,
  color
}) => {
  const colorTheme = colors[color];

  return (
    <div className={`p-4 rounded-lg border-l-4 ${colorTheme.border} ${colorTheme.bg} hover:shadow-sm transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <Icon className={`h-5 w-5 ${colorTheme.text} mr-2 flex-shrink-0`} />
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${colorTheme.badge}`}>
          {impact}
        </span>
        <button className={`text-sm font-medium ${colorTheme.button} transition-colors`}>
          {action}
        </button>
      </div>
    </div>
  );
};

export default SmartInsightCard;