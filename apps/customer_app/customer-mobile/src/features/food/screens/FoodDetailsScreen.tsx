import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { useState } from 'react';
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
import { useCart } from '../../../context/CartContext';

type Props = NativeStackScreenProps<RootStackParamList, 'FoodDetails'>;
type Navigation = NativeStackNavigationProp<RootStackParamList>;

const sizes = ['Small', 'Medium', 'Large'];

const extras = [
  { id: 'fries', name: 'French fries', price: 2 },
  { id: 'salad', name: 'Fresh salad', price: 1.5 },
  { id: 'drink', name: 'Soft drink', price: 1 },
];

const sizePrices: Record<string, number> = {
  Small: 0,
  Medium: 1.5,
  Large: 3,
};

export function FoodDetailsScreen() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<Props['route']>();

  const { name, price, image } = route.params;
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState('Small');
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const basePrice = Number(price.replace('$', ''));
  const extrasTotal = extras
    .filter((extra) => selectedExtras.includes(extra.id))
    .reduce((total, extra) => total + extra.price, 0);
  const unitPrice = basePrice + sizePrices[selectedSize] + extrasTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    const selectedExtraItems = extras.filter((extra) =>
      selectedExtras.includes(extra.id),
    );

    addItem({
      id: `${name}-${selectedSize}-${selectedExtras.slice().sort().join('-')}`,
      foodId: name,
      name,
      image,
      basePrice,
      size: selectedSize,
      sizePrice: sizePrices[selectedSize],
      extras: selectedExtraItems,
      quantity,
      unitPrice,
      totalPrice,
    });
    navigation.navigate('Cart');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.hero}>
          <Image source={{ uri: image }} style={styles.heroImage} />

          <SafeAreaView style={styles.heroControls} edges={['top']}>
            <Pressable
              style={styles.circleButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={21} color={colors.text} />
            </Pressable>

            <Pressable style={styles.circleButton}>
              <Ionicons
                name="heart-outline"
                size={22}
                color={colors.text}
              />
            </Pressable>
          </SafeAreaView>
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.price}>{price}</Text>
          </View>

          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Ionicons name="star" size={15} color={colors.primary} />
              <Text style={styles.metaText}>4.8</Text>
            </View>

            <View style={styles.dot} />

            <View style={styles.metaItem}>
              <Ionicons
                name="time-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.metaText}>20â€“30 min</Text>
            </View>

            <View style={styles.dot} />

            <Text style={styles.delivery}>Delivery</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Choose your size</Text>

          <View style={styles.sizeRow}>
            {sizes.map((size) => {
              const selected = selectedSize === size;

              return (
                <Pressable
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  style={[
                    styles.sizeButton,
                    selected && styles.sizeButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      selected && styles.sizeTextSelected,
                    ]}
                  >
                    {size}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>Description</Text>

          <Text style={styles.description}>
            Tender, flavourful and prepared fresh when you order. A Signatures
            favourite made with quality ingredients and served just the way you
            like it.
          </Text>

          <Text style={styles.sectionTitle}>Add extras</Text>

          {extras.map((extra) => {
            const selected = selectedExtras.includes(extra.id);

            return (
              <Pressable
                key={extra.id}
                style={styles.extraRow}
                onPress={() =>
                  setSelectedExtras((current) =>
                    selected
                      ? current.filter((id) => id !== extra.id)
                      : [...current, extra.id],
                  )
                }
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
              >
                <View style={styles.extraLeft}>
                  <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                    {selected && <Ionicons name="checkmark" size={15} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.extraName}>{extra.name}</Text>
                </View>

                <Text style={styles.extraPrice}>+${extra.price.toFixed(2)}</Text>
              </Pressable>
            );
          })}

          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitleNoMargin}>Quantity</Text>

            <View style={styles.quantityControl}>
              <Pressable
                style={styles.quantityButton}
                onPress={() => setQuantity((value) => Math.max(1, value - 1))}
              >
                <Ionicons name="remove" size={19} color={colors.text} />
              </Pressable>

              <Text style={styles.quantity}>{quantity}</Text>

              <Pressable
                style={styles.quantityButton}
                onPress={() => setQuantity((value) => value + 1)}
              >
                <Ionicons name="add" size={19} color={colors.text} />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      <SafeAreaView style={styles.checkoutArea} edges={['bottom']}>
        <Pressable
          style={styles.cartButton}
          onPress={handleAddToCart}
        >
          <View>
            <Text style={styles.cartSmall}>ADD TO CART</Text>
            <Text style={styles.cartPrice}>${totalPrice.toFixed(2)}</Text>
          </View>

          <View style={styles.cartAction}>
            <Text style={styles.cartActionText}>Add</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </View>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingBottom: 20,
  },

  hero: {
    height: 330,
    position: 'relative',
    backgroundColor: colors.surfaceSecondary,
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

  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  body: {
    padding: spacing.xl,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 14,
  },

  title: {
    flex: 1,
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '800',
    color: colors.text,
  },

  price: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },

  meta: {
    marginTop: 13,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  metaText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },

  delivery: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },

  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#B7B7BB',
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 24,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    marginTop: 26,
    marginBottom: 13,
  },

  sectionTitleNoMargin: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },

  sizeRow: {
    flexDirection: 'row',
    gap: 8,
  },

  sizeButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sizeButtonSelected: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },

  sizeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },

  sizeTextSelected: {
    color: '#FFFFFF',
  },

  description: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },

  extraRow: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  extraLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  extraName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },

  extraPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },

  quantitySection: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantity: {
    minWidth: 22,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },

  bottomSpace: {
    height: 110,
  },

  checkoutArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: 'rgba(247,247,248,0.96)',
  },

  cartButton: {
    minHeight: 68,
    backgroundColor: colors.black,
    borderRadius: radius.xl,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cartSmall: {
    color: '#A8A8AD',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },

  cartPrice: {
    marginTop: 2,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },

  cartAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  cartActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});


