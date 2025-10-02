import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'card' | 'chart' | 'table' | 'text' | 'avatar';
  width?: string;
  height?: string;
  className?: string;
  count?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'card',
  width,
  height,
  className = '',
  count = 1
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'card':
        return 'h-32 w-full rounded-lg';
      case 'chart':
        return 'h-64 w-full rounded-lg';
      case 'table':
        return 'h-8 w-full rounded';
      case 'text':
        return 'h-4 w-3/4 rounded';
      case 'avatar':
        return 'h-12 w-12 rounded-full';
      default:
        return 'h-4 w-full rounded';
    }
  };

  const skeletonClasses = `bg-gray-200 animate-pulse ${getVariantClasses()} ${className}`;
  const style = { width, height };

  if (count === 1) {
    return <div className={skeletonClasses} style={style} />;
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={skeletonClasses} style={style} />
      ))}
    </div>
  );
};

export default SkeletonLoader;