import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { TYPOGRAPHY } from '../constants';

export default function About() {
  const router = useRouter();
  const { colors } = useTheme();

  const handleBackPress = () => {
    router.back();
  };

  const InfoSection = ({ 
    icon, 
    title, 
    content 
  }: { 
    icon: string; 
    title: string; 
    content: string; 
  }) => (
    <View style={[styles.infoSection, { backgroundColor: colors.surface }]}>
      <View style={styles.infoHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
          <Ionicons name={icon as any} size={24} color={colors.primary} />
        </View>
        <Text style={[styles.infoTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <Text style={[styles.infoContent, { color: colors.textSecondary }]}>{content}</Text>
    </View>
  );

  return (
    <LinearGradient colors={[colors.gradient1, colors.gradient2]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>About</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={[styles.content, { backgroundColor: colors.background }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              {/* App Overview */}
              <View style={[styles.appOverview, { backgroundColor: colors.background }]}>
                <View style={[styles.appIcon, { backgroundColor: colors.primary }]}>
                  <Ionicons name="lock-closed" size={32} color={colors.surface} />
                </View>
                <Text style={[styles.appName, { color: colors.text }]}>
                  Akhil:Vault
                </Text>
                <Text style={[styles.appVersion, { color: colors.textSecondary }]}>
                  Version 1.0.0
                </Text>
                <Text style={[styles.appDescription, { color: colors.textSecondary }]}>
                  A secure and beautiful password manager to keep your digital life safe
                </Text>
              </View>

              {/* Security Information */}
              <InfoSection
                icon="shield-checkmark"
                title="Security & Privacy"
                content="Your passwords are encrypted using industry-standard AES-256 encryption before being stored. All data is secured with Firebase's enterprise-grade security infrastructure. We never store your master PIN in plain text - it's hashed using secure algorithms."
              />

              <InfoSection
                icon="cloud-outline"
                title="Firebase Integration"
                content="This app uses Google Firebase for secure cloud storage and authentication. Firebase provides automatic backups, real-time synchronization across devices, and world-class security measures including data encryption in transit and at rest."
              />

              <InfoSection
                icon="eye-off"
                title="Data Protection"
                content="Your sensitive information never leaves your device unencrypted. All passwords are encrypted locally before being sent to Firebase. We follow zero-knowledge principles - even we cannot see your passwords."
              />

              <InfoSection
                icon="sync"
                title="Sync & Backup"
                content="Your encrypted passwords are automatically synced across all your devices through Firebase Firestore. This ensures you always have access to your passwords while maintaining the highest security standards."
              />
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
  appOverview: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    ...TYPOGRAPHY.h1,
    marginBottom: 4,
  },
  appVersion: {
    ...TYPOGRAPHY.body2,
    marginBottom: 12,
  },
  appDescription: {
    ...TYPOGRAPHY.body2,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoSection: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoTitle: {
    ...TYPOGRAPHY.h4,
    fontWeight: '600',
    flex: 1,
  },
  infoContent: {
    ...TYPOGRAPHY.body2,
    lineHeight: 22,
  },
  developerSection: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  developerTitle: {
    ...TYPOGRAPHY.h4,
    marginBottom: 8,
  },
  developerName: {
    ...TYPOGRAPHY.h3,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  developerDescription: {
    ...TYPOGRAPHY.body2,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingBottom: 40,
  },
  footerText: {
    ...TYPOGRAPHY.caption,
    fontStyle: 'italic',
    opacity: 0.8,
    textAlign: 'center',
  },
});
