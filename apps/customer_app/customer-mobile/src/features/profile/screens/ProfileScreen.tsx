import { Ionicons } from '@expo/vector-icons';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../../context/AuthContext';
import { colors, radius } from '../../../theme/theme';

const options = [
  { label: 'Personal details', icon: 'person-outline' },
  { label: 'Saved addresses', icon: 'location-outline' },
  { label: 'Payment methods', icon: 'card-outline' },
  { label: 'Favourites', icon: 'heart-outline' },
  { label: 'Notifications', icon: 'notifications-outline' },
  { label: 'Settings', icon: 'settings-outline' },
] as const;

export function ProfileScreen() {
  const { customer, signOut } = useAuth();

  const confirmSignOut = () => {
    Alert.alert(
      'Log out?',
      'You will need to log in again to access your orders.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: () => {
            void signOut().catch((error) => {
              Alert.alert(
                'Could not log out',
                error instanceof Error
                  ? error.message
                  : 'Please try again.',
              );
            });
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.eyebrow}>YOUR ACCOUNT</Text>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.user}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={27} color="#FFFFFF" />
        </View>

        <View style={styles.userDetails}>
          <Text style={styles.name}>
            {customer?.fullName ?? 'Customer'}
          </Text>
          <Text style={styles.subtitle}>
            {customer?.email ?? customer?.phone ?? ''}
          </Text>
          {customer?.phone && (
            <Text style={styles.phone}>{customer.phone}</Text>
          )}
        </View>
      </View>

      <View style={styles.menu}>
        {options.map((option, index) => (
          <Pressable
            key={option.label}
            style={[
              styles.row,
              index !== options.length - 1 && styles.rowBorder,
            ]}
          >
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}>
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={colors.text}
                />
              </View>

              <Text style={styles.rowText}>{option.label}</Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={19}
              color={colors.textSecondary}
            />
          </Pressable>
        ))}
      </View>

      <Pressable
        style={styles.logoutButton}
        onPress={confirmSignOut}
      >
        <Ionicons
          name="log-out-outline"
          size={20}
          color="#D92D20"
        />

        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: colors.primary,
  },
  title: {
    marginTop: 7,
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
  },
  user: {
    marginTop: 26,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    marginTop: 3,
    fontSize: 13,
    color: colors.textSecondary,
  },
  phone: {
    marginTop: 2,
    fontSize: 11,
    color: colors.textSecondary,
  },
  menu: {
    marginTop: 28,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    minHeight: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  logoutButton: {
    height: 54,
    marginTop: 20,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#F3D4D1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    color: '#D92D20',
    fontSize: 14,
    fontWeight: '900',
  },
});
