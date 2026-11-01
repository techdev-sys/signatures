import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../../../navigation/AppNavigator';
import { colors, radius, spacing } from '../../../theme/theme';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const menu = [
  {
    id: '1',
    name: 'Grilled Chicken',
    description: 'Tender grilled chicken with seasonal vegetables.',
    price: '$8.50',
    rating: '4.8',
    image:
      'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '2',
    name: 'Classic Burger',
    description: 'Beef patty, cheese, lettuce and our signature sauce.',
    price: '$6.50',
    rating: '4.7',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '3',
    name: 'Pepperoni Pizza',
    description: 'Mozzarella, pepperoni and rich tomato sauce.',
    price: '$10.00',
    rating: '4.9',
    image:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80',
  },
];

export function RestaurantScreen() {
  const navigation = useNavigation<Navigation>();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.hero}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80',
            }}
            style={styles.heroImage}
          />

          <SafeAreaView style={styles.heroControls} edges={['top']}>
            <Pressable
              style={styles.circleButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={21} color={colors.text} />
            </Pressable>

            <View style={styles.heroRight}>
              <Pressable style={styles.circleButton}>
                <Ionicons
                  name="heart-outline"
                  size={21}
                  color={colors.text}
                />
              </Pressable>

              <Pressable
                style={styles.circleButton}
                onPress={() => navigation.navigate('Cart')}
              >
                <Ionicons
                  name="bag-outline"
                  size={21}
                  color={colors.text}
                />
              </Pressable>
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.restaurantInfo}>
          <View style={styles.titleRow}>
            <View style={styles.titleContent}>
              <Text style={styles.title}>Signatures Restaurant</Text>
              <Text style={styles.category}>Grill • Burgers • Pizza</Text>
            </View>

            <View style={styles.rating}>
              <Ionicons name="star" size={15} color={colors.primary} />
              <Text style={styles.ratingText}>4.8</Text>
            </View>
          </View>

          <View style={styles.deliveryInfo}>
            <View style={styles.infoItem}>
              <Ionicons
                name="time-outline"
                size={17}
                color={colors.textSecondary}
              />
              <Text style={styles.infoText}>20–30 min</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons
                name="bicycle-outline"
                size={18}
                color={colors.textSecondary}
              />
              <Text style={styles.infoText}>Delivery</Text>
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {['Popular', 'Chicken', 'Burgers', 'Pizza', 'Drinks'].map(
            (category, index) => (
              <Pressable
                key={category}
                style={[
                  styles.categoryChip,
                  index === 0 && styles.categoryChipActive,
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
            ),
          )}
        </ScrollView>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Popular dishes</Text>

          {menu.map((item) => (
            <Pressable
              key={item.id}
              style={styles.menuCard}
              onPress={() =>
                navigation.navigate('FoodDetails', {
                  name: item.name,
                  price: item.price,
                  image: item.image,
                })
              }
            >
              <View style={styles.menuInfo}>
                <Text style={styles.menuName}>{item.name}</Text>

                <Text style={styles.menuDescription} numberOfLines={2}>
                  {item.description}
                </Text>

                <View style={styles.menuBottom}>
                  <Text style={styles.menuPrice}>{item.price}</Text>

                  <View style={styles.smallRating}>
                    <Ionicons name="star" size={13} color={colors.primary} />
                    <Text style={styles.smallRatingText}>{item.rating}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.menuImageWrapper}>
                <Image source={{ uri: item.image }} style={styles.menuImage} />

                <View style={styles.addButton}>
                  <Ionicons name="add" size={22} color="#FFFFFF" />
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingBottom: 40,
  },

  hero: {
    height: 250,
    position: 'relative',
  },

  heroImage: {
    width: '100%',
    height: '100%',
  },

  heroControls: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  heroRight: {
    flexDirection: 'row',
    gap: 10,
  },

  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  restaurantInfo: {
    padding: spacing.xl,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
  },

  titleContent: {
    flex: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },

  category: {
    marginTop: 5,
    fontSize: 13,
    color: colors.textSecondary,
  },

  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },

  ratingText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },

  deliveryInfo: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 18,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  infoText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  categories: {
    gap: 8,
    paddingHorizontal: spacing.xl,
    paddingBottom: 8,
  },

  categoryChip: {
    minHeight: 42,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  categoryChipActive: {
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

  menuSection: {
    paddingHorizontal: spacing.xl,
    marginTop: 22,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 14,
  },

  menuCard: {
    minHeight: 132,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    padding: 12,
  },

  menuInfo: {
    flex: 1,
    padding: 4,
    paddingRight: 12,
  },

  menuName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },

  menuDescription: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
  },

  menuBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },

  menuPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },

  smallRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  smallRatingText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },

  menuImageWrapper: {
    width: 112,
    height: 108,
    position: 'relative',
  },

  menuImage: {
    width: '100%',
    height: '100%',
    borderRadius: radius.lg,
  },

  addButton: {
    position: 'absolute',
    right: 7,
    bottom: 7,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});