import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDeliveries } from '../../../context/DeliveryContext';
import type { Delivery } from '../../../types/delivery';

const ORANGE = '#FF5A1F';
const BLACK = '#0B0B0F';
const BACKGROUND = '#F7F7F8';
const BORDER = '#E8E8EA';
const MUTED = '#6E6E73';
const GREEN = '#2E9D63';

type Period = 'Today' | 'Week';

export function EarningsScreen() {
  const { completedDeliveries } = useDeliveries();

  const [period, setPeriod] = useState<Period>('Today');

  const earnings = useMemo(() => {
    return completedDeliveries.reduce(
      (total, delivery) => total + delivery.earnings,
      0,
    );
  }, [completedDeliveries]);

  const deliveryCount = completedDeliveries.length;

  const average =
    deliveryCount > 0 ? earnings / deliveryCount : 0;

  /*
   * Temporary local values.
   *
   * Later these will come from the backend and real historical
   * delivery records.
   */
  const previousEarnings = 21.75;
  const previousDeliveries = 9;

  const displayedEarnings =
    period === 'Today'
      ? earnings
      : earnings + previousEarnings;

  const displayedDeliveries =
    period === 'Today'
      ? deliveryCount
      : deliveryCount + previousDeliveries;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>
              SIGNATURES DRIVER
            </Text>

            <Text style={styles.title}>
              Earnings
            </Text>
          </View>

          <Pressable style={styles.walletButton}>
            <Ionicons
              name="wallet-outline"
              size={22}
              color={BLACK}
            />
          </Pressable>
        </View>

        <View style={styles.periodSelector}>
          <PeriodButton
            title="Today"
            active={period === 'Today'}
            onPress={() => setPeriod('Today')}
          />

          <PeriodButton
            title="This week"
            active={period === 'Week'}
            onPress={() => setPeriod('Week')}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.heroCard}>
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.heroLabel}>
                  {period === 'Today'
                    ? "TODAY'S EARNINGS"
                    : 'WEEKLY EARNINGS'}
                </Text>

                <Text style={styles.heroAmount}>
                  ${displayedEarnings.toFixed(2)}
                </Text>
              </View>

              <View style={styles.heroIcon}>
                <Ionicons
                  name="cash-outline"
                  size={30}
                  color={ORANGE}
                />
              </View>
            </View>

            <View style={styles.heroDivider} />

            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>
                  {displayedDeliveries}
                </Text>

                <Text style={styles.heroStatLabel}>
                  Deliveries
                </Text>
              </View>

              <View style={styles.verticalDivider} />

              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>
                  ${average.toFixed(2)}
                </Text>

                <Text style={styles.heroStatLabel}>
                  Avg. per delivery
                </Text>
              </View>

              <View style={styles.verticalDivider} />

              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>
                  4.9
                </Text>

                <Text style={styles.heroStatLabel}>
                  Rating
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Performance
            </Text>

            <Text style={styles.sectionCaption}>
              Today
            </Text>
          </View>

          <View style={styles.performanceGrid}>
            <PerformanceCard
              icon="bicycle-outline"
              value={`${deliveryCount}`}
              label="Completed"
            />

            <PerformanceCard
              icon="time-outline"
              value="24 min"
              label="Avg. delivery"
            />

            <PerformanceCard
              icon="checkmark-circle-outline"
              value="98%"
              label="Completion"
            />

            <PerformanceCard
              icon="star-outline"
              value="4.9"
              label="Rating"
            />
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Recent earnings
            </Text>

            <Text style={styles.sectionCaption}>
              {completedDeliveries.length}{' '}
              {completedDeliveries.length === 1
                ? 'delivery'
                : 'deliveries'}
            </Text>
          </View>

          {completedDeliveries.length === 0 ? (
            <EmptyEarnings />
          ) : (
            <View style={styles.transactionsCard}>
              {completedDeliveries.map(
                (delivery, index) => (
                  <TransactionRow
                    key={delivery.id}
                    delivery={delivery}
                    last={
                      index ===
                      completedDeliveries.length - 1
                    }
                  />
                ),
              )}
            </View>
          )}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Payout
            </Text>
          </View>

          <View style={styles.payoutCard}>
            <View style={styles.payoutIcon}>
              <Ionicons
                name="wallet-outline"
                size={23}
                color={ORANGE}
              />
            </View>

            <View style={styles.payoutContent}>
              <Text style={styles.payoutTitle}>
                Available balance
              </Text>

              <Text style={styles.payoutDescription}>
                Earnings ready for your next payout
              </Text>
            </View>

            <Text style={styles.payoutAmount}>
              ${earnings.toFixed(2)}
            </Text>
          </View>

          <View style={styles.payoutNotice}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={MUTED}
            />

            <Text style={styles.payoutNoticeText}>
              Payout processing will be connected when
              the Signatures payment backend is added.
            </Text>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function PeriodButton({
  title,
  active,
  onPress,
}: {
  title: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.periodButton,
        active && styles.periodButtonActive,
      ]}
    >
      <Text
        style={[
          styles.periodButtonText,
          active && styles.periodButtonTextActive,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

function PerformanceCard({
  icon,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.performanceCard}>
      <View style={styles.performanceIcon}>
        <Ionicons
          name={icon}
          size={20}
          color={ORANGE}
        />
      </View>

      <Text style={styles.performanceValue}>
        {value}
      </Text>

      <Text style={styles.performanceLabel}>
        {label}
      </Text>
    </View>
  );
}

function TransactionRow({
  delivery,
  last,
}: {
  delivery: Delivery;
  last: boolean;
}) {
  return (
    <View
      style={[
        styles.transaction,
        !last && styles.transactionBorder,
      ]}
    >
      <View style={styles.transactionIcon}>
        <Ionicons
          name="checkmark"
          size={18}
          color={GREEN}
        />
      </View>

      <View style={styles.transactionContent}>
        <Text style={styles.transactionOrder}>
          {delivery.orderId}
        </Text>

        <Text style={styles.transactionCustomer}>
          {delivery.customerName} {' '}
          {delivery.customerAddress}
        </Text>

        <View style={styles.transactionMeta}>
          <Ionicons
            name="navigate-outline"
            size={12}
            color={MUTED}
          />

          <Text style={styles.transactionMetaText}>
            {delivery.deliveryDistance.toFixed(1)} km
          </Text>

          <View style={styles.metaDot} />

          <Text style={styles.transactionMetaText}>
            Delivered
          </Text>
        </View>
      </View>

      <View style={styles.transactionRight}>
        <Text style={styles.transactionAmount}>
          +${delivery.earnings.toFixed(2)}
        </Text>

        <Text style={styles.transactionStatus}>
          Earned
        </Text>
      </View>
    </View>
  );
}

function EmptyEarnings() {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons
          name="cash-outline"
          size={32}
          color={ORANGE}
        />
      </View>

      <Text style={styles.emptyTitle}>
        No earnings yet
      </Text>

      <Text style={styles.emptyDescription}>
        Complete your first delivery and your earnings
        will appear here automatically.
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 16,
  },

  brand: {
    color: ORANGE,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  title: {
    color: BLACK,
    fontSize: 30,
    fontWeight: '900',
    marginTop: 3,
  },

  walletButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },

  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#ECECEF',
    borderRadius: 15,
    padding: 4,
    marginBottom: 16,
  },

  periodButton: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  periodButtonActive: {
    backgroundColor: '#FFF',
  },

  periodButtonText: {
    color: MUTED,
    fontWeight: '700',
    fontSize: 13,
  },

  periodButtonTextActive: {
    color: BLACK,
    fontWeight: '900',
  },

  scrollContent: {
    paddingBottom: 20,
  },

  heroCard: {
    backgroundColor: BLACK,
    borderRadius: 24,
    padding: 20,
  },

  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  heroLabel: {
    color: '#A8A8AE',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },

  heroAmount: {
    color: '#FFF',
    fontSize: 38,
    fontWeight: '900',
    marginTop: 5,
  },

  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#1A1A1F',
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroDivider: {
    height: 1,
    backgroundColor: '#29292E',
    marginVertical: 18,
  },

  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  heroStat: {
    flex: 1,
    alignItems: 'center',
  },

  heroStatValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },

  heroStatLabel: {
    color: '#99999F',
    fontSize: 9,
    marginTop: 4,
    textAlign: 'center',
  },

  verticalDivider: {
    height: 34,
    width: 1,
    backgroundColor: '#29292E',
  },

  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    color: BLACK,
    fontSize: 18,
    fontWeight: '900',
  },

  sectionCaption: {
    color: MUTED,
    fontSize: 12,
    fontWeight: '600',
  },

  performanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  performanceCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    padding: 15,
  },

  performanceIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFF1EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  performanceValue: {
    color: BLACK,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 12,
  },

  performanceLabel: {
    color: MUTED,
    fontSize: 11,
    marginTop: 3,
  },

  transactionsCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    paddingHorizontal: 15,
  },

  transaction: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
  },

  transactionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  transactionIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#EFFAF4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  transactionContent: {
    flex: 1,
    marginLeft: 11,
    paddingRight: 8,
  },

  transactionOrder: {
    color: BLACK,
    fontWeight: '900',
    fontSize: 14,
  },

  transactionCustomer: {
    color: MUTED,
    fontSize: 11,
    marginTop: 3,
  },

  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },

  transactionMetaText: {
    color: MUTED,
    fontSize: 10,
  },

  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#B7B7BC',
    marginHorizontal: 2,
  },

  transactionRight: {
    alignItems: 'flex-end',
  },

  transactionAmount: {
    color: GREEN,
    fontWeight: '900',
    fontSize: 14,
  },

  transactionStatus: {
    color: MUTED,
    fontSize: 10,
    marginTop: 4,
  },

  payoutCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  payoutIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFF1EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  payoutContent: {
    flex: 1,
    marginLeft: 12,
  },

  payoutTitle: {
    color: BLACK,
    fontWeight: '900',
    fontSize: 14,
  },

  payoutDescription: {
    color: MUTED,
    fontSize: 10,
    marginTop: 3,
  },

  payoutAmount: {
    color: BLACK,
    fontWeight: '900',
    fontSize: 17,
  },

  payoutNotice: {
    flexDirection: 'row',
    gap: 8,
    padding: 14,
    marginTop: 10,
  },

  payoutNoticeText: {
    flex: 1,
    color: MUTED,
    fontSize: 11,
    lineHeight: 16,
  },

  empty: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#FFF1EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    color: BLACK,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 15,
  },

  emptyDescription: {
    color: MUTED,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
    maxWidth: 270,
  },
});
