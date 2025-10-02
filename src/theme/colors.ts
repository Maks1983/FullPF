// Centralized color and icon theme system
export const colors = {
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    trend: 'text-emerald-600',
    border: 'border-emerald-500',
    badge: 'bg-emerald-100 text-emerald-800',
    button: 'text-emerald-600 hover:text-emerald-800'
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    trend: 'text-green-600',
    border: 'border-green-500',
    badge: 'bg-green-100 text-green-800',
    button: 'text-green-600 hover:text-green-800'
  },
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    trend: 'text-blue-600',
    border: 'border-blue-500',
    badge: 'bg-blue-100 text-blue-800',
    button: 'text-blue-600 hover:text-blue-800'
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    trend: 'text-purple-600',
    border: 'border-purple-500',
    badge: 'bg-purple-100 text-purple-800',
    button: 'text-purple-600 hover:text-purple-800'
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    trend: 'text-red-600',
    border: 'border-red-500',
    badge: 'bg-red-100 text-red-800',
    button: 'text-red-600 hover:text-red-800'
  },
  yellow: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
    trend: 'text-yellow-600',
    border: 'border-yellow-500',
    badge: 'bg-yellow-100 text-yellow-800',
    button: 'text-yellow-600 hover:text-yellow-800'
  },
  indigo: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    trend: 'text-indigo-600',
    border: 'border-indigo-500',
    badge: 'bg-indigo-100 text-indigo-800',
    button: 'text-indigo-600 hover:text-indigo-800'
  }
} as const;

export type ColorKey = keyof typeof colors;