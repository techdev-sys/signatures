import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import { DeliveriesScreen } from '../features/deliveries/screens/DeliveriesScreen';
import { EarningsScreen } from '../features/earnings/screens/EarningsScreen';
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';
import { theme } from '../theme/theme';

export type DriverTabParamList = {
  Home: undefined;
  Deliveries: undefined;
  Earnings: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<DriverTabParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: '#8D8D93',
          tabBarStyle: {
            position: 'absolute',
            left: 18,
            right: 18,
            bottom: 14,
            height: 72,
            paddingTop: 8,
            paddingBottom: 8,
            borderTopWidth: 0,
            borderRadius: 26,
            backgroundColor: theme.colors.black,
          },
          tabBarLabelStyle: {
            fontSize: 9,
            fontWeight: '700',
          },
          tabBarIcon: ({ color, size }) => {
            let icon: keyof typeof Ionicons.glyphMap = 'home';

            if (route.name === 'Deliveries') {
              icon = 'bicycle';
            }

            if (route.name === 'Earnings') {
              icon = 'wallet';
            }

            if (route.name === 'Profile') {
              icon = 'person';
            }

            return <Ionicons name={icon} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Deliveries" component={DeliveriesScreen} />
        <Tab.Screen name="Earnings" component={EarningsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
