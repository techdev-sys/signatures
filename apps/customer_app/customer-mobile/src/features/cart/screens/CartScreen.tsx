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

import { useCart } from '../../../context/CartContext';
import type { RootStackParamList } from '../../../navigation/AppNavigator';
import { colors, radius, spacing } from '../../../theme/theme';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const DELIVERY_FEE = 2.5;

export function CartScreen() {
  const navigation = useNavigation<Navigation>();

  const {
    items,
    subtotal,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
  } = useCart();

  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Pressable
            style={styles.circleButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color={colors.text}
            />
          </Pressable>

          <Text style={styles.headerTitle}>Your cart</Text>

          <View style={styles.headerPlaceholder} />
        </View>

        {items.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="bag-outline"
                size={34}
                color={colors.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              Your cart is empty
            </Text>

            <Text style={styles.emptyDescription}>
              Add something delicious from Signatures to get started.
            </Text>

            <Pressable
              style={styles.browseButton}
              onPress={() => navigation.navigate('Restaurant')}
            >
              <Text style={styles.browseButtonText}>
                Browse menu
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.restaurantRow}>
                <View style={styles.restaurantIcon}>
                  <Ionicons
                    name="restaurant-outline"
                    size={19}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.restaurantText}>
                  <Text style={styles.restaurantLabel}>
                    YOUR ORDER FROM
                  </Text>

                  <Text style={styles.restaurantName}>
                    Signatures Restaurant
                  </Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>
                Items
              </Text>

              {items.map((item) => (
                <View
                  key={item.id}
                  style={styles.cartItem}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.itemImage}
                  />

                  <View style={styles.itemContent}>
                    <View style={styles.itemTop}>
                      <Text
                        style={styles.itemName}
                        numberOfLines={2}
                      >
                        {item.name}
                      </Text>

                      <Pressable
                        hitSlop={10}
                        onPress={() => removeItem(item.id)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={19}
                          color={colors.textSecondary}
                        />
                      </Pressable>
                    </View>

                    <Text style={styles.itemOptions}>
                      {item.size}
                      {item.extras.length > 0
                        ? ` • ${item.extras
                            .map((extra) => extra.name)
                            .join(', ')}`
                        : ''}
                    </Text>

                    <View style={styles.itemBottom}>
                      <Text style={styles.itemPrice}>
                        ${item.totalPrice.toFixed(2)}
                      </Text>

                      <View style={styles.quantityControl}>
                        <Pressable
                          style={styles.quantityButton}
                          onPress={() =>
                            decreaseQuantity(item.id)
                          }
                        >
                          <Ionicons
                            name="remove"
                            size={17}
                            color={colors.text}
                          />
                        </Pressable>

                        <Text style={styles.quantity}>
                          {item.quantity}
                        </Text>

                        <Pressable
                          style={styles.quantityButton}
                          onPress={() =>
                            increaseQuantity(item.id)
                          }
                        >
                          <Ionicons
                            name="add"
                            size={17}
                            color={colors.text}
                          />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </View>
              ))}

              <Pressable
                style={styles.addMore}
                onPress={() =>
                  navigation.navigate('Restaurant')
                }
              >
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color={colors.primary}
                />

                <Text style={styles.addMoreText}>
                  Add more items
                </Text>
              </Pressable>

              <Text style={styles.sectionTitle}>
                Order summary
              </Text>

              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    Subtotal
                  </Text>

                  <Text style={styles.summaryValue}>
                    ${subtotal.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    Delivery fee
                  </Text>

                  <Text style={styles.summaryValue}>
                    ${deliveryFee.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>
                    Total
                  </Text>

                  <Text style={styles.totalValue}>
                    ${total.toFixed(2)}
                  </Text>
                </View>
              </View>

              <View style={styles.bottomSpace} />
            </ScrollView>

            <SafeAreaView
              edges={['bottom']}
              style={styles.checkoutArea}
            >
              <Pressable
                style={styles.checkoutButton}
                onPress={() =>
                  navigation.navigate('Checkout')
                }
              >
                <View>
                  <Text style={styles.checkoutLabel}>
                    TOTAL
                  </Text>

                  <Text style={styles.checkoutPrice}>
                    ${total.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.checkoutAction}>
                  <Text style={styles.checkoutText}>
                    Checkout
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={19}
                    color="#FFFFFF"
                  />
                </View>
              </Pressable>
            </SafeAreaView>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  safeArea: {
    flex: 1,
  },

  header: {
    height: 64,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },

  headerPlaceholder: {
    width: 44,
  },

  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: 10,
  },

  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },

  restaurantIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF0EA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  restaurantText: {
    marginLeft: 12,
    flex: 1,
  },

  restaurantLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    color: colors.primary,
  },

  restaurantName: {
    marginTop: 3,
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },

  sectionTitle: {
    marginTop: 28,
    marginBottom: 13,
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },

  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 12,
  },

  itemImage: {
    width: 92,
    height: 100,
    borderRadius: radius.lg,
  },

  itemContent: {
    flex: 1,
    marginLeft: 13,
    justifyContent: 'space-between',
  },

  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },

  itemName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },

  itemOptions: {
    marginTop: 5,
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
  },

  itemBottom: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  itemPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },

  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  quantityButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantity: {
    minWidth: 18,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },

  addMore: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: radius.lg,
  },

  addMoreText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },

  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 7,
  },

  summaryLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },

  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },

  totalValue: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.primary,
  },

  bottomSpace: {
    height: 120,
  },

  checkoutArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: 12,
    backgroundColor: 'rgba(247,247,248,0.97)',
  },

  checkoutButton: {
    minHeight: 68,
    paddingHorizontal: 20,
    borderRadius: radius.xl,
    backgroundColor: colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  checkoutLabel: {
    color: '#A8A8AD',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },

  checkoutPrice: {
    marginTop: 2,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },

  checkoutAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  checkoutText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 35,
    paddingBottom: 70,
  },

  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF0EA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    marginTop: 20,
    fontSize: 21,
    fontWeight: '800',
    color: colors.text,
  },

  emptyDescription: {
    marginTop: 8,
    maxWidth: 290,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
  },

  browseButton: {
    marginTop: 22,
    minHeight: 48,
    paddingHorizontal: 25,
    borderRadius: radius.pill,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },

  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});