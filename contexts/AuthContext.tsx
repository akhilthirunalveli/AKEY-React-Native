import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  isPinSetup: boolean;
  loading: boolean;
  authenticate: () => Promise<boolean>;
  setupPin: (pin: string) => Promise<boolean>;
  verifyPin: (pin: string) => Promise<boolean>;
  updatePin: (currentPin: string, newPin: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isPinSetup: false,
  loading: true,
  authenticate: async () => false,
  setupPin: async () => false,
  verifyPin: async () => false,
  updatePin: async () => false,
  logout: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPinSetup, setIsPinSetup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const authenticated = await authService.isAuthenticated();
      const pinSetup = await authService.isPinSetup();
      
      setIsAuthenticated(authenticated);
      setIsPinSetup(pinSetup);
    } catch (error) {
      console.error('Failed to check auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const authenticate = async (): Promise<boolean> => {
    try {
      // Try biometric first if available
      const biometricSupported = await authService.isBiometricSupported();
      
      if (biometricSupported) {
        const result = await authService.authenticateWithBiometric();
        if (result.success) {
          setIsAuthenticated(true);
          return true;
        }
      }
      
      // If biometric fails or not available, user will need to use PIN
      return false;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  };

  const setupPin = async (pin: string): Promise<boolean> => {
    try {
      const success = await authService.setupPin(pin);
      if (success) {
        setIsPinSetup(true);
        setIsAuthenticated(true);
      }
      return success;
    } catch (error) {
      console.error('PIN setup failed:', error);
      return false;
    }
  };

  const verifyPin = async (pin: string): Promise<boolean> => {
    try {
      const success = await authService.verifyPin(pin);
      return success;
    } catch (error) {
      console.error('PIN verification failed:', error);
      return false;
    }
  };

  const updatePin = async (currentPin: string, newPin: string): Promise<boolean> => {
    try {
      const success = await authService.changePin(currentPin, newPin);
      return success;
    } catch (error) {
      console.error('PIN update failed:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isPinSetup,
      loading,
      authenticate,
      setupPin,
      verifyPin,
      updatePin,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
