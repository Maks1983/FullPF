import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BaseFinancialCardProps {
  title: string;
  value: string;
  subtitle?: string;
  status?: 'positive' | 'negative' | 'warning' | 'neutral';
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const BaseFinancialCard: React.FC<BaseFinancialCardProps> = ({
  title,
  value,
  subtitle,
  status = 'neutral',
  onClick,
  children,
  className = ''
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'positive':
        return 'text-green-400';
      case 'negative':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      default:
        return 'text-white';
    }
  };

  const baseClasses = `bg-gradient-to-br from-slate-700 to-slate-800 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all ${
    onClick ? 'cursor-pointer group' : ''
  } relative ${className}`;

  const content = (
    <>
      <div className="flex items-center justify-between">
        {/* Left side - Main info */}
        <div className="flex-1">
          <div className="text-xs text-slate-300 mb-1">
            {title}
          </div>
          <div className={`text-2xl font-bold mb-1 ${getStatusStyles()}`}>
            {value}
          </div>
          {subtitle && (
            <div className="text-xs text-slate-400">
              {subtitle}
            </div>
          )}
        </div>
        
        {/* Right side - Custom content */}
        {children}
      </div>
      
      {onClick && (
        <div className="flex items-center justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-slate-400 mr-2">View details</span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </div>
      )}
    </>
  );

  if (onClick) {
    return (
      <div className={baseClasses} onClick={onClick}>
        {content}
      </div>
    );
  }

  return (
    <div className={baseClasses}>
      {content}
    </div>
  );
};

export default BaseFinancialCard;