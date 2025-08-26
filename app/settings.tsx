import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { TYPOGRAPHY } from '../constants';

export default function Settings() {
  const router = useRouter();
  const { colors } = useTheme();

  const handleBackPress = () => {
    router.back();
  };

  const handleThemeSelector = () => {
    router.push('/theme-selector');
  };

  const handleChangePin = () => {
    router.push('/change-pin');
  };

  const handleAbout = () => {
    router.push('/about');
  };


  const SettingsItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress 
  }: { 
    icon: string; 
    title: string; 
    subtitle?: string; 
    onPress?: () => void; 
  }) => {
    const scaleAnim = new Animated.Value(1);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity 
          style={[styles.settingsItem, { backgroundColor: colors.surface }]} 
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          <View style={styles.settingsItemLeft}>
            <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
              <Ionicons name={icon as any} size={20} color={colors.primary} />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.settingsTitle, { color: colors.text }]}>{title}</Text>
              {subtitle && <Text style={[styles.settingsSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <LinearGradient colors={[colors.gradient1, colors.gradient2]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
          <View style={styles.placeholder} />
        </View>





        <View style={[styles.content, { backgroundColor: colors.background }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Security</Text>
              <SettingsItem
                icon="key-outline"
                title="Change PIN"
                subtitle="Update your security PIN"
                onPress={handleChangePin}
              />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
              <SettingsItem
                icon="color-palette-outline"
                title="Theme Selector"
                subtitle="Choose how App should look"
                onPress={handleThemeSelector}
              />
              <SettingsItem
                icon="folder-open-outline"
                title="Change App Logo"
                subtitle="Choose a new logo for the app"
              />

              <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
              <SettingsItem
                icon="reader-outline"
                title="How is this secure?"
                subtitle="Learn how my app is secure"
                onPress={handleAbout}
              />
            </View>





            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                Made by Akhil Thirunalveli
              </Text>
            </View>
          </ScrollView>
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
    paddingTop: 20,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  settingsTitle: {
    ...TYPOGRAPHY.body1,
    fontWeight: '600',
  },
  settingsSubtitle: {
    ...TYPOGRAPHY.body2,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingBottom: 40,
  },
  footerText: {
    ...TYPOGRAPHY.caption,
    opacity: 0.7,
  },
});
