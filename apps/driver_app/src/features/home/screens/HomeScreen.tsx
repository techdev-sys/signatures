import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDeliveries } from '../../../context/DeliveryContext';
import type { DriverTabParamList } from '../../../navigation/AppNavigator';
import { theme } from '../../../theme/theme';

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  }

  if (hour < 18) {
    return 'Good afternoon';
  }

  return 'Good evening';
}

function isToday(timestamp?: string) {
  if (!timestamp) {
    return false;
  }

  const date = new Date(timestamp);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function formatRequestAge(
  requestedAt: string,
  currentTime: number,
) {
  const seconds = Math.max(
    0,
    Math.floor(
      (currentTime - new Date(requestedAt).getTime()) /
        1000,
    ),
  );

  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  return `${Math.floor(minutes / 60)}h ago`;
}

export function HomeScreen() {
  const navigation =
    useNavigation<BottomTabNavigationProp<DriverTabParamList>>();

  const [currentTime, setCurrentTime] =
    useState(() => Date.now());

  const {
    driver,
    loading,
    loadError,
    availableDeliveries,
    activeDeliveries,
    completedDeliveries,
    acceptDelivery,
    declineDelivery,
  } = useDeliveries();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const incomingDelivery = availableDeliveries[0];
  const activeDelivery = activeDeliveries[0];

  const online = driver?.is_online ?? false;
  const available = driver?.status === 'available';
  const delivering = driver?.status === 'delivering';

  const firstName =
    driver?.full_name.trim().split(/\s+/)[0] ??
    'Driver';

  const todayCompletedDeliveries =
    completedDeliveries.filter((delivery) =>
      isToday(delivery.deliveredAt),
    );

  const todayEarnings =
    todayCompletedDeliveries.reduce(
      (total, delivery) =>
        total + delivery.earnings,
      0,
    );

  const handleAccept = async () => {
    if (!incomingDelivery) {
      return;
    }

    try {
      await acceptDelivery(incomingDelivery.id);
      navigation.navigate('Deliveries');
    } catch (error) {
      console.error(
        'Failed to accept delivery:',
        error,
      );

      Alert.alert(
        'Unable to accept delivery',
        'This delivery could not be accepted. Please try again.',
      );
    }
  };

  const handleDecline = () => {
    if (incomingDelivery) {
      declineDelivery(incomingDelivery.id);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>SIGNATURES DRIVER</Text>
            <Text style={styles.greeting}>
              {getGreeting()}, {firstName}
            </Text>
          </View>

          <Pressable style={styles.notificationButton}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={theme.colors.black}
            />
            {availableDeliveries.length > 0 && (
              <View style={styles.notificationDot} />
            )}
          </Pressable>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusTop}>
            <View style={[styles.statusIcon, !online && styles.offlineIcon]}>
              <Ionicons
                name={online ? 'radio' : 'power-outline'}
                size={21}
                color={
                  online
                    ? theme.colors.success
                    : theme.colors.textSecondary
                }
              />
            </View>

            <Switch
              value={online}
              disabled
              trackColor={{
                false: '#D7D7DA',
                true: theme.colors.success,
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          <Text style={styles.statusEyebrow}>
            {loading
              ? 'CHECKING STATUS'
              : delivering
                ? 'DELIVERY IN PROGRESS'
                : online
                  ? "YOU'RE ONLINE"
                  : "YOU'RE OFFLINE"}
          </Text>
          <Text style={styles.statusTitle}>
            {loading
              ? 'Connecting to dispatch'
              : loadError
                ? 'Status unavailable'
                : delivering
                  ? 'Complete your active delivery'
                  : online && available
                    ? 'Ready for deliveries'
                    : online
                      ? 'Not accepting deliveries'
                      : 'Delivery requests paused'}
          </Text>
          <Text style={styles.statusDescription}>
            {loadError
              ? loadError
              : delivering
                ? 'You will become available again when the current delivery is completed.'
                : online && available
                  ? "We'll send nearby Signatures delivery requests here."
                  : online
                    ? 'Your current driver status does not allow new requests.'
                    : 'Your driver account is currently offline.'}
          </Text>
        </View>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionEyebrow}>TODAY</Text>
          <Text style={styles.sectionTitle}>Your performance</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard
            icon="bicycle-outline"
            value={`${todayCompletedDeliveries.length}`}
            label="Deliveries"
          />
          <StatCard
            icon="cash-outline"
            value={`$${todayEarnings.toFixed(2)}`}
            label="Earnings"
          />
          <StatCard icon="star" value="—" label="Rating" />
        </View>

        {online && available && incomingDelivery && !activeDelivery ? (
          <>
            <View style={styles.sectionHeading}>
              <View style={styles.newRequestHeading}>
                <View>
                  <Text style={styles.sectionEyebrow}>NEW DELIVERY</Text>
                  <Text style={styles.sectionTitle}>Delivery request</Text>
                </View>

                <View style={styles.requestTimer}>
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.requestTimerText}>
                    {formatRequestAge(
                      incomingDelivery.requestedAt,
                      currentTime,
                    )}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.requestCard}>
              <View style={styles.restaurantRow}>
                <View style={styles.restaurantIcon}>
                  <Ionicons
                    name="restaurant"
                    size={22}
                    color={theme.colors.primary}
                  />
                </View>

                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantLabel}>PICKUP</Text>
                  <Text style={styles.restaurantName}>
                    {incomingDelivery.restaurantName}
                  </Text>
                  <View style={styles.inlineMeta}>
                    <Ionicons
                      name="navigate-outline"
                      size={13}
                      color={theme.colors.textSecondary}
                    />
                    <Text style={styles.metaText}>
                      {incomingDelivery.distanceToRestaurant.toFixed(1)} km away
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.route}>
                <View style={styles.routeMarkerColumn}>
                  <View style={styles.pickupDot} />
                  <View style={styles.routeLine} />
                  <View style={styles.deliveryDot} />
                </View>

                <View style={styles.routeDetails}>
                  <View>
                    <Text style={styles.routeLabel}>PICKUP FROM</Text>
                    <Text style={styles.routeValue}>
                      {incomingDelivery.restaurantName}
                    </Text>
                  </View>
                  <View style={styles.destination}>
                    <Text style={styles.routeLabel}>DELIVER TO</Text>
                    <Text style={styles.routeValue}>
                      {incomingDelivery.customerAddress}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.orderInformation}>
                <View>
                  <Text style={styles.orderLabel}>ORDER</Text>
                  <Text style={styles.orderValue}>
                    #{incomingDelivery.orderId}
                  </Text>
                  <Text style={styles.orderSubtext}>
                    {incomingDelivery.items.length} items
                  </Text>
                </View>

                <View style={styles.earnings}>
                  <Text style={styles.orderLabel}>YOUR EARNINGS</Text>
                  <Text style={styles.earningsValue}>
                    ${incomingDelivery.earnings.toFixed(2)}
                  </Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <Pressable
                  style={styles.declineButton}
                  onPress={handleDecline}
                >
                  <Text style={styles.declineText}>Decline</Text>
                </Pressable>

                <Pressable
                  style={styles.acceptButton}
                  onPress={handleAccept}
                >
                  <Ionicons name="checkmark" size={19} color="#FFFFFF" />
                  <Text style={styles.acceptText}>Accept delivery</Text>
                </Pressable>
              </View>
            </View>
          </>
        ) : activeDelivery ? (
          <Pressable
            style={styles.waitingCard}
            onPress={() => navigation.navigate('Deliveries')}
          >
            <View style={styles.waitingIcon}>
              <Ionicons
                name="bicycle"
                size={25}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.waitingTitle}>Delivery in progress</Text>
            <Text style={styles.waitingText}>
              Order #{activeDelivery.orderId} is currently active. Tap to
              continue.
            </Text>
          </Pressable>
        ) : online ? (
          <View style={styles.waitingCard}>
            <View style={styles.waitingIcon}>
              <Ionicons
                name="radio-outline"
                size={25}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.waitingTitle}>Looking for deliveries</Text>
            <Text style={styles.waitingText}>
              Stay online. New delivery requests will appear here.
            </Text>
          </View>
        ) : (
          <View style={styles.waitingCard}>
            <View style={styles.waitingIcon}>
              <Ionicons
                name="moon-outline"
                size={25}
                color={theme.colors.textSecondary}
              />
            </View>
            <Text style={styles.waitingTitle}>{"You're offline"}</Text>
            <Text style={styles.waitingText}>
              Go online to receive delivery requests.
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={18} color={theme.colors.primary} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  brand: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  greeting: {
    marginTop: 5,
    color: theme.colors.black,
    fontSize: 22,
    fontWeight: '800',
  },
  notificationButton: {
    width: 44,
    height: 44,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
  },
  notificationDot: {
    width: 7,
    height: 7,
    position: 'absolute',
    top: 10,
    right: 11,
    borderWidth: 1.5,
    borderColor: theme.colors.surface,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  statusCard: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: theme.colors.black,
  },
  statusTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#15271D',
  },
  offlineIcon: {
    backgroundColor: '#DADADD',
  },
  statusEyebrow: {
    marginTop: 20,
    color: theme.colors.success,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  statusTitle: {
    marginTop: 5,
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
  },
  statusDescription: {
    maxWidth: 290,
    marginTop: 7,
    color: '#A9A9AF',
    fontSize: 13,
    lineHeight: 19,
  },
  sectionHeading: {
    marginTop: 26,
    marginBottom: 11,
  },
  sectionEyebrow: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  sectionTitle: {
    marginTop: 3,
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    minHeight: 125,
    padding: 13,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
  },
  statIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: '#FFF0EA',
  },
  statValue: {
    marginTop: 14,
    color: theme.colors.black,
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    marginTop: 3,
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  newRequestHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  requestTimer: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 20,
    backgroundColor: '#FFF0EA',
  },
  requestTimerText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  requestCard: {
    overflow: 'hidden',
    padding: 17,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#FFF0EA',
  },
  restaurantInfo: {
    marginLeft: 11,
  },
  restaurantLabel: {
    color: theme.colors.primary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  restaurantName: {
    marginTop: 2,
    color: theme.colors.black,
    fontSize: 16,
    fontWeight: '800',
  },
  inlineMeta: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
  },
  route: {
    marginTop: 18,
    padding: 14,
    flexDirection: 'row',
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  routeMarkerColumn: {
    width: 17,
    alignItems: 'center',
  },
  pickupDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  routeLine: {
    width: 1,
    height: 37,
    backgroundColor: '#CFCFD3',
  },
  deliveryDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: theme.colors.black,
  },
  routeDetails: {
    marginLeft: 9,
  },
  routeLabel: {
    color: theme.colors.textSecondary,
    fontSize: 9,
    fontWeight: '700',
  },
  routeValue: {
    marginTop: 2,
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  destination: {
    marginTop: 22,
  },
  orderInformation: {
    marginTop: 17,
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  orderLabel: {
    color: theme.colors.textSecondary,
    fontSize: 9,
    fontWeight: '700',
  },
  orderValue: {
    marginTop: 3,
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  orderSubtext: {
    marginTop: 2,
    color: theme.colors.textSecondary,
    fontSize: 11,
  },
  earnings: {
    alignItems: 'flex-end',
  },
  earningsValue: {
    marginTop: 3,
    color: theme.colors.success,
    fontSize: 18,
    fontWeight: '800',
  },
  actionRow: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 9,
  },
  declineButton: {
    minHeight: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
  },
  declineText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  acceptButton: {
    minHeight: 50,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
  },
  acceptText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  waitingCard: {
    minHeight: 190,
    marginTop: 26,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
  },
  waitingIcon: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#FFF0EA',
  },
  waitingTitle: {
    marginTop: 13,
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  waitingText: {
    maxWidth: 250,
    marginTop: 5,
    color: theme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 120,
  },
});
