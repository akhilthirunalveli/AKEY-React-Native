import { Background } from '@react-navigation/elements';

export const COLORS = {
  primary: '#6A0DAD', // Deep Purple
  secondary: '#9370DB', // Medium Slate Blue
  accent: '#8A2BE2', // Blue Violet
  success: '#32CD32', // Lime Green
  warning: '#FFA500', // Orange
  error: '#DC143C', // Crimson
  background: '#000000d7', // Dark Black
  surface: '#191919d7', // Dark Gray
  text: '#FFFFFF', // White
  textSecondary: '#B19CD9', // Light Purple
  border: '#4c008243', // Indigo
  placeholder: '#9370DB', // Medium Slate Blue
  gradient1: '#2E0249', // Dark Purple gradient start
  gradient2: '#6A0DAD', // Deep Purple gradient end
  gradient3: '#8A2BE2', // Blue Violet gradient
  Background1: '#000000',
};

// Export typography
export * from './typography';

export const SCREEN_NAMES = {
  INDEX: 'index',
  LOGIN: 'login',
  REGISTER: 'register',
  PASSWORD_LIST: 'password-list',
  ADD_PASSWORD: 'add-password',
  PASSWORD_DETAILS: 'password-details',
  SETTINGS: 'settings',
} as const;
