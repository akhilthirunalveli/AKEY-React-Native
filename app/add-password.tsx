import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';
import { useTheme } from '../contexts/ThemeContext';
import { passwordService } from '../services/passwordService';
import { PasswordEntry } from '../types';
import { TYPOGRAPHY } from '../constants';
import { generatePassword, calculatePasswordStrength } from '../utils/helpers';

export default function AddPassword() {
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [website, setWebsite] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('1'); // Default to first category
  const [loading, setLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPasswordGenerator, setShowPasswordGenerator] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    username?: string;
    password?: string;
  }>({});

  // Password generator states
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);

  const router = useRouter();
  const { colors, categories } = useTheme();
  const params = useLocalSearchParams();
  const passwordId = params.passwordId as string;
  const isEditing = !!passwordId;

  useEffect(() => {
    if (isEditing) {
      loadPassword();
    }
  }, [isEditing, passwordId]);

  const loadPassword = async () => {
    try {
      setLoading(true);
      const passwords = await passwordService.getPasswords();
      const passwordEntry = passwords.find(p => p.id === passwordId);
      
      if (passwordEntry) {
        setTitle(passwordEntry.title);
        setUsername(passwordEntry.username);
        setPassword(passwordEntry.password);
        setWebsite(passwordEntry.website || '');
        setNotes(passwordEntry.notes || '');
        setCategory(passwordEntry.category);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load password');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!username.trim()) {
      newErrors.username = 'Username/Email is required';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const passwordEntry: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'> = {
        title: title.trim(),
        username: username.trim(),
        password,
        website: website.trim(),
        category,
        notes: notes.trim(),
        userId: 'current-user', // This will be set by the service
      };

      if (isEditing) {
        await passwordService.updatePassword(passwordId, passwordEntry);
        Alert.alert('Success', 'Password updated successfully');
      } else {
        await passwordService.addPassword(passwordEntry);
        Alert.alert('Success', 'Password saved successfully');
      }
      
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save password');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePassword = (len: number, upper: boolean, lower: boolean, numbers: boolean, symbols: boolean) => {
    const generated = generatePassword(len, upper, lower, numbers, symbols);
    setPassword(generated);
    setShowPasswordGenerator(false);
  };

  const renderCategoryModal = () => (
    <Modal
      visible={showCategoryModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowCategoryModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.Background1 }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Category</Text>
            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  { 
                    backgroundColor: category === item.id ? `${colors.primary}15` : 'transparent',
                  }
                ]}
                onPress={() => {
                  setCategory(item.id);
                  setShowCategoryModal(false);
                }}
              >
                <View style={[styles.categoryIconContainer, { backgroundColor: `${item.color}20` }]}>
                  <Ionicons name={item.icon as any} size={20} color={item.color} />
                </View>
                <Text style={[styles.categoryName, { color: colors.text }]}>{item.name}</Text>
                {category === item.id && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  const renderPasswordGeneratorModal = () => (
    <Modal
      visible={showPasswordGenerator}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowPasswordGenerator(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.Background1 }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Generate Password</Text>
            <TouchableOpacity onPress={() => setShowPasswordGenerator(false)}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View style={styles.generatorContent}>
              <Text style={[styles.lengthLabel, { color: colors.text }]}>Length: {length}</Text>
              <View style={styles.lengthControls}>
                <TouchableOpacity
                  style={[styles.lengthButton, { backgroundColor: colors.secondary }]}
                  onPress={() => setLength(Math.max(4, length - 1))}
                >
                  <Ionicons name="remove" size={16} color="white"/>
                </TouchableOpacity>
                <Text style={[styles.lengthValue, { color: colors.text }]}>{length}</Text>
                <TouchableOpacity
                  style={[styles.lengthButton, { backgroundColor: colors.secondary }]}
                  onPress={() => setLength(Math.min(50, length + 1))}
                >
                  <Ionicons name="add" size={16} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => setIncludeUppercase(!includeUppercase)}
                >
                  <View style={[styles.checkbox, { backgroundColor: includeUppercase ? colors.secondary : colors.border }]}>
                    {includeUppercase && <Ionicons name="checkmark" size={14} color="white" />}
                  </View>
                  <Text style={[styles.optionText, { color: colors.text }]}>Uppercase Letters (A-Z)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => setIncludeLowercase(!includeLowercase)}
                >
                  <View style={[styles.checkbox, { backgroundColor: includeLowercase ? colors.secondary : colors.border }]}>
                    {includeLowercase && <Ionicons name="checkmark" size={14} color="white" />}
                  </View>
                  <Text style={[styles.optionText, { color: colors.text }]}>Lowercase Letters (a-z)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => setIncludeNumbers(!includeNumbers)}
                >
                  <View style={[styles.checkbox, { backgroundColor: includeNumbers ? colors.secondary : colors.border }]}>
                    {includeNumbers && <Ionicons name="checkmark" size={14} color="white" />}
                  </View>
                  <Text style={[styles.optionText, { color: colors.text }]}>Numbers (0-9)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => setIncludeSymbols(!includeSymbols)}
                >
                  <View style={[styles.checkbox, { backgroundColor: includeSymbols ? colors.secondary : colors.border }]}>
                    {includeSymbols && <Ionicons name="checkmark" size={14} color="white" />}
                  </View>
                  <Text style={[styles.optionText, { color: colors.text }]}>Symbols (!@#$%^&*)</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.generateButtonContainer}>
              <TouchableOpacity
                style={[styles.modernGenerateButton, { backgroundColor: colors.surface }]}
                onPress={() => handleGeneratePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols)}
              >
                <View style={styles.generateButtonContent}>
                  <Ionicons name="flash" size={20} color="white" />
                  <Text style={[styles.generateButtonText, { color: colors.text }]}>Generate Password</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const getStrengthColor = (level: string) => {
    switch (level) {
      case 'Very Weak': return colors.error;
      case 'Weak': return '#FF9500';
      case 'Fair': return '#FFCC00';
      case 'Good': return '#007AFF';
      case 'Strong': return colors.success;
      default: return colors.textSecondary;
    }
  };

  return (
    <LinearGradient colors={[colors.gradient1, colors.gradient2]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>
            {isEditing ? 'Edit Password' : 'Add Password'}
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <View style={[styles.content, { backgroundColor: colors.background }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Form Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Password Details</Text>
              
              {/* Form Fields as Settings Items */}
              <View style={[styles.formCard]}>
                <View style={styles.formRow}>
                  <Text style={[styles.fieldLabel, { color: colors.text }]}>Title</Text>
                  <InputField
                    value={title}
                    onChangeText={setTitle}
                    placeholder="e.g., Gmail Account"
                    error={errors.title}
                    style={styles.inputField}
                  />
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <View style={styles.formRow}>
                  <Text style={[styles.fieldLabel, { color: colors.text }]}>Username/Email</Text>
                  <InputField
                    value={username}
                    onChangeText={setUsername}
                    placeholder="your.email@example.com"
                    error={errors.username}
                    autoCapitalize="none"
                    style={styles.inputField}
                  />
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <View style={styles.formRow}>
                  <Text style={[styles.fieldLabel, { color: colors.text }]}>Password</Text>
                  <View style={styles.passwordRow}>
                    <InputField
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter password"
                      secureTextEntry
                      error={errors.password}
                      style={{...styles.inputField, flex: 1}}
                    />
                    <TouchableOpacity
                      style={[styles.generateButton, { backgroundColor: colors.surface }]}
                      onPress={() => setShowPasswordGenerator(true)}
                    >
                      <Ionicons name="refresh" size={16} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                  {password ? (
                    <View style={styles.strengthContainer}>
                      <Text style={[styles.strengthText, { color: getStrengthColor(calculatePasswordStrength(password).level) }]}>
                        Strength: {calculatePasswordStrength(password).level}
                      </Text>
                    </View>
                  ) : null}
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <View style={styles.formRow}>
                  <Text style={[styles.fieldLabel, { color: colors.text }]}>Website (Optional)</Text>
                  <InputField
                    value={website}
                    onChangeText={setWebsite}
                    placeholder="https://example.com"
                    autoCapitalize="none"
                    style={styles.inputField}
                  />
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <TouchableOpacity
                  style={styles.formRow}
                  onPress={() => setShowCategoryModal(true)}
                >
                  <Text style={[styles.fieldLabel, { color: colors.text }]}>Category</Text>
                  <View style={styles.categorySelector}>
                    <View style={[styles.categoryIcon, { backgroundColor: `${categories.find(c => c.id === category)?.color}20` }]}>
                      <Ionicons 
                        name={categories.find(c => c.id === category)?.icon as any} 
                        size={16} 
                        color={categories.find(c => c.id === category)?.color} 
                      />
                    </View>
                    <Text style={[styles.categoryText, { color: colors.text }]}>
                      {categories.find(c => c.id === category)?.name}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                  </View>
                </TouchableOpacity>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <View style={styles.formRow}>
                  <Text style={[styles.fieldLabel, { color: colors.text }]}>Notes (Optional)</Text>
                  <InputField
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Additional notes..."
                    multiline
                    numberOfLines={3}
                    style={{...styles.inputField, minHeight: 80}}
                  />
                </View>
              </View>
            </View>

            {/* Save Button */}
            <View style={styles.buttonContainer}>
              <Button
                title={isEditing ? 'Update Password' : 'Save Password'}
                onPress={handleSave}
                loading={loading}
                disabled={!title.trim() || !username.trim() || !password.trim()}
              />
            </View>
          </ScrollView>
        </View>

        {/* Category Modal */}
        {renderCategoryModal()}

        {/* Password Generator Modal */}
        {renderPasswordGeneratorModal()}
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
  formCard: {
    borderRadius: 12,

  },
  formRow: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  fieldLabel: {
    ...TYPOGRAPHY.body1,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputField: {
    marginBottom: 0,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    opacity: 0.3,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  generateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  strengthContainer: {
    marginTop: 8,
  },
  strengthText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '500',
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    ...TYPOGRAPHY.body1,
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 0,
    maxHeight: '80%',
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 0,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryName: {
    ...TYPOGRAPHY.body1,
    flex: 1,
  },
  generatorContent: {
    padding: 20,
  },
  lengthLabel: {
    ...TYPOGRAPHY.body1,
    fontWeight: '600',
    marginBottom: 12,
  },
  lengthControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 16,
  },
  lengthButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lengthValue: {
    ...TYPOGRAPHY.h3,
    minWidth: 40,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    ...TYPOGRAPHY.body1,
    flex: 1,
  },
  generateButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34,
  },
  modernGenerateButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  generateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  generateButtonText: {
    ...TYPOGRAPHY.body1,
    fontWeight: '600',
  },
});
