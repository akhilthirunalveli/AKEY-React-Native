import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, THEMES, ThemeType } from '../contexts/ThemeContext';
import { TYPOGRAPHY } from '../constants';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export default function ThemeSelector() {
  const router = useRouter();
  const { currentTheme, setTheme, colors } = useTheme();

  const handleBackPress = () => {
    router.back();
  };

  const handleThemeSelect = (themeKey: ThemeType) => {
    setTheme(themeKey);
  };

  const ThemeCard = ({ themeKey, theme }: { themeKey: ThemeType; theme: typeof THEMES.purple }) => {
    const isSelected = currentTheme === themeKey;
    
    return (
      <TouchableOpacity
        style={[styles.themeCard, { width: cardWidth }]}
        onPress={() => handleThemeSelect(themeKey)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[theme.colors.gradient1, theme.colors.gradient2, theme.colors.gradient3]}
          style={[
            styles.themePreview,
            isSelected && { borderWidth: 2, borderColor: colors.primary }
          ]}
        >
          
          <View style={[styles.miniHeader, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.miniIcon, { backgroundColor: theme.colors.primary }]} />
            <View style={[styles.miniText, { backgroundColor: theme.colors.text }]} />
          </View>
          
          <View style={[styles.miniCard, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.miniCircle, { backgroundColor: theme.colors.accent }]} />
            <View>
              <View style={[styles.miniLine, { backgroundColor: theme.colors.text }]} />
              <View style={[styles.miniLineSmall, { backgroundColor: theme.colors.textSecondary }]} />
            </View>
          </View>
        </LinearGradient>
        
        <Text style={[styles.themeName, { color: colors.text }]}>{theme.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={[colors.gradient1, colors.gradient2]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Choose Theme</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={[styles.content, { backgroundColor: colors.background }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Select a theme to personalize your app experience
            </Text>
            
            <View style={styles.themesGrid}>
              {Object.entries(THEMES).map(([key, theme]) => (
                <ThemeCard
                  key={key}
                  themeKey={key as ThemeType}
                  theme={theme}
                />
              ))}
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  subtitle: {
    ...TYPOGRAPHY.body1,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  themeCard: {
    marginBottom: 16,
  },
  themePreview: {
    height: 120,
    borderRadius: 16,
    padding: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 4,
  },
  miniHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 8,
    marginBottom: 8,
  },
  miniIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  miniText: {
    width: 40,
    height: 8,
    borderRadius: 4,
  },
  miniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    flex: 1,
  },
  miniCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  miniLine: {
    width: 50,
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  miniLineSmall: {
    width: 30,
    height: 4,
    borderRadius: 2,
  },
  themeName: {
    ...TYPOGRAPHY.body1,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
});
