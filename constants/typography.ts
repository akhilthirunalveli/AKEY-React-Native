import { TextStyle } from 'react-native';

export const FONTS = {
  light: 'FunnelDisplay-Light',
  regular: 'FunnelDisplay-Regular',
  medium: 'FunnelDisplay-Medium',
  semiBold: 'FunnelDisplay-SemiBold',
  bold: 'FunnelDisplay-Bold',
};

export const TYPOGRAPHY: Record<string, TextStyle> = {
  // Headings
  h1: {
    fontFamily: FONTS.bold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: FONTS.semiBold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.2,
  },
  h4: {
    fontFamily: FONTS.semiBold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.1,
  },
  
  // Body text
  body1: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  body2: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  
  // UI text
  button: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  caption: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  
  // Special
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  
  // Number pad
  numberPad: {
    fontFamily: FONTS.medium,
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: 0,
  },
};
