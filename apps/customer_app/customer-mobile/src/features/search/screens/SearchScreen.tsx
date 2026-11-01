import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius, spacing } from '../../../theme/theme';

const categories = ['All', 'Burgers', 'Pizza', 'Chicken', 'Drinks'];

export function SearchScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.eyebrow}>DISCOVER</Text>
        <Text style={styles.title}>Find your next meal</Text>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons
              name="search-outline"
              size={21}
              color={colors.textSecondary}
            />

            <TextInput
              style={styles.input}
              placeholder="Search food, restaurants..."
              placeholderTextColor={colors.textSecondary}
              returnKeyType="search"
            />
          </View>

          <Pressable style={styles.filterButton}>
            <Ionicons name="options-outline" size={23} color="#FFFFFF" />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {categories.map((category, index) => (
            <Pressable
              key={category}
              style={[
                styles.category,
                index === 0 && styles.categoryActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  index === 0 && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="restaurant-outline"
              size={30}
              color={colors.primary}
            />
          </View>

          <Text style={styles.emptyTitle}>
            What are you craving?
          </Text>

          <Text style={styles.emptyDescription}>
            Search for meals, restaurants or categories and we&apos;ll help
            you find something delicious.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 120,
  },

  eyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
  },

  title: {
    color: colors.text,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    marginTop: 7,
  },

  searchRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 26,
  },

  searchBox: {
    flex: 1,
    height: 54,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: colors.text,
  },

  filterButton: {
    width: 54,
    height: 54,
    borderRadius: radius.lg,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },

  categories: {
    gap: 8,
    paddingTop: 20,
    paddingRight: spacing.xl,
  },

  category: {
    minHeight: 42,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  categoryActive: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },

  categoryText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },

  categoryTextActive: {
    color: '#FFFFFF',
  },

  emptyState: {
    flex: 1,
    minHeight: 350,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF0EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },

  emptyDescription: {
    marginTop: 8,
    maxWidth: 290,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});