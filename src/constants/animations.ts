// Animation system constants
export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 1000,
} as const;

export const EASING = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

export const TRANSITIONS = {
  default: `all ${ANIMATION_DURATIONS.normal}ms ${EASING.easeInOut}`,
  fast: `all ${ANIMATION_DURATIONS.fast}ms ${EASING.easeOut}`,
  slow: `all ${ANIMATION_DURATIONS.slow}ms ${EASING.easeInOut}`,
  bounce: `all ${ANIMATION_DURATIONS.normal}ms ${EASING.bounce}`,
} as const;

export const ANIMATION_CLASSES = {
  fadeIn: 'animate-in fade-in duration-300',
  fadeOut: 'animate-out fade-out duration-300',
  slideIn: 'animate-in slide-in-from-bottom-4 duration-300',
  slideOut: 'animate-out slide-out-to-bottom-4 duration-300',
  scaleIn: 'animate-in zoom-in-95 duration-200',
  scaleOut: 'animate-out zoom-out-95 duration-200',
} as const;

// Hover and focus states
export const INTERACTIVE_STATES = {
  hover: 'hover:scale-105 hover:shadow-lg transition-all duration-200',
  focus: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  active: 'active:scale-95 transition-transform duration-100',
  disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
} as const;