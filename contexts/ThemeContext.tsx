import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define available themes
export const THEMES = {
  dark: {
    name: 'Pure Dark',
    colors: {
      primary: '#dededeff',
      secondary: '#5a5a5aff',
      accent: '#AAAAAA',
      success: '#32CD32',
      warning: '#FFA500',
      error: '#DC143C',
      background: '#000000d7',
      surface: '#111111ff',
      text: '#FFFFFF',
      textSecondary: '#CCCCCC',
      border: '#333333',
      placeholder: '#666666',
      gradient1: '#070707ff',
      gradient2: '#333333',
      gradient3: '#484848ff',
      Background1: '#000000',
    }
  },
  light: {
    name: 'Pure Light',
    colors: {
      primary: '#000000ff',
      secondary: '#000000ff',
      accent: '#000000ff',
      success: '#28A745',
      warning: '#FFC107',
      error: '#DC3545',
      background: '#FFFFFF',
      surface: '#ffffffff',
      text: '#212529',
      textSecondary: '#6C757D',
      border: '#DEE2E6',
      placeholder: '#ADB5BD',
      gradient1: '#c5c5c5ff',
      gradient2: '#E9ECEF',
      gradient3: '#DEE2E6',
      Background1: '#FFFFFF',
    }
  },
  purple: {
    name: 'Purple Dream',
    colors: {
      primary: '#6A0DAD',
      secondary: '#9370DB',
      accent: '#8A2BE2',
      success: '#32CD32',
      warning: '#FFA500',
      error: '#DC143C',
      background: '#000000d7',
      surface: '#191919ff',
      text: '#FFFFFF',
      textSecondary: '#B19CD9',
      border: '#4c008243',
      placeholder: '#97949d5c',
      gradient1: '#2E0249',
      gradient2: '#6A0DAD',
      gradient3: '#8A2BE2',
      Background1: '#000000',
    }
  },
  lightPurple: {
    name: 'Lavender Light',
    colors: {
      primary: '#6A0DAD',
      secondary: '#9370DB',
      accent: '#8A2BE2',
      success: '#28A745',
      warning: '#FFC107',
      error: '#DC3545',
      background: '#FAF7FF',
      surface: '#F3EBFF',
      text: '#2D1B69',
      textSecondary: '#6B46C1',
      border: '#D8B4FE',
      placeholder: '#A78BFA',
      gradient1: '#e4d8f9ff',
      gradient2: '#F3EBFF',
      gradient3: '#E9D5FF',
      Background1: '#FFFFFF',
    }
  },
  blue: {
    name: 'Ocean Blue',
    colors: {
      primary: '#0066CC',
      secondary: '#4DB6E6',
      accent: '#0099FF',
      success: '#32CD32',
      warning: '#FFA500',
      error: '#DC143C',
      background: '#001122d7',
      surface: '#112233ff',
      text: '#FFFFFF',
      textSecondary: '#87CEEB',
      border: '#003366',
      placeholder: '#a8a8a856',
      gradient1: '#001122',
      gradient2: '#0066CC',
      gradient3: '#0099FF',
      Background1: '#000011',
    }
  },

  lightBlue: {
    name: 'Sky Light',
    colors: {
      primary: '#0066CC',
      secondary: '#4DB6E6',
      accent: '#0099FF',
      success: '#28A745',
      warning: '#FFC107',
      error: '#DC3545',
      background: '#f6fbffff',
      surface: '#E6F3FF',
      text: '#1A365D',
      textSecondary: '#4A90A4',
      border: '#B8D4E3',
      placeholder: '#90A3B4',
      gradient1: '#dfeffdff',
      gradient2: '#E6F3FF',
      gradient3: '#CCE7FF',
      Background1: '#FFFFFF',
    }
  },
};

const CATEGORY_BASE = [
  { id: '1', name: 'Social', icon: 'logo-instagram' },
  { id: '2', name: 'Google', icon: 'logo-google' },
  { id: '3', name: 'Email', icon: 'mail' },
  { id: '4', name: 'Banking', icon: 'card' },
  { id: '5', name: 'Shopping', icon: 'bag-handle' },
  { id: '6', name: 'Entertainment', icon: 'musical-notes' },
  { id: '7', name: 'Health & Fitness', icon: 'fitness' },
  { id: '8', name: 'Travel', icon: 'airplane' },
  { id: '9', name: 'Work', icon: 'briefcase' },
  { id: '10', name: 'Other', icon: 'ellipsis-horizontal' },
];

export type ThemeType = keyof typeof THEMES;

interface ThemeContextType {
  currentTheme: ThemeType;
  colors: typeof THEMES.purple.colors;
  setTheme: (theme: ThemeType) => void;
  themes: typeof THEMES;
  categories: Array<{ id: string; name: string; icon: string; color: string }>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('purple');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('selectedTheme');
      if (savedTheme && THEMES[savedTheme as ThemeType]) {
        setCurrentTheme(savedTheme as ThemeType);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const setTheme = async (theme: ThemeType) => {
    try {
      await AsyncStorage.setItem('selectedTheme', theme);
      setCurrentTheme(theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const colors = THEMES[currentTheme].colors;
  const categories = CATEGORY_BASE.map(cat => ({ ...cat, color: colors.primary }));

  return (
    <ThemeContext.Provider value={{ currentTheme, colors, setTheme, themes: THEMES, categories }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export { ThemeContext };
