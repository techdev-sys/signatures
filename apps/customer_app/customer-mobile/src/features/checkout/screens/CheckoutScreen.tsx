import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCart } from '../../../context/CartContext';
import { useCheckout } from '../../../context/CheckoutContext';
import { useOrders } from '../../../context/OrderContext';
import type { RootStackParamList } from '../../../navigation/AppNavigator';
import {
  createOrder,
  getOrderTracking,
  mapApiOrder,
} from '../../../services/ordersApi';
import { colors, radius, spacing } from '../../../theme/theme';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const DELIVERY_FEE = 2.5;

export function CheckoutScreen() {
  const navigation = useNavigation<Navigation>();
  const { items, subtotal, itemCount, clearCart } = useCart();
  const { address, paymentMethod, resetCheckout } = useCheckout();
  const { addOrder } = useOrders();
  const [submitting, setSubmitting] =
    useState(false);

  const total = subtotal + DELIVERY_FEE;

  const placeOrder = async () => {
    if (!address || !paymentMethod) {
      return;
    }

    try {
      setSubmitting(true);

      const createdOrder = await createOrder({
        branchCode: 'SIG-CHT-001',
        orderType: 'delivery',
        deliveryAddress: address.address,
        paymentMethod: paymentMethod.id,
        items: items.map((item) => ({
          itemName: item.name,
          variantName: [
            item.size,
            ...item.extras.map((extra) => extra.name),
          ]
            .filter(Boolean)
            .join(', ') || undefined,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });

      const trackedOrder = await getOrderTracking(
        createdOrder.order_number,
      );

      addOrder(mapApiOrder(trackedOrder));

      clearCart();
      resetCheckout();

      navigation.replace('OrderConfirmation', {
        orderId: createdOrder.order_number,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Could not place your order.';

      console.error('Failed to place order:', error);

      Alert.alert('Order not placed', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
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
            Checkout
          </Text>

          <View style={styles.placeholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <Text style={styles.sectionTitle}>
            Delivery address
          </Text>

          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate('Address')}
          >
            <View style={styles.icon}>
              <Ionicons
                name="location-outline"
                size={21}
                color={colors.primary}
              />
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>
                {address?.label ?? 'Select delivery address'}
              </Text>

              <Text style={styles.cardDescription}>
                {address?.address ??
                  'Choose where you would like your order delivered.'}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>

          <Text style={styles.sectionTitle}>
            Delivery time
          </Text>

          <View style={styles.card}>
            <View style={styles.icon}>
              <Ionicons
                name="time-outline"
                size={21}
                color={colors.primary}
              />
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>
                As soon as possible
              </Text>

              <Text style={styles.cardDescription}>
                Estimated delivery in 20â€“30 minutes
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>
            Payment
          </Text>

          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate('Payment')}
          >
            <View style={styles.icon}>
              <Ionicons
                name="card-outline"
                size={21}
                color={colors.primary}
              />
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>
                {paymentMethod?.label ??
                  'Select payment method'}
              </Text>

              <Text style={styles.cardDescription}>
                {paymentMethod?.detail ??
                  'Choose your preferred way to pay.'}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>

          <Text style={styles.sectionTitle}>
            Order summary
          </Text>

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Items ({itemCount})
              </Text>

              <Text style={styles.summaryValue}>
                ${subtotal.toFixed(2)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Delivery
              </Text>

              <Text style={styles.summaryValue}>
                ${DELIVERY_FEE.toFixed(2)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>
                Total
              </Text>

              <Text style={styles.total}>
                ${total.toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>

        <SafeAreaView
          edges={['bottom']}
          style={styles.bottomArea}
        >
          <Pressable
            style={[
              styles.placeOrderButton,
              (!address || !paymentMethod || submitting) &&
                styles.placeOrderDisabled,
            ]}
            disabled={!address || !paymentMethod || submitting}
            onPress={() => void placeOrder()}
          >
            <View>
              <Text style={styles.buttonCaption}>
                TOTAL
              </Text>

              <Text style={styles.buttonPrice}>
                ${total.toFixed(2)}
              </Text>
            </View>

            <View style={styles.buttonRight}>
              <Text style={styles.buttonText}>
                {submitting
                  ? 'Placing order...'
                  : 'Place order'}
              </Text>

              <Ionicons
                name="arrow-forward"
                size={19}
                color="#FFFFFF"
              />
            </View>
          </Pressable>
        </SafeAreaView>
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
    paddingTop: 8,
  },

  sectionTitle: {
    marginTop: 23,
    marginBottom: 12,
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },

  card: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF0EA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardContent: {
    flex: 1,
    marginHorizontal: 12,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },

  cardDescription: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: colors.textSecondary,
  },

  summary: {
    padding: 18,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  summaryRow: {
    flexDirection: 'row',
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

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },

  total: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.primary,
  },

  bottomSpace: {
    height: 120,
  },

  bottomArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: 12,
    backgroundColor: 'rgba(247,247,248,0.97)',
  },

  placeOrderButton: {
    minHeight: 68,
    paddingHorizontal: 20,
    borderRadius: radius.xl,
    backgroundColor: colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  placeOrderDisabled: {
    opacity: 0.4,
  },

  buttonCaption: {
    color: '#A8A8AD',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },

  buttonPrice: {
    marginTop: 2,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },

  buttonRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});






