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
  DeliveryAddress,
  useCheckout,
} from '../../../context/CheckoutContext';

import { colors, radius, spacing } from '../../../theme/theme';

const addresses: DeliveryAddress[] = [
  {
    id: 'home',
    label: 'Home',
    address: 'Bulawayo, Zimbabwe',
  },
  {
    id: 'work',
    label: 'Work',
    address: 'Bulawayo CBD, Zimbabwe',
  },
];

export function AddressScreen() {
  const navigation = useNavigation();
  const { address, setAddress } = useCheckout();

  const selectAddress = (item: DeliveryAddress) => {
    setAddress(item);
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
          Delivery address
        </Text>

        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.heading}>
          Where should we deliver?
        </Text>

        <Text style={styles.description}>
          Select one of your saved delivery addresses.
        </Text>

        <View style={styles.list}>
          {addresses.map((item) => {
            const selected = address?.id === item.id;

            return (
              <Pressable
                key={item.id}
                style={[
                  styles.addressCard,
                  selected && styles.selectedCard,
                ]}
                onPress={() => selectAddress(item)}
              >
                <View
                  style={[
                    styles.icon,
                    selected && styles.selectedIcon,
                  ]}
                >
                  <Ionicons
                    name={
                      item.id === 'home'
                        ? 'home-outline'
                        : 'business-outline'
                    }
                    size={21}
                    color={
                      selected
                        ? '#FFFFFF'
                        : colors.primary
                    }
                  />
                </View>

                <View style={styles.addressContent}>
                  <Text style={styles.addressLabel}>
                    {item.label}
                  </Text>

                  <Text style={styles.address}>
                    {item.address}
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

        <Pressable style={styles.addAddress}>
          <Ionicons
            name="add"
            size={20}
            color={colors.primary}
          />

          <Text style={styles.addAddressText}>
            Add new address
          </Text>
        </Pressable>
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
    lineHeight: 21,
    color: colors.textSecondary,
  },

  list: {
    marginTop: 26,
    gap: 12,
  },

  addressCard: {
    minHeight: 82,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  selectedCard: {
    borderColor: colors.primary,
  },

  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF0EA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedIcon: {
    backgroundColor: colors.primary,
  },

  addressContent: {
    flex: 1,
    marginHorizontal: 12,
  },

  addressLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },

  address: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSecondary,
  },

  addAddress: {
    minHeight: 52,
    marginTop: 18,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  addAddressText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
});