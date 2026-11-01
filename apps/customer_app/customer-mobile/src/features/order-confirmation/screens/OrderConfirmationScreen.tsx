import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../../../navigation/AppNavigator';
import { colors, radius } from '../../../theme/theme';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'OrderConfirmation'
>;

type Navigation =
  NativeStackNavigationProp<RootStackParamList>;

export function OrderConfirmationScreen() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<Props['route']>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.success}>
          <Ionicons
            name="checkmark"
            size={42}
            color="#FFFFFF"
          />
        </View>

        <Text style={styles.title}>
          Order confirmed!
        </Text>

        <Text style={styles.description}>
          Signatures has received your order.
          We&apos;ll keep you updated as it&apos;s
          prepared and sent your way.
        </Text>

        <View style={styles.estimate}>
          <Ionicons
            name="time-outline"
            size={20}
            color={colors.primary}
          />

          <View>
            <Text style={styles.estimateLabel}>
              ESTIMATED DELIVERY
            </Text>

            <Text style={styles.estimateTime}>
              20â€“30 minutes
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.trackButton}
          onPress={() =>
            navigation.replace('OrderTracking', {
              orderId: route.params.orderId,
            })
          }
        >
          <Text style={styles.trackText}>
            Track your order
          </Text>

          <Ionicons
            name="arrow-forward"
            size={19}
            color="#FFFFFF"
          />
        </Pressable>

        <Pressable
          onPress={() =>
            navigation.navigate('MainTabs')
          }
        >
          <Text style={styles.homeText}>
            Back to home
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
    padding: 24,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  success: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    marginTop: 28,
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },

  description: {
    maxWidth: 330,
    marginTop: 12,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  estimate: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },

  estimateLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    color: colors.textSecondary,
  },

  estimateTime: {
    marginTop: 3,
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },

  actions: {
    gap: 18,
    alignItems: 'center',
  },

  trackButton: {
    width: '100%',
    minHeight: 62,
    borderRadius: radius.xl,
    backgroundColor: colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  trackText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  homeText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
});

