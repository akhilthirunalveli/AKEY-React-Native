import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { COLORS, TYPOGRAPHY } from '../constants';

export default function Authentication() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    checkBiometricAvailability();
    tryBiometricAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/password-list');
    }
  }, [isAuthenticated]);

  const checkBiometricAvailability = async () => {
    const available = await authService.isBiometricSupported();
    setBiometricAvailable(available);
  };

  const tryBiometricAuth = async () => {
    const available = await authService.isBiometricSupported();
    if (available) {
      const result = await authService.authenticateWithBiometric();
      if (result.success) {
        router.replace('/password-list');
      }
    }
  };

  const handleNumberPress = (number: string) => {
    if (pin.length < 4) {
      const newPin = pin + number;
      setPin(newPin);
      
      if (newPin.length === 4) {
        handlePinComplete(newPin);
      }
    }
  };

  const handlePinComplete = async (enteredPin: string) => {
    setLoading(true);
    try {
      const isValid = await authService.verifyPin(enteredPin);
      if (isValid) {
        router.replace('/password-list');
      } else {
        Alert.alert('Incorrect PIN', 'Please try again!');
        setPin('');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleBiometricAuth = async () => {
    const result = await authService.authenticateWithBiometric();
    if (result.success) {
      router.replace('/password-list');
    } else if (result.error) {
      Alert.alert('Authentication Failed', result.error);
    }
  };

  const renderPinDots = () => {
    return (
      <View style={styles.pinContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.pinDot,
              pin.length > index && styles.pinDotFilled,
            ]}
          />
        ))}
      </View>
    );
  };

  const renderNumberPad = () => {
    const numbers = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      [biometricAvailable ? 'biometric' : '', '0', 'backspace'],
    ];

    return (
      <View style={styles.numberPad}>
        {numbers.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.numberRow}>
            {row.map((item, itemIndex) => {
              if (item === '') {
                return <View key={itemIndex} style={styles.numberButton} />;
              }
              
              if (item === 'backspace') {
                return (
                  <TouchableOpacity
                    key={itemIndex}
                    style={styles.numberButton}
                    onPress={handleBackspace}
                  >
                    <Ionicons name="backspace" size={28} color={COLORS.text} />
                  </TouchableOpacity>
                );
              }

              if (item === 'biometric') {
                return (
                  <TouchableOpacity
                    key={itemIndex}
                    style={styles.numberButton}
                    onPress={handleBiometricAuth}
                  >
                    <Ionicons name="finger-print" size={28} color={COLORS.text} />
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={itemIndex}
                  style={styles.numberButton}
                  onPress={() => handleNumberPress(item)}
                  disabled={loading}
                >
                  <Text style={styles.numberText}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Enter your PIN or use {biometricAvailable ? 'biometric' : 'PIN'} to unlock
            </Text>
          </View>

          {/* PIN Display */}
          <View style={styles.pinSection}>
            {renderPinDots()}
          </View>

          {/* Number Pad */}
          {renderNumberPad()}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff', // Black background
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pinSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    marginHorizontal: 12,
    borderWidth: 1,
  },
  pinDotFilled: {
    backgroundColor: COLORS.primary,
  },
  numberPad: {
    alignItems: 'center',
  },
  numberRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  numberButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#000000', // Dark gray button
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    elevation: 5,
  },
  numberText: {
    ...TYPOGRAPHY.numberPad,
    color: '#FFFFFF', // White text for contrast
  }
});
