import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const ORANGE = '#FF5A1F';
const BLACK = '#0B0B0F';
const BACKGROUND = '#F7F7F8';
const BORDER = '#E8E8EA';
const MUTED = '#6E6E73';
const GREEN = '#2E9D63';
const RED = '#D92D20';

export function ProfileScreen() {
  const [online, setOnline] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Log out?',
      'Are you sure you want to log out of Signatures Driver?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Demo mode',
              'Authentication will be connected when we add the backend.',
            );
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>
              SIGNATURES DRIVER
            </Text>

            <Text style={styles.title}>
              Profile
            </Text>
          </View>

          <Pressable style={styles.settingsButton}>
            <Ionicons
              name="settings-outline"
              size={22}
              color={BLACK}
            />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.profileCard}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  TM
                </Text>
              </View>

              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: online
                      ? GREEN
                      : MUTED,
                  },
                ]}
              />
            </View>

            <Text style={styles.driverName}>
              Tawanda Moyo
            </Text>

            <Text style={styles.driverId}>
              Driver ID: DRV-001
            </Text>

            <View
              style={[
                styles.statusPill,
                online
                  ? styles.statusPillOnline
                  : styles.statusPillOffline,
              ]}
            >
              <View
                style={[
                  styles.smallStatusDot,
                  {
                    backgroundColor: online
                      ? GREEN
                      : MUTED,
                  },
                ]}
              />

              <Text
                style={[
                  styles.statusPillText,
                  {
                    color: online
                      ? GREEN
                      : MUTED,
                  },
                ]}
              >
                {online ? 'Online' : 'Offline'}
              </Text>
            </View>

            <View style={styles.profileStats}>
              <ProfileStat
                value="4.9"
                label="Rating"
                icon="star"
              />

              <View style={styles.statDivider} />

              <ProfileStat
                value="24"
                label="Today"
                icon="bicycle"
              />

              <View style={styles.statDivider} />

              <ProfileStat
                value="98%"
                label="Completion"
                icon="checkmark-circle"
              />
            </View>
          </View>

          <View style={styles.onlineCard}>
            <View style={styles.onlineLeft}>
              <View
                style={[
                  styles.onlineIcon,
                  online && styles.onlineIconActive,
                ]}
              >
                <Ionicons
                  name={
                    online
                      ? 'radio'
                      : 'radio-outline'
                  }
                  size={23}
                  color={online ? GREEN : MUTED}
                />
              </View>

              <View style={styles.onlineContent}>
                <Text style={styles.onlineTitle}>
                  Driver availability
                </Text>

                <Text style={styles.onlineDescription}>
                  {online
                    ? 'You can receive new delivery requests.'
                    : 'You will not receive new deliveries.'}
                </Text>
              </View>
            </View>

            <Switch
              value={online}
              onValueChange={setOnline}
              trackColor={{
                false: '#D7D7DB',
                true: '#B9E4CC',
              }}
              thumbColor={
                online ? GREEN : '#FFFFFF'
              }
            />
          </View>

          <SectionTitle title="Driver information" />

          <View style={styles.sectionCard}>
            <InfoRow
              icon="call-outline"
              label="Phone"
              value="+263 77 123 4567"
            />

            <Divider />

            <InfoRow
              icon="mail-outline"
              label="Email"
              value="tawanda@signatures.co.zw"
            />

            <Divider />

            <InfoRow
              icon="location-outline"
              label="Branch"
              value="Signatures Bulawayo"
            />
          </View>

          <SectionTitle title="Vehicle" />

          <View style={styles.vehicleCard}>
            <View style={styles.vehicleIcon}>
              <Ionicons
                name="bicycle"
                size={27}
                color={ORANGE}
              />
            </View>

            <View style={styles.vehicleContent}>
              <Text style={styles.vehicleName}>
                Motorbike
              </Text>

              <Text style={styles.vehicleRegistration}>
                ABC 1234
              </Text>
            </View>

            <View style={styles.verifiedBadge}>
              <Ionicons
                name="checkmark-circle"
                size={15}
                color={GREEN}
              />

              <Text style={styles.verifiedText}>
                Verified
              </Text>
            </View>
          </View>

          <SectionTitle title="Preferences" />

          <View style={styles.sectionCard}>
            <View style={styles.preferenceRow}>
              <View style={styles.rowIcon}>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color={BLACK}
                />
              </View>

              <View style={styles.preferenceContent}>
                <Text style={styles.rowTitle}>
                  Notifications
                </Text>

                <Text style={styles.rowSubtitle}>
                  Delivery requests and updates
                </Text>
              </View>

              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{
                  false: '#D7D7DB',
                  true: '#FFD2C2',
                }}
                thumbColor={
                  notifications
                    ? ORANGE
                    : '#FFFFFF'
                }
              />
            </View>

            <Divider />

            <MenuRow
              icon="language-outline"
              title="Language"
              value="English"
              onPress={() =>
                Alert.alert(
                  'Language',
                  'Language selection will be added here.',
                )
              }
            />

            <Divider />

            <MenuRow
              icon="map-outline"
              title="Navigation"
              value="Default maps"
              onPress={() =>
                Alert.alert(
                  'Navigation',
                  'Map preference will be connected when navigation is added.',
                )
              }
            />
          </View>

          <SectionTitle title="Account & support" />

          <View style={styles.sectionCard}>
            <MenuRow
              icon="person-outline"
              title="Edit profile"
              onPress={() =>
                Alert.alert(
                  'Edit profile',
                  'Profile editing will be connected to the driver account.',
                )
              }
            />

            <Divider />

            <MenuRow
              icon="document-text-outline"
              title="Delivery history"
              onPress={() =>
                Alert.alert(
                  'Delivery history',
                  'Your completed deliveries are already available from the delivery records.',
                )
              }
            />

            <Divider />

            <MenuRow
              icon="help-circle-outline"
              title="Help & support"
              onPress={() =>
                Alert.alert(
                  'Help & support',
                  'Signatures Driver support will appear here.',
                )
              }
            />

            <Divider />

            <MenuRow
              icon="shield-checkmark-outline"
              title="Privacy & security"
              onPress={() =>
                Alert.alert(
                  'Privacy & security',
                  'Security settings will be available after authentication is connected.',
                )
              }
            />
          </View>

          <Pressable
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color={RED}
            />

            <Text style={styles.logoutText}>
              Log out
            </Text>
          </Pressable>

          <Text style={styles.version}>
            Signatures Driver  Version 1.0.0
          </Text>

          <View style={{ height: 120 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function ProfileStat({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.profileStat}>
      <View style={styles.profileStatTop}>
        <Ionicons
          name={icon}
          size={15}
          color={ORANGE}
        />

        <Text style={styles.profileStatValue}>
          {value}
        </Text>
      </View>

      <Text style={styles.profileStatLabel}>
        {label}
      </Text>
    </View>
  );
}

function SectionTitle({
  title,
}: {
  title: string;
}) {
  return (
    <Text style={styles.sectionTitle}>
      {title}
    </Text>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.rowIcon}>
        <Ionicons
          name={icon}
          size={20}
          color={BLACK}
        />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text style={styles.infoValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function MenuRow({
  icon,
  title,
  value,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuRow,
        pressed && styles.menuRowPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.rowIcon}>
        <Ionicons
          name={icon}
          size={20}
          color={BLACK}
        />
      </View>

      <Text style={styles.menuTitle}>
        {title}
      </Text>

      {value && (
        <Text style={styles.menuValue}>
          {value}
        </Text>
      )}

      <Ionicons
        name="chevron-forward"
        size={18}
        color="#B0B0B5"
      />
    </Pressable>
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

  settingsButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: {
    paddingBottom: 20,
  },

  profileCard: {
    backgroundColor: BLACK,
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
  },

  avatarWrapper: {
    position: 'relative',
  },

  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#FFF',
    fontSize: 25,
    fontWeight: '900',
  },

  statusDot: {
    position: 'absolute',
    right: 2,
    bottom: 3,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: BLACK,
  },

  driverName: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 14,
  },

  driverId: {
    color: '#99999F',
    fontSize: 12,
    marginTop: 4,
  },

  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
    marginTop: 11,
  },

  statusPillOnline: {
    backgroundColor: '#173527',
  },

  statusPillOffline: {
    backgroundColor: '#28282D',
  },

  smallStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
  },

  profileStats: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#29292E',
  },

  profileStat: {
    flex: 1,
    alignItems: 'center',
  },

  profileStatTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  profileStatValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },

  profileStatLabel: {
    color: '#99999F',
    fontSize: 10,
    marginTop: 4,
  },

  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#29292E',
  },

  onlineCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },

  onlineLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  onlineIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F1F1F3',
    alignItems: 'center',
    justifyContent: 'center',
  },

  onlineIconActive: {
    backgroundColor: '#EFFAF4',
  },

  onlineContent: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 8,
  },

  onlineTitle: {
    color: BLACK,
    fontSize: 14,
    fontWeight: '900',
  },

  onlineDescription: {
    color: MUTED,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },

  sectionTitle: {
    color: BLACK,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 24,
    marginBottom: 11,
  },

  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 15,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },

  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F3F3F5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoContent: {
    marginLeft: 12,
    flex: 1,
  },

  infoLabel: {
    color: MUTED,
    fontSize: 10,
    fontWeight: '700',
  },

  infoValue: {
    color: BLACK,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginLeft: 50,
  },

  vehicleCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  vehicleIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#FFF1EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  vehicleContent: {
    flex: 1,
    marginLeft: 13,
  },

  vehicleName: {
    color: BLACK,
    fontSize: 15,
    fontWeight: '900',
  },

  vehicleRegistration: {
    color: MUTED,
    fontSize: 12,
    marginTop: 3,
  },

  verifiedBadge: {
    backgroundColor: '#EFFAF4',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 999,
  },

  verifiedText: {
    color: GREEN,
    fontSize: 10,
    fontWeight: '800',
  },

  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
  },

  preferenceContent: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 8,
  },

  rowTitle: {
    color: BLACK,
    fontSize: 13,
    fontWeight: '800',
  },

  rowSubtitle: {
    color: MUTED,
    fontSize: 10,
    marginTop: 3,
  },

  menuRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuRowPressed: {
    opacity: 0.6,
  },

  menuTitle: {
    flex: 1,
    color: BLACK,
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 12,
  },

  menuValue: {
    color: MUTED,
    fontSize: 11,
    marginRight: 7,
  },

  logoutButton: {
    height: 54,
    borderRadius: 17,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F3D4D1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  },

  logoutText: {
    color: RED,
    fontSize: 14,
    fontWeight: '900',
  },

  version: {
    color: '#A0A0A6',
    textAlign: 'center',
    fontSize: 10,
    marginTop: 18,
  },
});
