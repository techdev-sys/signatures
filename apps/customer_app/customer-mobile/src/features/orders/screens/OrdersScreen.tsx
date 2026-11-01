import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useOrders } from '../../../context/OrderContext';
import type { RootStackParamList } from '../../../navigation/AppNavigator';
import type { Order, OrderStatus } from '../../../types/order';
import { colors, radius, spacing } from '../../../theme/theme';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

function getStatusLabel(status: OrderStatus) {
  switch (status) {
    case 'confirmed':
      return 'Order confirmed';
    case 'preparing':
      return 'Preparing';
    case 'ready':
      return 'Ready';
    case 'awaiting_driver':
      return 'Finding driver';
    case 'driver_assigned':
      return 'Driver assigned';
    case 'heading_to_restaurant':
      return 'Heading to restaurant';
    case 'arrived_at_restaurant':
      return 'At restaurant';
    case 'picked_up':
      return 'Picked up';
    case 'on_the_way':
      return 'On the way';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Order received';
  }
}

function getStatusIcon(status: OrderStatus) {
  switch (status) {
    case 'confirmed':
      return 'checkmark-circle-outline' as const;
    case 'preparing':
      return 'restaurant-outline' as const;
    case 'ready':
      return 'bag-check-outline' as const;
    case 'awaiting_driver':
      return 'search-outline' as const;
    case 'driver_assigned':
      return 'person-outline' as const;
    case 'heading_to_restaurant':
      return 'navigate-outline' as const;
    case 'arrived_at_restaurant':
      return 'restaurant-outline' as const;
    case 'picked_up':
      return 'bag-check-outline' as const;
    case 'on_the_way':
      return 'bicycle-outline' as const;
    case 'delivered':
      return 'checkmark-done-circle-outline' as const;
    case 'cancelled':
      return 'close-circle-outline' as const;
    default:
      return 'receipt-outline' as const;
  }
}

function OrderCard({
  order,
  onPress,
}: {
  order: Order;
  onPress: () => void;
}) {
  const previewImage = order.items[0]?.image;

  return (
    <Pressable
      style={styles.orderCard}
      onPress={onPress}
    >
      <View style={styles.orderTop}>
        <View style={styles.restaurantBlock}>
          <View style={styles.restaurantIcon}>
            <Ionicons
              name="restaurant-outline"
              size={20}
              color={colors.primary}
            />
          </View>

          <View style={styles.restaurantText}>
            <Text
              style={styles.restaurantName}
              numberOfLines={1}
            >
              {order.restaurantName}
            </Text>

            <Text style={styles.orderNumber}>
              {order.id}
            </Text>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textSecondary}
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.orderBody}>
        {previewImage ? (
          <Image
            source={{ uri: previewImage }}
            style={styles.previewImage}
          />
        ) : (
          <View style={styles.previewFallback}>
            <Ionicons
              name="fast-food-outline"
              size={24}
              color={colors.primary}
            />
          </View>
        )}

        <View style={styles.orderDetails}>
          <Text
            style={styles.itemsText}
            numberOfLines={2}
          >
            {order.items
              .map(
                (item) =>
                  `${item.quantity}× ${item.name}`,
              )
              .join(', ')}
          </Text>

          <Text style={styles.orderMeta}>
            {order.itemCount}{' '}
            {order.itemCount === 1
              ? 'item'
              : 'items'}{' '}
            • ${order.total.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.statusRow}>
        <View style={styles.statusLeft}>
          <View style={styles.statusIcon}>
            <Ionicons
              name={getStatusIcon(order.status)}
              size={17}
              color={colors.primary}
            />
          </View>

          <View>
            <Text style={styles.statusLabel}>
              {getStatusLabel(order.status)}
            </Text>

            {order.status !== 'delivered' &&
              order.status !== 'cancelled' && (
                <Text style={styles.statusHint}>
                  Estimated 20–30 min
                </Text>
              )}
          </View>
        </View>

        {order.status !== 'delivered' &&
          order.status !== 'cancelled' && (
            <Text style={styles.trackText}>
              Track
            </Text>
          )}
      </View>
    </Pressable>
  );
}

export function OrdersScreen() {
  const navigation = useNavigation<Navigation>();
  const {
    orders,
    loading,
    loadError,
  } = useOrders();

  const activeOrders = orders.filter(
    (order) =>
      order.status !== 'delivered' &&
      order.status !== 'cancelled',
  );

  const pastOrders = orders.filter(
    (order) =>
      order.status === 'delivered' ||
      order.status === 'cancelled',
  );

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>
              SIGNATURES
            </Text>

            <Text style={styles.title}>
              Your orders
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="receipt-outline"
              size={23}
              color={colors.text}
            />
          </View>
        </View>

        {loading ? (
          <View style={styles.empty}>
            <ActivityIndicator
              size="large"
              color={colors.primary}
            />

            <Text style={styles.emptyTitle}>
              Loading your orders...
            </Text>
          </View>
        ) : loadError && orders.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="cloud-offline-outline"
                size={34}
                color={colors.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              Orders unavailable
            </Text>

            <Text style={styles.emptyDescription}>
              {loadError}
            </Text>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="receipt-outline"
                size={34}
                color={colors.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              No orders yet
            </Text>

            <Text style={styles.emptyDescription}>
              Once you place an order, you&apos;ll
              be able to follow its progress here.
            </Text>

            <Pressable
              style={styles.orderFoodButton}
              onPress={() =>
                navigation.navigate('Restaurant')
              }
            >
              <Text
                style={styles.orderFoodButtonText}
              >
                Order something
              </Text>

              <Ionicons
                name="arrow-forward"
                size={18}
                color="#FFFFFF"
              />
            </Pressable>
          </View>
        ) : (
          <>
            {activeOrders.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    Active orders
                  </Text>

                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>
                      {activeOrders.length}
                    </Text>
                  </View>
                </View>

                {activeOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onPress={() =>
                      navigation.navigate(
                        'OrderTracking',
                        {
                          orderId: order.id,
                        },
                      )
                    }
                  />
                ))}
              </View>
            )}

            {pastOrders.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Order history
                </Text>

                {pastOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onPress={() =>
                      navigation.navigate(
                        'OrderTracking',
                        {
                          orderId: order.id,
                        },
                      )
                    }
                  />
                ))}
              </View>
            )}

            <View style={styles.bottomSpace} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 110,
  },

  header: {
    paddingTop: 16,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: colors.primary,
  },

  title: {
    marginTop: 5,
    fontSize: 29,
    fontWeight: '800',
    color: colors.text,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  section: {
    marginTop: 16,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 13,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 13,
  },

  activeBadge: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 7,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  activeBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    marginBottom: 14,
  },

  orderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  restaurantBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
    flex: 1,
    marginLeft: 11,
  },

  restaurantName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },

  orderNumber: {
    marginTop: 3,
    fontSize: 10,
    color: colors.textSecondary,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },

  orderBody: {
    flexDirection: 'row',
  },

  previewImage: {
    width: 74,
    height: 74,
    borderRadius: radius.lg,
  },

  previewFallback: {
    width: 74,
    height: 74,
    borderRadius: radius.lg,
    backgroundColor: '#FFF0EA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  orderDetails: {
    flex: 1,
    marginLeft: 13,
    justifyContent: 'center',
  },

  itemsText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
    color: colors.text,
  },

  orderMeta: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },

  statusRow: {
    marginTop: 15,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF0EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  statusLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },

  statusHint: {
    marginTop: 2,
    fontSize: 10,
    color: colors.textSecondary,
  },

  trackText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },

  empty: {
    minHeight: 520,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFF0EA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    marginTop: 21,
    fontSize: 21,
    fontWeight: '800',
    color: colors.text,
  },

  emptyDescription: {
    marginTop: 8,
    maxWidth: 280,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
  },

  orderFoodButton: {
    minHeight: 52,
    marginTop: 23,
    paddingHorizontal: 22,
    borderRadius: radius.pill,
    backgroundColor: colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  orderFoodButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  bottomSpace: {
    height: 20,
  },
});
