import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { TYPOGRAPHY } from '../constants';

function ChangePin() {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'current' | 'new' | 'confirm'>('current');
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));

  const router = useRouter();
  const { colors } = useTheme();
  const { verifyPin, updatePin } = useAuth();

  const animateStepTransition = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 20,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const handleNumberPress = (number: string) => {
    if (step === 'current') {
      if (currentPin.length < 4) {
        setCurrentPin(prev => prev + number);
      }
    } else if (step === 'new') {
      if (newPin.length < 4) {
        setNewPin(prev => prev + number);
      }
    } else if (step === 'confirm') {
      if (confirmPin.length < 4) {
        setConfirmPin(prev => prev + number);
      }
    }
  };

  const handleBackspace = () => {
    if (step === 'current') {
      setCurrentPin(prev => prev.slice(0, -1));
    } else if (step === 'new') {
      setNewPin(prev => prev.slice(0, -1));
    } else if (step === 'confirm') {
      setConfirmPin(prev => prev.slice(0, -1));
    }
  };

  const handleContinue = async () => {
    if (step === 'current') {
      if (currentPin.length !== 4) {
        Alert.alert('Error', 'Please enter your current 4-digit PIN');
        return;
      }

      setLoading(true);
      try {
        const isValid = await verifyPin(currentPin);
        if (isValid) {
          animateStepTransition();
          setTimeout(() => setStep('new'), 150);
        } else {
          Alert.alert('Error', 'Current PIN is incorrect');
          setCurrentPin('');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to verify PIN');
        setCurrentPin('');
      } finally {
        setLoading(false);
      }
    } else if (step === 'new') {
      if (newPin.length !== 4) {
        Alert.alert('Error', 'Please enter a new 4-digit PIN');
        return;
      }

      if (newPin === currentPin) {
        Alert.alert('Error', 'New PIN must be different from current PIN');
        setNewPin('');
        return;
      }

      animateStepTransition();
      setTimeout(() => setStep('confirm'), 150);
    } else if (step === 'confirm') {
      if (confirmPin.length !== 4) {
        Alert.alert('Error', 'Please confirm your new 4-digit PIN');
        return;
      }

      if (newPin !== confirmPin) {
        Alert.alert('Error', 'PINs do not match. Please try again.');
        setConfirmPin('');
        return;
      }

      setLoading(true);
      try {
        await updatePin(currentPin, newPin);
        Alert.alert(
          'Success',
          'Your PIN has been changed successfully',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } catch (error) {
        Alert.alert('Error', 'Failed to update PIN');
      } finally {
        setLoading(false);
      }
    }
  };

  const getCurrentPin = () => {
    if (step === 'current') return currentPin;
    if (step === 'new') return newPin;
    return confirmPin;
  };

  const getTitle = () => {
    if (step === 'current') return 'Enter Current PIN';
    if (step === 'new') return 'Enter New PIN';
    return 'Confirm New PIN';
  };

  const getSubtitle = () => {
    if (step === 'current') return 'Please enter your current 4-digit PIN';
    if (step === 'new') return 'Choose a new 4-digit PIN';
    return 'Re-enter your new PIN to confirm';
  };

  const canContinue = () => {
    if (step === 'current') return currentPin.length === 4;
    if (step === 'new') return newPin.length === 4;
    return confirmPin.length === 4;
  };

  const PinDisplay = () => (
    <View style={styles.pinContainer}>
      {[0, 1, 2, 3].map((index) => (
        <View
          key={index}
          style={[
            styles.pinDot,
            {
              backgroundColor: getCurrentPin().length > index ? colors.primary : colors.border,
              borderColor: colors.border,
            },
          ]}
        />
      ))}
    </View>
  );

  const NumberPad = () => (
    <View style={styles.numberPad}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
        <TouchableOpacity
          key={number}
          style={[styles.numberButton, { backgroundColor: colors.surface }]}
          onPress={() => handleNumberPress(number.toString())}
        >
          <Text style={[styles.numberText, { color: colors.text }]}>{number}</Text>
        </TouchableOpacity>
      ))}
      <View style={styles.numberButton} />
      <TouchableOpacity
        style={[styles.numberButton, { backgroundColor: colors.surface }]}
        onPress={() => handleNumberPress('0')}
      >
        <Text style={[styles.numberText, { color: colors.text }]}>0</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.numberButton, { backgroundColor: colors.surface }]}
        onPress={handleBackspace}
      >
        <Ionicons name="backspace" size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={[colors.gradient1, colors.gradient2]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Change PIN</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <View style={[styles.content, { backgroundColor: colors.background }]}>
          {/* PIN Setup Content */}
          <View style={styles.pinSetupContainer}>
            <Animated.View 
              style={[
                styles.titleContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={[styles.pinTitle, { color: colors.text }]}>{getTitle()}</Text>
              <Text style={[styles.pinSubtitle, { color: colors.textSecondary }]}>{getSubtitle()}</Text>
            </Animated.View>

            <PinDisplay />
            <NumberPad />

            {/* Continue Button */}
            <TouchableOpacity
              style={[
                styles.continueButton,
                {
                  backgroundColor: canContinue() ? colors.background : colors.border,
                  opacity: canContinue() ? 1 : 0.5,
                },
              ]}
              onPress={handleContinue}
              disabled={!canContinue() || loading}
            >
              <Text style={[styles.continueButtonText, { color: canContinue() ? colors.text : colors.textSecondary }]}>
                {step === 'confirm' ? 'Change PIN' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    ...TYPOGRAPHY.h2,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 40,
  },
  pinSetupContainer: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  pinTitle: {
    ...TYPOGRAPHY.h2,
    textAlign: 'center',
    marginBottom: 8,
  },
  pinSubtitle: {
    ...TYPOGRAPHY.body1,
    textAlign: 'center',
    lineHeight: 24,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
    gap: 20,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 20,
  },
  numberButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    ...TYPOGRAPHY.h3,
    fontWeight: '600',
  },
  continueButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonText: {
    ...TYPOGRAPHY.body1,
    fontWeight: '600',
  },
});

export default ChangePin;
