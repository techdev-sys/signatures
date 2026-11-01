import { Ionicons } from '@expo/vector-icons';
import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  AppState,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useOrders } from '../../../context/OrderContext';
import type { RootStackParamList } from '../../../navigation/AppNavigator';
import type { OrderStatus } from '../../../types/order';
import { colors, radius, spacing } from '../../../theme/theme';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'OrderTracking'
>;

type Navigation =
  NativeStackNavigationProp<RootStackParamList>;

type TimelineStatus = Exclude<
  OrderStatus,
  'cancelled'
>;

const timeline: {
  status: TimelineStatus;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    status: 'confirmed',
    title: 'Order confirmed',
    description:
      'Signatures has received your order.',
    icon: 'checkmark',
  },
  {
    status: 'preparing',
    title: 'Preparing your food',
    description:
      'The kitchen is preparing your order.',
    icon: 'restaurant-outline',
  },
  {
    status: 'ready',
    title: 'Ready',
    description:
      'Your food is packed and ready.',
    icon: 'bag-check-outline',
  },
  {
    status: 'awaiting_driver',
    title: 'Finding a driver',
    description:
      'We are finding a nearby driver for you.',
    icon: 'search-outline',
  },
  {
    status: 'driver_assigned',
    title: 'Driver assigned',
    description:
      'A driver has been assigned to your delivery.',
    icon: 'person-outline',
  },
  {
    status: 'heading_to_restaurant',
    title: 'Heading to restaurant',
    description:
      'Your driver is travelling to Signatures.',
    icon: 'navigate-outline',
  },
  {
    status: 'arrived_at_restaurant',
    title: 'At the restaurant',
    description:
      'Your driver has arrived to collect the order.',
    icon: 'restaurant-outline',
  },
  {
    status: 'picked_up',
    title: 'Picked up',
    description:
      'Your driver has collected your order.',
    icon: 'bag-check-outline',
  },
  {
    status: 'on_the_way',
    title: 'On the way',
    description:
      'Your driver is heading to your address.',
    icon: 'bicycle-outline',
  },
  {
    status: 'delivered',
    title: 'Delivered',
    description:
      'Your order has arrived. Enjoy!',
    icon: 'home-outline',
  },
];

const statusOrder: TimelineStatus[] = [
  'confirmed',
  'preparing',
  'ready',
  'awaiting_driver',
  'driver_assigned',
  'heading_to_restaurant',
  'arrived_at_restaurant',
  'picked_up',
  'on_the_way',
  'delivered',
];

function getHeroMessage(status: OrderStatus) {
  switch (status) {
    case 'confirmed':
      return 'Your order has been confirmed.';
    case 'preparing':
      return 'The kitchen is preparing your food.';
    case 'ready':
      return 'Your order is ready for collection.';
    case 'awaiting_driver':
      return 'We are finding a driver nearby.';
    case 'driver_assigned':
      return 'A driver has been assigned.';
    case 'heading_to_restaurant':
      return 'Your driver is heading to Signatures.';
    case 'arrived_at_restaurant':
      return 'Your driver is collecting the order.';
    case 'picked_up':
      return 'Your order has been picked up.';
    case 'on_the_way':
      return 'Your order is on the way.';
    case 'delivered':
      return 'Your order has been delivered.';
    case 'cancelled':
      return 'This order was cancelled.';
  }
}

export function OrderTrackingScreen() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<Props['route']>();

  const {
    getOrder,
    refreshOrder,
    loading,
  } = useOrders();
  const [refreshError, setRefreshError] =
    useState<string | null>(null);

  const order = getOrder(route.params.orderId);

  useEffect(() => {
    let cancelled = false;

    const syncOrder = async () => {
      try {
        await refreshOrder(route.params.orderId);

        if (!cancelled) {
          setRefreshError(null);
        }
      } catch (error) {
        console.error(
          'Failed to refresh order tracking:',
          error,
        );

        if (!cancelled) {
          setRefreshError(
            'Live updates are temporarily unavailable.',
          );
        }
      }
    };

    void syncOrder();

    const interval = setInterval(
      () => void syncOrder(),
      5000,
    );

    const appStateSubscription =
      AppState.addEventListener(
        'change',
        (state) => {
          if (state === 'active') {
            void syncOrder();
          }
        },
      );

    return () => {
      cancelled = true;
      clearInterval(interval);
      appStateSubscription.remove();
    };
  }, [route.params.orderId]);

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color={colors.text}
            />
          </Pressable>

          <Text style={styles.headerTitle}>
            Track order
          </Text>

          <View style={styles.placeholder} />
        </View>

        <View style={styles.notFound}>
          {loading ? (
            <>
              <ActivityIndicator
                size="large"
                color={colors.primary}
              />

              <Text style={styles.notFoundTitle}>
                Loading your order...
              </Text>
            </>
          ) : (
            <>
              <Ionicons
                name="receipt-outline"
                size={40}
                color={colors.primary}
              />

              <Text style={styles.notFoundTitle}>
                Order not found
              </Text>

              <Pressable
                style={styles.retryButton}
                onPress={() =>
                  void refreshOrder(
                    route.params.orderId,
                  )
                }
              >
                <Text style={styles.retryButtonText}>
                  Try again
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }

  const currentIndex =
    order.status === 'cancelled'
      ? -1
      : statusOrder.indexOf(
          order.status as TimelineStatus,
        );

  return (
    <View style={styles.container}>
      <SafeAreaView
        style={styles.safeArea}
        edges={['top']}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color={colors.text}
            />
          </Pressable>

          <Text style={styles.headerTitle}>
            Track order
          </Text>

          <Pressable style={styles.helpButton}>
            <Ionicons
              name="help-circle-outline"
              size={22}
              color={colors.text}
            />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.heroCard}>
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.heroLabel}>
                  ESTIMATED DELIVERY
                </Text>

                <Text style={styles.heroTime}>
                  {order.status === 'delivered'
                    ? 'Delivered'
                    : order.estimatedMinutes
                      ? `${order.estimatedMinutes} min`
                      : '20-30 min'}
                </Text>
              </View>

              <View style={styles.deliveryIcon}>
                <Ionicons
                  name="bicycle"
                  size={25}
                  color="#FFFFFF"
                />
              </View>
            </View>

            <Text style={styles.heroMessage}>
              {getHeroMessage(order.status)}
            </Text>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width:
                      currentIndex < 0
                        ? '0%'
                        : `${
                            ((currentIndex + 1) /
                              statusOrder.length) *
                            100
                          }%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.orderId}>
              {order.id}
            </Text>
          </View>

          {refreshError && (
            <View style={styles.syncWarning}>
              <Ionicons
                name="cloud-offline-outline"
                size={18}
                color={colors.primary}
              />

              <Text style={styles.syncWarningText}>
                {refreshError} Showing the last saved update.
              </Text>
            </View>
          )}

          {order.status === 'cancelled' ? (
            <View style={styles.cancelledCard}>
              <Ionicons
                name="close-circle-outline"
                size={25}
                color={colors.primary}
              />

              <View style={styles.cancelledContent}>
                <Text style={styles.cancelledTitle}>
                  Order cancelled
                </Text>

                <Text
                  style={styles.cancelledDescription}
                >
                  This order is no longer active.
                </Text>
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.sectionTitle}>
                Order status
              </Text>

              <View style={styles.timelineCard}>
                {timeline.map((step, index) => {
                  const complete =
                    index <= currentIndex;

                  const current =
                    index === currentIndex;

                  const last =
                    index ===
                    timeline.length - 1;

                  return (
                    <View
                      key={step.status}
                      style={styles.timelineRow}
                    >
                      <View
                        style={styles.timelineIndicator}
                      >
                        <View
                          style={[
                            styles.timelineCircle,
                            complete &&
                              styles.timelineCircleComplete,
                            current &&
                              styles.timelineCircleCurrent,
                          ]}
                        >
                          <Ionicons
                            name={step.icon}
                            size={16}
                            color={
                              complete
                                ? '#FFFFFF'
                                : '#A7A7AD'
                            }
                          />
                        </View>

                        {!last && (
                          <View
                            style={[
                              styles.timelineLine,
                              index < currentIndex &&
                                styles.timelineLineComplete,
                            ]}
                          />
                        )}
                      </View>

                      <View
                        style={[
                          styles.timelineContent,
                          !last &&
                            styles.timelineContentSpacing,
                        ]}
                      >
                        <Text
                          style={[
                            styles.timelineTitle,
                            !complete &&
                              styles.timelineTitleInactive,
                          ]}
                        >
                          {step.title}
                        </Text>

                        <Text
                          style={
                            styles.timelineDescription
                          }
                        >
                          {step.description}
                        </Text>

                        {current && (
                          <View
                            style={styles.currentBadge}
                          >
                            <Text
                              style={
                                styles.currentBadgeText
                              }
                            >
                              CURRENT
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </>
          )}

          {order.driver && (
            <>
              <Text style={styles.sectionTitle}>
                Your driver
              </Text>

              <View style={styles.driverCard}>
                <View style={styles.driverAvatar}>
                  <Ionicons
                    name="person"
                    size={22}
                    color="#FFFFFF"
                  />
                </View>

                <View style={styles.driverContent}>
                  <Text style={styles.driverName}>
                    {order.driver.name}
                  </Text>

                  <Text style={styles.driverMeta}>
                    {order.driver.code} ·{' '}
                    {getHeroMessage(order.status)}
                  </Text>
                </View>

                <View style={styles.driverLiveBadge}>
                  <View style={styles.driverLiveDot} />
                  <Text style={styles.driverLiveText}>
                    LIVE
                  </Text>
                </View>
              </View>
            </>
          )}

          <Text style={styles.sectionTitle}>
            Delivery details
          </Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={colors.primary}
                />
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  DELIVERING TO
                </Text>

                <Text style={styles.infoTitle}>
                  {order.address.label}
                </Text>

                <Text style={styles.infoDescription}>
                  {order.address.address}
                </Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons
                  name="card-outline"
                  size={20}
                  color={colors.primary}
                />
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  PAYMENT
                </Text>

                <Text style={styles.infoTitle}>
                  {order.paymentMethod.label}
                </Text>

                <Text style={styles.infoDescription}>
                  {order.paymentMethod.detail}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>
            Order summary
          </Text>

          <View style={styles.summaryCard}>
            {order.items.map((item) => (
              <View
                key={item.id}
                style={styles.itemRow}
              >
                <View style={styles.quantityBadge}>
                  <Text style={styles.quantityText}>
                    {item.quantity}Ã—
                  </Text>
                </View>

                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>
                    {item.name}
                  </Text>

                  <Text style={styles.itemOptions}>
                    {item.size}
                    {item.extras.length > 0
                      ? ` â€¢ ${item.extras
                          .map(
                            (extra) =>
                              extra.name,
                          )
                          .join(', ')}`
                      : ''}
                  </Text>
                </View>

                <Text style={styles.itemPrice}>
                  ${item.totalPrice.toFixed(2)}
                </Text>
              </View>
            ))}

            <View style={styles.summaryDivider} />

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                Subtotal
              </Text>

              <Text style={styles.priceValue}>
                ${order.subtotal.toFixed(2)}
              </Text>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                Delivery
              </Text>

              <Text style={styles.priceValue}>
                ${order.deliveryFee.toFixed(2)}
              </Text>
            </View>

            <View style={styles.totalDivider} />

            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>
                Total
              </Text>

              <Text style={styles.totalValue}>
                ${order.total.toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>
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

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  helpButton: {
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

  placeholder: {
    width: 44,
  },

  content: {
    paddingHorizontal: spacing.xl,
  },

  heroCard: {
    marginTop: 10,
    padding: 20,
    borderRadius: radius.xl,
    backgroundColor: colors.black,
  },

  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  heroLabel: {
    color: '#A8A8AD',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  heroTime: {
    marginTop: 4,
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },

  deliveryIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroMessage: {
    marginTop: 16,
    color: '#D1D1D5',
    fontSize: 13,
  },

  progressTrack: {
    height: 5,
    marginTop: 18,
    borderRadius: 3,
    backgroundColor: '#2B2B30',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.primary,
  },

  orderId: {
    marginTop: 12,
    color: '#818187',
    fontSize: 10,
    fontWeight: '700',
  },

  syncWarning: {
    marginTop: 12,
    padding: 12,
    borderRadius: radius.lg,
    backgroundColor: '#FFF0EA',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  syncWarningText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },

  sectionTitle: {
    marginTop: 27,
    marginBottom: 13,
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },

  timelineCard: {
    padding: 18,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  timelineRow: {
    flexDirection: 'row',
  },

  timelineIndicator: {
    width: 42,
    alignItems: 'center',
  },

  timelineCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFEFF1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  timelineCircleComplete: {
    backgroundColor: colors.primary,
  },

  timelineCircleCurrent: {
    borderWidth: 4,
    borderColor: '#FFD9CA',
  },

  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 39,
    backgroundColor: '#E4E4E7',
  },

  timelineLineComplete: {
    backgroundColor: colors.primary,
  },

  timelineContent: {
    flex: 1,
    paddingLeft: 10,
    paddingTop: 6,
  },

  timelineContentSpacing: {
    paddingBottom: 25,
  },

  timelineTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },

  timelineTitleInactive: {
    color: '#A0A0A5',
  },

  timelineDescription: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
  },

  currentBadge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: '#FFF0EA',
  },

  currentBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: colors.primary,
  },

  driverCard: {
    padding: 16,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },

  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },

  driverContent: {
    flex: 1,
    marginLeft: 12,
  },

  driverName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },

  driverMeta: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 15,
  },

  driverLiveBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: '#EFFAF4',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  driverLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E9D63',
  },

  driverLiveText: {
    color: '#2E9D63',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
  },

  infoCard: {
    padding: 16,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF0EA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoContent: {
    flex: 1,
    marginLeft: 12,
  },

  infoLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
    color: colors.textSecondary,
  },

  infoTitle: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },

  infoDescription: {
    marginTop: 2,
    fontSize: 11,
    color: colors.textSecondary,
  },

  infoDivider: {
    height: 1,
    marginVertical: 14,
    backgroundColor: colors.border,
  },

  summaryCard: {
    padding: 17,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },

  quantityBadge: {
    minWidth: 30,
    height: 30,
    paddingHorizontal: 6,
    borderRadius: 15,
    backgroundColor: '#FFF0EA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
  },

  itemInfo: {
    flex: 1,
    marginHorizontal: 10,
  },

  itemName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },

  itemOptions: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 15,
    color: colors.textSecondary,
  },

  itemPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
  },

  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 6,
  },

  priceRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  priceLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  priceValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },

  totalDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: 14,
  },

  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },

  totalValue: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.primary,
  },

  devControls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  devButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  devButtonActive: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },

  devButtonText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },

  devButtonTextActive: {
    color: '#FFFFFF',
  },
  cancelledCard: {
    marginTop: 24,
    padding: 18,
    flexDirection: 'row',
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  cancelledContent: {
    flex: 1,
    marginLeft: 12,
  },

  cancelledTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },

  cancelledDescription: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSecondary,
  },

  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  notFoundTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },

  retryButton: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: radius.pill,
    backgroundColor: colors.black,
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  bottomSpace: {
    height: 45,
  },
});
