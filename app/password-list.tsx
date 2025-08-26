import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  ScrollView,
  Animated,
} from 'react-native';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { PasswordCard } from '../components/PasswordCard';
import { LoadingScreen } from '../components/LoadingScreen';
import { passwordService } from '../services/passwordService';
import { PasswordEntry } from '../types';
import { TYPOGRAPHY } from '../constants';

export default function PasswordList() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [filteredPasswords, setFilteredPasswords] = useState<PasswordEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [titleClickCount, setTitleClickCount] = useState(0);
  const [titleClickTimeout, setTitleClickTimeout] = useState<any>(null);
  const translateY = new Animated.Value(0);
  
  const { logout } = useAuth();
  const { colors, categories } = useTheme();
  const router = useRouter();

  const loadPasswords = useCallback(async () => {
    try {
      const userPasswords = await passwordService.getPasswords();
      setPasswords(userPasswords);
      setFilteredPasswords(userPasswords);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load passwords: ' + error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPasswords();
  }, [loadPasswords]);

  useEffect(() => {
    let filtered = passwords;
    
    if (searchQuery) {
      filtered = filtered.filter(password =>
        password.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        password.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        password.website?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(password => password.category === selectedCategory);
    }
    
    setFilteredPasswords(filtered);
  }, [passwords, searchQuery, selectedCategory]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadPasswords();
  };

  const handleAddPassword = () => {
    router.push('/add-password');
  };

  const handlePasswordPress = (passwordId: string) => {
    router.push(`/password-details?passwordId=${passwordId}`);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/auth');
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const handleTitleClick = () => {
    const newCount = titleClickCount + 1;
    setTitleClickCount(newCount);

    // Clear existing timeout
    if (titleClickTimeout) {
      clearTimeout(titleClickTimeout);
    }

    // If 4 clicks reached, open settings
    if (newCount >= 4) {
      setTitleClickCount(0);
      router.push('/settings');
      return;
    }

    // Reset count after 2 seconds of no clicks
    const timeout = setTimeout(() => {
      setTitleClickCount(0);
    }, 2000);
    setTitleClickTimeout(timeout);
  };

  const handleDirectLogout = async () => {
    try {
      await logout();
      router.replace('/auth');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const onPanGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: false }
  );

  const onPanHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationY, translationX } = event.nativeEvent;
      
      // Only trigger logout if it's primarily a vertical gesture
      if (translationY > 150 && Math.abs(translationX) < Math.abs(translationY)) {
        handleDirectLogout();
      }
      
      // Reset animation
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    }
  };

  const CategoryFilter = () => (
    <View style={{ marginBottom: 16 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScrollView}
        contentContainerStyle={styles.categoryContainer}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        directionalLockEnabled={true}
      >
        <TouchableOpacity
          style={[
            styles.categoryButton,
            { backgroundColor: !selectedCategory ? colors.primary : colors.surface },
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Ionicons
            name="apps"
            size={16}
            color={!selectedCategory ? colors.background : colors.textSecondary}
          />
          <Text style={[
            styles.categoryText,
            { color: !selectedCategory ? colors.background : colors.textSecondary },
          ]}>All
          </Text>
        </TouchableOpacity>
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              { backgroundColor: selectedCategory === category.id ? colors.primary : colors.surface },
            ]}
            onPress={() => setSelectedCategory(
              selectedCategory === category.id ? null : category.id
            )}>
            <Ionicons
              name={category.icon as any}
              size={16}
              color={selectedCategory === category.id ? colors.background : colors.textSecondary}
            />
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.categoryTextActive,
              { color: selectedCategory === category.id ? colors.background : colors.textSecondary }
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );


  if (loading) {
    return (
      <LoadingScreen message="Loading your passwords..." />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient colors={[colors.gradient1, colors.gradient2, colors.gradient3]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleTitleClick} activeOpacity={0.7}>
            <Text style={[styles.title, { color: colors.text }]}>My Passwords</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {filteredPasswords.length} {filteredPasswords.length === 1 ? 'password' : 'passwords'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <PanGestureHandler
          onGestureEvent={onPanGestureEvent}
          onHandlerStateChange={onPanHandlerStateChange}
          activeOffsetY={10}
          failOffsetX={[-20, 20]}
          shouldCancelWhenOutside={true}
        >
          <Animated.View 
            style={[
              styles.content,
              {
                backgroundColor: colors.background,
                transform: [{ 
                  translateY: translateY.interpolate({
                    inputRange: [0, 200],
                    outputRange: [0, 100],
                    extrapolate: 'clamp',
                  })
                }]
              }
            ]}
          >
            {/* Search */}
            <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
            <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search passwords..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textSecondary}
              underlineColorAndroid="transparent"
            />
            <TouchableOpacity 
              style={styles.refreshButton} 
              onPress={handleRefresh}
              disabled={refreshing}
            >
              <Ionicons 
                name="refresh" 
                size={20} 
                color={refreshing ? colors.textSecondary : colors.primary} 
                style={refreshing ? { transform: [{ rotate: '180deg' }] } : {}}
              />
            </TouchableOpacity>
          </View>

          {/* Category Filter */}
          <CategoryFilter />

          {/* Password List */}
          <FlatList
            data={filteredPasswords}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PasswordCard
                password={item}
                onPress={() => handlePasswordPress(item.id)}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="heart-outline" size={64} color={colors.textSecondary} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No passwords found</Text>
                <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                  {searchQuery || selectedCategory
                    ? 'Try adjusting your search or filter'
                    : 'Add your first password to get started'
                  }
                </Text>
              </View>
            }
          />

          {/* Add Button */}
          <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary }]} onPress={handleAddPassword}>
            <Ionicons name="add" size={28} color={colors.background} />
          </TouchableOpacity>
          </Animated.View>
        </PanGestureHandler>
      </SafeAreaView>
    </LinearGradient>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: 30, // Additional padding below status bar
  },
  content: {
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  title: {
    ...TYPOGRAPHY.h1,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 28,
    // subtle shadow for elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    ...TYPOGRAPHY.body1,
    flex: 1,
    height: 36,
    paddingVertical: 0,
  },
  refreshButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryScrollView: {
    flexGrow: 0,
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
  },
  categoryButtonActive: {
  },
  categoryText: {
    ...TYPOGRAPHY.caption,
    marginLeft: 4,
  },
  categoryTextActive: {
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h4,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body1,
    textAlign: 'center',
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
