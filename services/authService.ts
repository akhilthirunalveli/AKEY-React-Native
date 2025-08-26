import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const PIN_KEY = 'user_pin';
const AUTH_STATE_KEY = 'is_authenticated';

export const authService = {
  // Check if device supports biometric authentication
  isBiometricSupported: async (): Promise<boolean> => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      return compatible && enrolled;
    } catch (error) {
      return false;
    }
  },

  // Get available authentication types
  getAvailableAuthTypes: async (): Promise<LocalAuthentication.AuthenticationType[]> => {
    try {
      return await LocalAuthentication.supportedAuthenticationTypesAsync();
    } catch (error) {
      return [];
    }
  },

  // Set up PIN for first time
  setupPin: async (pin: string): Promise<boolean> => {
    try {
      await SecureStore.setItemAsync(PIN_KEY, pin);
      await SecureStore.setItemAsync(AUTH_STATE_KEY, 'true');
      return true;
    } catch (error) {
      console.error('Failed to setup PIN:', error);
      return false;
    }
  },

  // Check if PIN is already set up
  isPinSetup: async (): Promise<boolean> => {
    try {
      const pin = await SecureStore.getItemAsync(PIN_KEY);
      return pin !== null;
    } catch (error) {
      return false;
    }
  },

  // Verify PIN
  verifyPin: async (enteredPin: string): Promise<boolean> => {
    try {
      const storedPin = await SecureStore.getItemAsync(PIN_KEY);
      if (storedPin === enteredPin) {
        await SecureStore.setItemAsync(AUTH_STATE_KEY, 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to verify PIN:', error);
      return false;
    }
  },

  // Authenticate using biometrics
  authenticateWithBiometric: async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock your password vault',
        fallbackLabel: 'Use PIN instead',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        await SecureStore.setItemAsync(AUTH_STATE_KEY, 'true');
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Authentication failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Check if user is currently authenticated
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const authState = await SecureStore.getItemAsync(AUTH_STATE_KEY);
      return authState === 'true';
    } catch (error) {
      return false;
    }
  },

  // Logout (clear authentication state)
  logout: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(AUTH_STATE_KEY);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  },

  // Change PIN
  changePin: async (currentPin: string, newPin: string): Promise<boolean> => {
    try {
      const isCurrentPinValid = await authService.verifyPin(currentPin);
      if (isCurrentPinValid) {
        await SecureStore.setItemAsync(PIN_KEY, newPin);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to change PIN:', error);
      return false;
    }
  },

  // Reset PIN (use with caution)
  resetPin: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(PIN_KEY);
      await SecureStore.deleteItemAsync(AUTH_STATE_KEY);
    } catch (error) {
      console.error('Failed to reset PIN:', error);
    }
  },
};
