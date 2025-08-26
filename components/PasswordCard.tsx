import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PasswordEntry } from '../types';
import { TYPOGRAPHY } from '../constants';
import { useTheme } from '../contexts/ThemeContext';
import { formatDate } from '../utils/helpers';
import * as Clipboard from 'expo-clipboard';

interface PasswordCardProps {
  password: PasswordEntry;
  onPress: () => void;
}

export const PasswordCard: React.FC<PasswordCardProps> = ({ password, onPress }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { colors, categories } = useTheme();
  const category = categories.find(cat => cat.id === password.category) || categories[6];

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.surface }]} onPress={onPress}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
          <Ionicons name={category.icon as any} size={20} color={colors.surface} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{password.title}</Text>
          <Text style={[styles.username, { color: colors.textSecondary }]} numberOfLines={1}>{password.username}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      {password.website && (
        <Text style={[styles.website, { color: colors.primary }]} numberOfLines={1}>{password.website}</Text>
      )}

      {/* Password row: masked by default, eye toggle and copy button */}
      <View style={styles.passwordRow}>
        <View style={styles.passwordLeft}>
          <Text style={[styles.passwordLabel, { color: colors.textSecondary }]}>Password</Text>
          <View style={[styles.passwordContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.passwordText, { color: colors.text }]} numberOfLines={1}>
              {passwordVisible ? password.password : '••••••••••••'}
            </Text>
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Ionicons
                name={passwordVisible ? 'eye-off' : 'eye'}
                size={16}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.copyButton}
          onPress={async () => {
            await Clipboard.setStringAsync(password.password);
            Alert.alert('Copied', 'Password copied to clipboard');
          }}
        >
          <Ionicons name="copy-outline" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>
  
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.body1,
    fontFamily: TYPOGRAPHY.button.fontFamily, // Use semibold for titles
    marginBottom: 2,
  },
  username: {
    ...TYPOGRAPHY.body2,
  },
  moreButton: {
    padding: 4,
  },
  website: {
    ...TYPOGRAPHY.body2,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    ...TYPOGRAPHY.caption,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  date: {
    ...TYPOGRAPHY.caption,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  passwordLeft: {
    flex: 1,
  },
  passwordLabel: {
    ...TYPOGRAPHY.caption,
    marginBottom: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordText: {
    ...TYPOGRAPHY.body2,
    fontWeight: '500',
    marginRight: 8,
  },
  eyeButton: {
    padding: 4,
  },
  copyButton: {
    padding: 8,
    marginLeft: 12,
  },
});
