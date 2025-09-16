// Responsive design system constants
export const BREAKPOINTS = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const SPACING = {
  xs: '0.25rem', // 4px
  sm: '0.5rem',  // 8px
  md: '1rem',    // 16px
  lg: '1.5rem',  // 24px
  xl: '2rem',    // 32px
  '2xl': '3rem', // 48px
} as const;

export const GRID_COLS = {
  mobile: 1,
  tablet: 2,
  desktop: 3,
  wide: 4,
} as const;

export const CARD_SIZES = {
  compact: {
    padding: 'p-4',
    height: 'h-32',
    textSize: 'text-sm',
  },
  normal: {
    padding: 'p-6',
    height: 'h-40',
    textSize: 'text-base',
  },
  large: {
    padding: 'p-8',
    height: 'h-48',
    textSize: 'text-lg',
  },
} as const;

// Responsive utility classes
export const RESPONSIVE_CLASSES = {
  cardGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6',
  flexResponsive: 'flex flex-col md:flex-row',
  textResponsive: 'text-sm md:text-base lg:text-lg',
  paddingResponsive: 'p-4 md:p-6 lg:p-8',
  marginResponsive: 'm-4 md:m-6 lg:m-8',
} as const;