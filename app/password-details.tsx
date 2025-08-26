import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Button } from '../components/Button';
import { LoadingScreen } from '../components/LoadingScreen';
import { useTheme } from '../contexts/ThemeContext';
import { passwordService } from '../services/passwordService';
import { PasswordEntry } from '../types';
import { TYPOGRAPHY } from '../constants';
import { formatDate } from '../utils/helpers';

export default function PasswordDetails() {
  const [password, setPassword] = useState<PasswordEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [copiedField, setCopiedField] = useState<string>('');
  const fadeAnim = new Animated.Value(0);
  
  const router = useRouter();
  const { colors, categories } = useTheme();
  const params = useLocalSearchParams();
  const passwordId = params.passwordId as string;

  useEffect(() => {
    loadPassword();
  }, [passwordId]);

  const loadPassword = async () => {
    try {
      const passwordData = await passwordService.getPassword(passwordId);
      setPassword(passwordData);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load password: ' + error.message);
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/add-password?passwordId=${passwordId}`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Password',
      'Are you sure you want to delete this password? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      await passwordService.deletePassword(passwordId);
      Alert.alert('Success', 'Password deleted successfully');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    setCopiedField(label);
    
    // Show success feedback
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setCopiedField(''));
  };

  const sharePassword = async () => {
    if (!password) return;
    
    try {
      await Share.share({
        message: `${password.title}\nUsername: ${password.username}\nWebsite: ${password.website || 'N/A'}`,
        title: 'Password Details',
      });
    } catch (error: any) {
      Alert.alert('Error', 'Failed to share password details');
    }
  };

  const DetailItem = ({ 
    icon, 
    title, 
    value, 
    subtitle,
    onPress,
    copyable = false,
    isPassword = false,
    isFirst = false,
    isLast = false
  }: { 
    icon: string; 
    title: string; 
    value: string;
    subtitle?: string;
    onPress?: () => void; 
    copyable?: boolean;
    isPassword?: boolean;
    isFirst?: boolean;
    isLast?: boolean;
  }) => (
    <TouchableOpacity 
      style={[
        styles.detailItem, 
        isFirst && styles.detailItemFirst,
        isLast && styles.detailItemLast,
        (onPress || copyable) ? {} : { opacity: 1 }
      ]} 
      onPress={onPress}
      disabled={!onPress && !copyable}
    >
      <View style={styles.detailItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
          <Ionicons name={icon as any} size={20} color={colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.detailTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.detailValue, { color: colors.textSecondary }]} numberOfLines={1}>
            {isPassword && !passwordVisible ? '••••••••••••••••' : value}
          </Text>
          {subtitle && <Text style={[styles.detailSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.detailItemRight}>
        {isPassword && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.background }]}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
        {copyable && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.background }]}
            onPress={() => copyToClipboard(value, title)}
          >
            <Ionicons name="copy-outline" size={16} color={colors.primary} />
          </TouchableOpacity>
        )}
        {onPress && <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <LoadingScreen 
        message="Loading password details..."
        showBackButton={true}
        onBackPress={() => router.back()}
      />
    );
  }

  if (!password) {
    return (
      <LinearGradient colors={[colors.gradient1, colors.gradient2]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>Not Found</Text>
            <View style={styles.placeholder} />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const category = categories.find(cat => cat.id === password.category) || categories[6];

  return (
    <LinearGradient colors={[colors.gradient1, colors.gradient2]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Password Details</Text>
          <TouchableOpacity onPress={sharePassword} style={styles.backButton}>
            <Ionicons name="share-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={[styles.content, { backgroundColor: colors.background }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Password Info Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Password Information</Text>
              
              <View style={[styles.passwordCard, { backgroundColor: colors.surface }]}>
                <DetailItem
                  icon="document-text"
                  title="Title"
                  value={password.title}
                  copyable={true}
                  isFirst={true}
                />
                
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                
                <DetailItem
                  icon="person"
                  title="Username/Email"
                  value={password.username}
                  copyable={true}
                />
                
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                
                <DetailItem
                  icon="key"
                  title="Password"
                  value={password.password}
                  copyable={true}
                  isPassword={true}
                />
                
                {password.website && (
                  <>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <DetailItem
                      icon="globe"
                      title="Website"
                      value={password.website}
                      copyable={true}
                    />
                  </>
                )}
                
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                
                <DetailItem
                  icon={category.icon}
                  title="Category"
                  value={category.name}
                  subtitle={`Organized under ${category.name}`}
                  isLast={true}
                />
              </View>
            </View>

            {/* Notes Section */}
            {password.notes && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Notes</Text>
                
                <View style={[styles.notesCard, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.notesText, { color: colors.textSecondary }]}>
                    {password.notes}
                  </Text>
                </View>
              </View>
            )}
            {/* Actions Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Actions</Text>
              
              <View style={[styles.passwordCard, { backgroundColor: colors.surface }]}>
                <DetailItem
                  icon="create"
                  title="Edit Password"
                  value="Modify this password entry"
                  onPress={handleEdit}
                  isFirst={true}
                />
                
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                
                <DetailItem
                  icon="trash"
                  title="Delete Password"
                  value="Remove this password"
                  onPress={handleDelete}
                  isLast={true}
                />
              </View>
            </View>
            {/* Information Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Information</Text>
              
              <View style={[styles.passwordCard, { backgroundColor: colors.surface }]}>
                <DetailItem
                  icon="calendar"
                  title="Created"
                  value={formatDate(password.createdAt)}
                  isFirst={true}
                />
                
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                
                <DetailItem
                  icon="time"
                  title="Last Updated"
                  value={formatDate(password.updatedAt)}
                  isLast={true}
                />
              </View>
            </View>

            {/* Bottom Spacing */}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </View>

        {/* Copy Feedback */}
        {copiedField && (
          <Animated.View 
            style={[
              styles.copyFeedback, 
              { 
                backgroundColor: colors.primary,
                opacity: fadeAnim 
              }
            ]}
          >
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text style={styles.copyFeedbackText}>{copiedField} copied!</Text>
          </Animated.View>
        )}
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
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  detailItemFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  detailItemLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  passwordCard: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    opacity: 0.3,
  },
  detailItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  detailTitle: {
    ...TYPOGRAPHY.body1,
    fontWeight: '600',
  },
  detailValue: {
    ...TYPOGRAPHY.body2,
    marginTop: 2,
  },
  detailSubtitle: {
    ...TYPOGRAPHY.caption,
    marginTop: 2,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notesCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  notesText: {
    ...TYPOGRAPHY.body1,
    lineHeight: 22,
  },
  bottomSpacing: {
    height: 40,
  },
  copyFeedback: {
    position: 'absolute',
    bottom: 100,
    left: '50%',
    transform: [{ translateX: -75 }],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  copyFeedbackText: {
    color: 'white',
    fontWeight: '600',
    ...TYPOGRAPHY.body2,
  },
});
