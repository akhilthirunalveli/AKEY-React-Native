import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { TYPOGRAPHY } from '../constants';

interface LoadingScreenProps {
  message?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading...', 
  showBackButton = false,
  onBackPress 
}) => {
  const { colors } = useTheme();

  return (
    <LinearGradient colors={[colors.gradient1, colors.gradient2]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {showBackButton && onBackPress && (
          <View style={styles.header}>
            <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.content}>
          <ActivityIndicator 
            size="large" 
            color={colors.primary} 
            style={styles.spinner}
          />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            {message}
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    marginBottom: 20,
  },
  loadingText: {
    ...TYPOGRAPHY.body1,
    textAlign: 'center',
  },
});
