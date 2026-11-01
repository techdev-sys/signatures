import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  PaymentMethod,
  useCheckout,
} from '../../../context/CheckoutContext';

import { colors, radius, spacing } from '../../../theme/theme';

const methods: PaymentMethod[] = [
  {
    id: 'cash',
    label: 'Cash on delivery',
    detail: 'Pay when your order arrives',
    icon: 'cash-outline',
  },
  {
    id: 'mobile',
    label: 'Mobile payment',
    detail: 'Pay using supported mobile money',
    icon: 'phone-portrait-outline',
  },
  {
    id: 'card',
    label: 'Debit or credit card',
    detail: 'Visa or Mastercard',
    icon: 'card-outline',
  },
];

export function PaymentScreen() {
  const navigation = useNavigation();

  const {
    paymentMethod,
    setPaymentMethod,
  } = useCheckout();

  const selectMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
    navigation.goBack();
  };

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

        <Text style={styles.title}>
          Payment
        </Text>

        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.heading}>
          How would you like to pay?
        </Text>

        <Text style={styles.description}>
          Select a payment method for this order.
        </Text>

        <View style={styles.list}>
          {methods.map((method) => {
            const selected =
              paymentMethod?.id === method.id;

            return (
              <Pressable
                key={method.id}
                style={[
                  styles.method,
                  selected && styles.methodSelected,
                ]}
                onPress={() => selectMethod(method)}
              >
                <View
                  style={[
                    styles.methodIcon,
                    selected &&
                      styles.methodIconSelected,
                  ]}
                >
                  <Ionicons
                    name={method.icon}
                    size={22}
                    color={
                      selected
                        ? '#FFFFFF'
                        : colors.primary
                    }
                  />
                </View>

                <View style={styles.methodContent}>
                  <Text style={styles.methodName}>
                    {method.label}
                  </Text>

                  <Text style={styles.methodDetail}>
                    {method.detail}
                  </Text>
                </View>

                <Ionicons
                  name={
                    selected
                      ? 'checkmark-circle'
                      : 'ellipse-outline'
                  }
                  size={24}
                  color={
                    selected
                      ? colors.primary
                      : colors.textSecondary
                  }
                />
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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

  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },

  content: {
    padding: spacing.xl,
  },

  heading: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    color: colors.text,
  },

  description: {
    marginTop: 7,
    fontSize: 14,
    color: colors.textSecondary,
  },

  list: {
    marginTop: 26,
    gap: 12,
  },

  method: {
    minHeight: 82,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  methodSelected: {
    borderColor: colors.primary,
  },

  methodIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF0EA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  methodIconSelected: {
    backgroundColor: colors.primary,
  },

  methodContent: {
    flex: 1,
    marginHorizontal: 12,
  },

  methodName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },

  methodDetail: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSecondary,
  },
});