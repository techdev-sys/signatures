import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDeliveries } from '../../../context/DeliveryContext';
import type {
  Delivery,
  DeliveryStatus,
} from '../../../types/delivery';

type Filter = 'Available' | 'Active' | 'Completed';

const ORANGE = '#FF5A1F';
const BLACK = '#0B0B0F';
const BACKGROUND = '#F7F7F8';
const BORDER = '#E8E8EA';
const MUTED = '#6E6E73';
const GREEN = '#2E9D63';

function statusLabel(status: DeliveryStatus) {
  switch (status) {
    case 'available':
      return 'New delivery';

    case 'accepted':
      return 'Accepted';

    case 'heading_to_restaurant':
      return 'Go to restaurant';

    case 'arrived_at_restaurant':
      return 'Arrived at Restaurant';

    case 'picked_up':
      return 'Order picked up';

    case 'on_the_way':
      return 'On the way';

    case 'delivered':
      return 'Delivered';

    case 'declined':
      return 'Declined';

    default:
      return status;
  }
}

function statusColor(status: DeliveryStatus) {
  switch (status) {
    case 'available':
      return ORANGE;

    case 'delivered':
      return GREEN;

    default:
      return BLACK;
  }
}

export function DeliveriesScreen() {
  const {
    availableDeliveries,
    activeDeliveries,
    completedDeliveries,
    acceptDelivery,
    declineDelivery,
    updateDeliveryStatus,
  } = useDeliveries();

  const [filter, setFilter] =
    useState<Filter>('Available');

  const handleAccept = async (
    deliveryId: string,
  ) => {
    try {
      await acceptDelivery(deliveryId);
      setFilter('Active');
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

  let deliveries: Delivery[] = [];

  if (filter === 'Available') {
    deliveries = availableDeliveries;
  }

  if (filter === 'Active') {
    deliveries = activeDeliveries;
  }

  if (filter === 'Completed') {
    deliveries = completedDeliveries;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>
              SIGNATURES
            </Text>

            <Text style={styles.title}>
              Deliveries
            </Text>
          </View>

          <Pressable style={styles.notification}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={BLACK}
            />

            {availableDeliveries.length > 0 && (
              <View style={styles.notificationDot} />
            )}
          </Pressable>
        </View>

        <View style={styles.summary}>
          <View>
            <Text style={styles.summaryLabel}>
              READY TO EARN
            </Text>

            <Text style={styles.summaryTitle}>
              {availableDeliveries.length}{' '}
              {availableDeliveries.length === 1
                ? 'delivery'
                : 'deliveries'}{' '}
              available
            </Text>
          </View>

          <View style={styles.summaryIcon}>
            <Ionicons
              name="bicycle"
              size={30}
              color={ORANGE}
            />
          </View>
        </View>

        <View style={styles.filters}>
          {(
            [
              'Available',
              'Active',
              'Completed',
            ] as Filter[]
          ).map(item => {
            let count = 0;

            if (item === 'Available') {
              count = availableDeliveries.length;
            }

            if (item === 'Active') {
              count = activeDeliveries.length;
            }

            if (item === 'Completed') {
              count = completedDeliveries.length;
            }

            const active = filter === item;

            return (
              <Pressable
                key={item}
                onPress={() => setFilter(item)}
                style={[
                  styles.filterButton,
                  active && styles.filterButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    active && styles.filterTextActive,
                  ]}
                >
                  {item}
                </Text>

                <View
                  style={[
                    styles.countBadge,
                    active &&
                      styles.countBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      active &&
                        styles.countTextActive,
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.scrollContent
          }
        >
          {deliveries.length === 0 ? (
            <EmptyState filter={filter} />
          ) : (
            deliveries.map(delivery => (
              <DeliveryCard
                key={delivery.id}
                delivery={delivery}
                onAccept={() =>
                  handleAccept(delivery.id)
                }
                onDecline={() => {
                  Alert.alert(
                    'Decline delivery?',
                    `Are you sure you want to decline order ${delivery.orderId}?`,
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Decline',
                        style: 'destructive',
                        onPress: () =>
                          declineDelivery(
                            delivery.id,
                          ),
                      },
                    ],
                  );
                }}
                onStatusChange={status =>
                  updateDeliveryStatus(
                    delivery.id,
                    status,
                  )
                }
              />
            ))
          )}

          <View style={{ height: 120 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function DeliveryCard({
  delivery,
  onAccept,
  onDecline,
  onStatusChange,
}: {
  delivery: Delivery;
  onAccept: () => void;
  onDecline: () => void;
  onStatusChange: (
    status: DeliveryStatus,
  ) => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.orderId}>
            {delivery.orderId}
          </Text>

          <Text style={styles.requested}>
            {delivery.items.length}{' '}
            {delivery.items.length === 1
              ? 'item'
              : 'items'}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                statusColor(delivery.status),
            },
          ]}
        >
          <Text style={styles.statusText}>
            {statusLabel(delivery.status)}
          </Text>
        </View>
      </View>

      <View style={styles.route}>
        <View style={styles.routeRail}>
          <View style={styles.pickupDot} />

          <View style={styles.routeLine} />

          <View style={styles.destinationDot} />
        </View>

        <View style={styles.routeContent}>
          <View style={styles.routeBlock}>
            <Text style={styles.routeLabel}>
              PICKUP
            </Text>

            <Text style={styles.locationName}>
              {delivery.restaurantName}
            </Text>

            <Text style={styles.address}>
              {delivery.restaurantAddress}
            </Text>
          </View>

          <View style={styles.routeBlock}>
            <Text style={styles.routeLabel}>
              DELIVER TO
            </Text>

            <Text style={styles.locationName}>
              {delivery.customerName}
            </Text>

            <Text style={styles.address}>
              {delivery.customerAddress}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.stats}>
        <Stat
          icon="navigate-outline"
          value={`${delivery.deliveryDistance.toFixed(
            1,
          )} km`}
          label="Distance"
        />

        <Stat
          icon="time-outline"
          value={`${delivery.estimatedMinutes} min`}
          label="Estimate"
        />

        <Stat
          icon="wallet-outline"
          value={`$${delivery.earnings.toFixed(
            2,
          )}`}
          label="Earnings"
          highlight
        />
      </View>

      {delivery.status === 'available' && (
        <View style={styles.actions}>
          <Pressable
            style={styles.declineButton}
            onPress={onDecline}
          >
            <Text style={styles.declineText}>
              Decline
            </Text>
          </Pressable>

          <Pressable
            style={styles.acceptButton}
            onPress={onAccept}
          >
            <Text style={styles.acceptText}>
              Accept delivery
            </Text>
          </Pressable>
        </View>
      )}

      {delivery.status ===
        'heading_to_restaurant' && (
        <View style={styles.activeActions}>
          <Pressable style={styles.navigationButton}>
            <Ionicons
              name="navigate"
              size={18}
              color={ORANGE}
            />

            <Text style={styles.navigationText}>
              Navigate
            </Text>
          </Pressable>

          <Pressable
            style={styles.primaryButton}
            onPress={() =>
              onStatusChange(
                'arrived_at_restaurant',
              )
            }
          >
            <Text style={styles.primaryButtonText}>
              {"I've arrived"}
            </Text>
          </Pressable>
        </View>
      )}

      {delivery.status ===
        'arrived_at_restaurant' && (
        <>
          <View style={styles.pickupNotice}>
            <Ionicons
              name="restaurant-outline"
              size={22}
              color={ORANGE}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.pickupTitle}>
                Collect order
              </Text>

              <Text style={styles.pickupDescription}>
                Confirm the order number with
                Signatures before leaving.
              </Text>
            </View>
          </View>

          <Pressable
            style={styles.fullPrimaryButton}
            onPress={() =>
              onStatusChange('picked_up')
            }
          >
            <Text style={styles.primaryButtonText}>
              Confirm pickup
            </Text>
          </Pressable>
        </>
      )}

      {delivery.status === 'picked_up' && (
        <Pressable
          style={styles.fullPrimaryButton}
          onPress={() =>
            onStatusChange('on_the_way')
          }
        >
          <Ionicons
            name="bicycle"
            size={19}
            color="#FFF"
          />

          <Text style={styles.primaryButtonText}>
            Start delivery
          </Text>
        </Pressable>
      )}

      {delivery.status === 'on_the_way' && (
        <>
          <View style={styles.customerBox}>
            <Ionicons
              name="person-outline"
              size={20}
              color={BLACK}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.customerName}>
                {delivery.customerName}
              </Text>

              <Text style={styles.customerPhone}>
                {delivery.customerPhone}
              </Text>
            </View>

            <Pressable style={styles.callButton}>
              <Ionicons
                name="call"
                size={18}
                color={ORANGE}
              />
            </Pressable>
          </View>

          <View style={styles.activeActions}>
            <Pressable style={styles.navigationButton}>
              <Ionicons
                name="navigate"
                size={18}
                color={ORANGE}
              />

              <Text style={styles.navigationText}>
                Navigate
              </Text>
            </Pressable>

            <Pressable
              style={styles.primaryButton}
              onPress={() => {
                Alert.alert(
                  'Complete delivery',
                  `Confirm that ${delivery.orderId} was delivered to ${delivery.customerName}.`,
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Delivered',
                      onPress: () =>
                        onStatusChange(
                          'delivered',
                        ),
                    },
                  ],
                );
              }}
            >
              <Text style={styles.primaryButtonText}>
                Delivered
              </Text>
            </Pressable>
          </View>
        </>
      )}

      {delivery.status === 'delivered' && (
        <View style={styles.completedBox}>
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={GREEN}
          />

          <View>
            <Text style={styles.completedTitle}>
              Delivery completed
            </Text>

            <Text style={styles.completedText}>
              You earned $
              {delivery.earnings.toFixed(2)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

function Stat({
  icon,
  value,
  label,
  highlight = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <View style={styles.stat}>
      <Ionicons
        name={icon}
        size={18}
        color={highlight ? ORANGE : BLACK}
      />

      <Text
        style={[
          styles.statValue,
          highlight && {
            color: ORANGE,
          },
        ]}
      >
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

function EmptyState({
  filter,
}: {
  filter: Filter;
}) {
  let title = 'No deliveries';
  let message =
    'There are no deliveries here right now.';

  if (filter === 'Available') {
    title = 'Waiting for orders';
    message =
      'New delivery requests will appear here automatically.';
  }

  if (filter === 'Active') {
    title = 'No active delivery';
    message =
      'Accept a delivery to start earning.';
  }

  if (filter === 'Completed') {
    title = 'No completed deliveries';
    message =
      'Your finished deliveries will appear here.';
  }

  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons
          name="bicycle-outline"
          size={34}
          color={ORANGE}
        />
      </View>

      <Text style={styles.emptyTitle}>
        {title}
      </Text>

      <Text style={styles.emptyText}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  container: {
    flex: 1,
    paddingHorizontal: 18,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 18,
  },

  brand: {
    color: ORANGE,
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1.4,
  },

  title: {
    color: BLACK,
    fontSize: 30,
    fontWeight: '900',
    marginTop: 3,
  },

  notification: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },

  notificationDot: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: ORANGE,
    top: 9,
    right: 10,
    borderWidth: 2,
    borderColor: '#FFF',
  },

  summary: {
    backgroundColor: BLACK,
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  summaryLabel: {
    color: '#A8A8AE',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },

  summaryTitle: {
    color: '#FFF',
    fontSize: 19,
    fontWeight: '800',
    marginTop: 6,
  },

  summaryIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#1A1A1F',
    alignItems: 'center',
    justifyContent: 'center',
  },

  filters: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
    marginBottom: 14,
  },

  filterButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },

  filterButtonActive: {
    backgroundColor: BLACK,
    borderColor: BLACK,
  },

  filterText: {
    color: MUTED,
    fontWeight: '700',
    fontSize: 12,
  },

  filterTextActive: {
    color: '#FFF',
  },

  countBadge: {
    minWidth: 21,
    height: 21,
    paddingHorizontal: 5,
    borderRadius: 11,
    backgroundColor: '#F0F0F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  countBadgeActive: {
    backgroundColor: ORANGE,
  },

  countText: {
    fontSize: 10,
    fontWeight: '900',
    color: BLACK,
  },

  countTextActive: {
    color: '#FFF',
  },

  scrollContent: {
    paddingTop: 2,
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  orderId: {
    fontSize: 18,
    fontWeight: '900',
    color: BLACK,
  },

  requested: {
    marginTop: 3,
    color: MUTED,
    fontSize: 12,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },

  statusText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 11,
  },

  route: {
    flexDirection: 'row',
    marginTop: 22,
  },

  routeRail: {
    width: 24,
    alignItems: 'center',
    paddingTop: 4,
  },

  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: ORANGE,
  },

  routeLine: {
    width: 2,
    height: 53,
    backgroundColor: '#DDDDE1',
  },

  destinationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: BLACK,
  },

  routeContent: {
    flex: 1,
    gap: 20,
    paddingLeft: 9,
  },

  routeBlock: {
    minHeight: 49,
  },

  routeLabel: {
    fontSize: 10,
    color: MUTED,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  locationName: {
    marginTop: 2,
    fontSize: 15,
    color: BLACK,
    fontWeight: '800',
  },

  address: {
    marginTop: 2,
    fontSize: 12,
    color: MUTED,
  },

  stats: {
    marginTop: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: BORDER,
    flexDirection: 'row',
  },

  stat: {
    flex: 1,
    alignItems: 'center',
  },

  statValue: {
    marginTop: 5,
    color: BLACK,
    fontWeight: '900',
    fontSize: 14,
  },

  statLabel: {
    color: MUTED,
    fontSize: 10,
    marginTop: 2,
  },

  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },

  declineButton: {
    flex: 0.8,
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },

  declineText: {
    color: BLACK,
    fontWeight: '800',
  },

  acceptButton: {
    flex: 1.4,
    height: 50,
    borderRadius: 15,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  acceptText: {
    color: '#FFF',
    fontWeight: '900',
  },

  activeActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },

  navigationButton: {
    flex: 0.8,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#FFF1EB',
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },

  navigationText: {
    color: ORANGE,
    fontWeight: '800',
  },

  primaryButton: {
    flex: 1.3,
    height: 50,
    borderRadius: 15,
    backgroundColor: BLACK,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: '#FFF',
    fontWeight: '900',
  },

  fullPrimaryButton: {
    height: 52,
    borderRadius: 15,
    backgroundColor: BLACK,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },

  pickupNotice: {
    backgroundColor: '#FFF4EF',
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
  },

  pickupTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: BLACK,
  },

  pickupDescription: {
    color: MUTED,
    fontSize: 12,
    marginTop: 3,
    lineHeight: 17,
  },

  customerBox: {
    marginTop: 16,
    borderRadius: 16,
    backgroundColor: '#F7F7F8',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  customerName: {
    fontWeight: '800',
    color: BLACK,
  },

  customerPhone: {
    color: MUTED,
    fontSize: 12,
    marginTop: 2,
  },

  callButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  completedBox: {
    marginTop: 16,
    backgroundColor: '#EFFAF4',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  completedTitle: {
    color: BLACK,
    fontWeight: '900',
  },

  completedText: {
    color: GREEN,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },

  empty: {
    paddingVertical: 70,
    alignItems: 'center',
  },

  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#FFF1EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  emptyTitle: {
    color: BLACK,
    fontSize: 19,
    fontWeight: '900',
  },

  emptyText: {
    color: MUTED,
    textAlign: 'center',
    maxWidth: 270,
    lineHeight: 20,
    marginTop: 7,
  },
});
