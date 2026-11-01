import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius, spacing, typography } from '../../../theme/theme';
import type { RootStackParamList } from '../../../navigation/AppNavigator';

const categories = [
  { id: 'food', label: 'Food', icon: 'fast-food-outline' },
  { id: 'grocery', label: 'Grocery', icon: 'basket-outline' },
  { id: 'pizza', label: 'Pizza', icon: 'pizza-outline' },
  { id: 'drinks', label: 'Drinks', icon: 'cafe-outline' },
] as const;

const popularItems = [
  {
    id: '1',
    name: 'Grilled Chicken',
    restaurant: 'Signatures',
    rating: '4.8',
    time: '20–30 min',
    price: '$8.50',
    image:
      'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '2',
    name: 'Classic Burger',
    restaurant: 'Signatures',
    rating: '4.7',
    time: '15–25 min',
    price: '$6.50',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '3',
    name: 'Pepperoni Pizza',
    restaurant: 'Signatures',
    rating: '4.9',
    time: '25–35 min',
    price: '$10.00',
    image:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80',
  },
];

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Navigation>();
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.deliveryLabel}>DELIVER TO</Text>

              <Pressable style={styles.locationRow}>
                <Text style={styles.location}>Select your location</Text>
                <Ionicons
                  name="chevron-down"
                  size={16}
                  color={colors.primary}
                />
              </Pressable>
            </View>

            <Pressable style={styles.notificationButton}>
              <Ionicons
                name="notifications-outline"
                size={23}
                color={colors.text}
              />

              <View style={styles.notificationDot} />
            </Pressable>
          </View>

          {/* Hero */}
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>
              What&apos;s your{'\n'}
              <Text style={styles.heroAccent}>craving</Text> today?
            </Text>
          </View>

          {/* Search */}
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Ionicons
                name="search-outline"
                size={21}
                color={colors.textSecondary}
              />

              <TextInput
                placeholder="Search food, restaurants..."
                placeholderTextColor={colors.textSecondary}
                style={styles.searchInput}
              />
            </View>

            <Pressable style={styles.filterButton}>
              <Ionicons name="options-outline" size={23} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* Categories */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <Pressable>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categories}
          >
            {categories.map((category, index) => {
              const active = index === 0;

              return (
                <Pressable
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    active && styles.categoryChipActive,
                  ]}
                >
                  <View
                    style={[
                      styles.categoryIcon,
                      active && styles.categoryIconActive,
                    ]}
                  >
                    <Ionicons
                      name={category.icon}
                      size={19}
                      color={active ? '#FFFFFF' : colors.text}
                    />
                  </View>

                  <Text
                    style={[
                      styles.categoryText,
                      active && styles.categoryTextActive,
                    ]}
                  >
                    {category.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Popular */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular near you</Text>

            <Pressable>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.foodList}
          >
            {popularItems.map((item) => (
              <Pressable key={item.id} style={styles.foodCard}>
                <View style={styles.foodImageContainer}>
                  <Image source={{ uri: item.image }} style={styles.foodImage} />

                  <Pressable style={styles.favoriteButton}>
                    <Ionicons
                      name="heart-outline"
                      size={19}
                      color={colors.text}
                    />
                  </Pressable>

                  <View style={styles.timeBadge}>
                    <Ionicons
                      name="time-outline"
                      size={13}
                      color={colors.text}
                    />
                    <Text style={styles.timeBadgeText}>{item.time}</Text>
                  </View>
                </View>

                <View style={styles.foodInfo}>
                  <Text style={styles.foodName} numberOfLines={1}>
                    {item.name}
                  </Text>

                  <Text style={styles.restaurantName}>{item.restaurant}</Text>

                  <View style={styles.foodBottomRow}>
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={15} color={colors.primary} />
                      <Text style={styles.rating}>{item.rating}</Text>
                    </View>

                    <Text style={styles.price}>{item.price}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          {/* Restaurant */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Restaurants near you</Text>

            <Pressable>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.restaurantCard}
            onPress={() => navigation.navigate('Restaurant')}
          >
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80',
              }}
              style={styles.restaurantImage}
            />

            <View style={styles.restaurantContent}>
              <View style={styles.restaurantTopRow}>
                <View style={styles.restaurantTitleContainer}>
                  <Text style={styles.restaurantTitle}>
                    Signatures Restaurant
                  </Text>
                  <Text style={styles.restaurantCategory}>
                    Grill • Burgers • Pizza
                  </Text>
                </View>

                <Pressable>
                  <Ionicons
                    name="heart-outline"
                    size={21}
                    color={colors.text}
                  />
                </Pressable>
              </View>

              <View style={styles.restaurantMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="star" size={15} color={colors.primary} />
                  <Text style={styles.metaText}>4.8</Text>
                </View>

                <View style={styles.metaDot} />

                <View style={styles.metaItem}>
                  <Ionicons
                    name="time-outline"
                    size={15}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.metaText}>20–30 min</Text>
                </View>

                <View style={styles.metaDot} />

                <Text style={styles.deliveryText}>Delivery</Text>
              </View>
            </View>
          </Pressable>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  deliveryLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.3,
    color: colors.primary,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },

  location: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },

  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  notificationDot: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
    top: 10,
    right: 11,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },

  hero: {
    marginTop: 30,
    marginBottom: 22,
  },

  heroTitle: {
    ...typography.hero,
    fontSize: 32,
    lineHeight: 38,
    color: colors.text,
  },

  heroAccent: {
    color: colors.primary,
  },

  searchRow: {
    flexDirection: 'row',
    gap: 10,
  },

  searchBox: {
    flex: 1,
    height: 54,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: colors.text,
    fontSize: 14,
  },

  filterButton: {
    width: 54,
    height: 54,
    borderRadius: radius.lg,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 14,
  },

  sectionTitle: {
    ...typography.title,
    color: colors.text,
  },

  seeAll: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },

  categories: {
    gap: 10,
    paddingRight: spacing.xl,
  },

  categoryChip: {
    height: 46,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingRight: 15,
  },

  categoryChipActive: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },

  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
  },

  categoryIconActive: {
    backgroundColor: colors.primary,
  },

  categoryText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },

  categoryTextActive: {
    color: '#FFFFFF',
  },

  foodList: {
    gap: 14,
    paddingRight: spacing.xl,
  },

  foodCard: {
    width: 220,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },

  foodImageContainer: {
    height: 145,
    position: 'relative',
  },

  foodImage: {
    width: '100%',
    height: '100%',
  },

  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  timeBadge: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  timeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },

  foodInfo: {
    padding: 14,
  },

  foodName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },

  restaurantName: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSecondary,
  },

  foodBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  rating: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },

  price: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },

  restaurantCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },

  restaurantImage: {
    width: '100%',
    height: 170,
  },

  restaurantContent: {
    padding: 16,
  },

  restaurantTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  restaurantTitleContainer: {
    flex: 1,
  },

  restaurantTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },

  restaurantCategory: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },

  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 8,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  metaText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#B8B8BC',
  },

  deliveryText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },

  bottomSpacer: {
    height: 120,
  },






});



