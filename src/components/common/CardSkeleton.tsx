import React from 'react';

interface CardSkeletonProps {
  className?: string;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`bg-gradient-to-br from-slate-700 to-slate-800 p-4 rounded-lg shadow-lg animate-pulse ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left side skeleton */}
        <div className="flex-1">
          <div className="h-3 bg-slate-600 rounded w-24 mb-2"></div>
          <div className="h-8 bg-slate-600 rounded w-32 mb-1"></div>
          <div className="h-3 bg-slate-600 rounded w-20"></div>
        </div>
        
        {/* Right side skeleton */}
        <div className="ml-4">
          <div className="w-16 h-16 bg-slate-600 rounded-full"></div>
        </div>
      </div>
      
      {/* Bottom section skeleton */}
      <div className="mt-3 pt-3 border-t border-slate-600">
        <div className="h-3 bg-slate-600 rounded w-40"></div>
      </div>
    </div>
  );
};

export default CardSkeleton;