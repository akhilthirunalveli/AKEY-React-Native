import React, { useState } from 'react';
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
import { COLORS, TYPOGRAPHY } from '../constants';

export default function PinSetup() {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [loading, setLoading] = useState(false);
  
  const { setupPin } = useAuth();
  const router = useRouter();

  const handleNumberPress = (number: string) => {
    if (step === 'enter') {
      if (pin.length < 4) {
        setPin(pin + number);
      }
      if (pin.length === 3) {
        // Move to confirm step after 4 digits
        setTimeout(() => setStep('confirm'), 100);
      }
    } else {
      if (confirmPin.length < 4) {
        setConfirmPin(confirmPin + number);
      }
      if (confirmPin.length === 3) {
        // Check if PINs match after 4 digits
        setTimeout(() => handlePinComplete(confirmPin + number), 100);
      }
    }
  };

  const handlePinComplete = async (finalConfirmPin: string) => {
    if (pin !== finalConfirmPin) {
      Alert.alert('Error', 'PINs don\'t match. Please try again.', [
        { text: 'OK', onPress: resetPin }
      ]);
      return;
    }

    setLoading(true);
    try {
      const success = await setupPin(pin);
      if (success) {
        Alert.alert(
          'Success!', 
          'Your PIN has been set successfully! Welcome to your password vault!',
          [
            {
              text: 'Start Using App',
              onPress: () => router.replace('/password-list')
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to set up PIN. Please try again.');
        resetPin();
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      resetPin();
    } finally {
      setLoading(false);
    }
  };

  const resetPin = () => {
    setPin('');
    setConfirmPin('');
    setStep('enter');
  };

  const handleBackspace = () => {
    if (step === 'enter') {
      setPin(pin.slice(0, -1));
    } else {
      if (confirmPin.length === 0) {
        setStep('enter');
      } else {
        setConfirmPin(confirmPin.slice(0, -1));
      }
    }
  };

  const renderPinDots = (currentPin: string) => {
    return (
      <View style={styles.pinContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.pinDot,
              currentPin.length > index && styles.pinDotFilled,
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
      ['', '0', 'backspace'],
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
                    <Ionicons name="backspace" size={28} color={COLORS.primary} />
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
            <Text style={styles.title}>
              {step === 'enter' ? 'Set Your PIN' : 'Confirm Your PIN'}
            </Text>
            <Text style={styles.subtitle}>
              {step === 'enter' 
                ? 'Create a 4-digit PIN to secure your passwords'
                : 'Enter your PIN again to confirm'
              }
            </Text>
          </View>

          {/* PIN Display */}
          <View style={styles.pinSection}>
            {renderPinDots(step === 'enter' ? pin : confirmPin)}
          </View>

          {/* Number Pad */}
          {renderNumberPad()}

          {/* Reset Button */}
          {(pin.length > 0 || confirmPin.length > 0) && (
            <TouchableOpacity style={styles.resetButton} onPress={resetPin}>
              <Text style={styles.resetText}>Start Over</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Black background
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
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
    borderWidth: 2,
    // borderColor: COLORS.primary,
  },
  pinDotFilled: {
    backgroundColor: COLORS.primary,
  },
  numberPad: {
    alignItems: 'center',
  },
  numberRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  numberButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#000000ff', // Dark gray button
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  numberText: {
    ...TYPOGRAPHY.numberPad,
    color: '#ffffffff', // White text for contrast
  },
  resetButton: {
    alignSelf: 'center',
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  resetText: {
    ...TYPOGRAPHY.button,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
