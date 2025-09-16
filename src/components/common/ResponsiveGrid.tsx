import React from 'react';
import { RESPONSIVE_CLASSES, GRID_COLS } from '../../constants/responsive';

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = {
    mobile: GRID_COLS.mobile,
    tablet: GRID_COLS.tablet,
    desktop: GRID_COLS.desktop,
    wide: GRID_COLS.wide,
  },
  gap = 'md',
  className = '',
}) => {
  const gapClasses = {
    sm: 'gap-2 md:gap-4',
    md: 'gap-4 md:gap-6',
    lg: 'gap-6 md:gap-8',
  };

  const gridClasses = [
    'grid',
    `grid-cols-${columns.mobile}`,
    columns.tablet && `md:grid-cols-${columns.tablet}`,
    columns.desktop && `lg:grid-cols-${columns.desktop}`,
    columns.wide && `xl:grid-cols-${columns.wide}`,
    gapClasses[gap],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

export default ResponsiveGrid;