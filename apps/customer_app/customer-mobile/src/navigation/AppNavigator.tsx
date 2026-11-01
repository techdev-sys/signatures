import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { AuthScreen } from '../features/auth/screens/AuthScreen';
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { SearchScreen } from '../features/search/screens/SearchScreen';
import { OrdersScreen } from '../features/orders/screens/OrdersScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';

import { RestaurantScreen } from '../features/restaurant/screens/RestaurantScreen';
import { FoodDetailsScreen } from '../features/food/screens/FoodDetailsScreen';
import { CartScreen } from '../features/cart/screens/CartScreen';
import { CheckoutScreen } from '../features/checkout/screens/CheckoutScreen';

import { AddressScreen } from '../features/address/screens/AddressScreen';
import { PaymentScreen } from '../features/payment/screens/PaymentScreen';
import { OrderConfirmationScreen } from '../features/order-confirmation/screens/OrderConfirmationScreen';
import { OrderTrackingScreen } from '../features/order-tracking/screens/OrderTrackingScreen';

import { colors } from '../theme/theme';

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  Restaurant: undefined;
  FoodDetails: {
    name: string;
    price: string;
    image: string;
  };
  Cart: undefined;
  Checkout: undefined;
  Address: undefined;
  Payment: undefined;
  OrderConfirmation: {
    orderId: string;
  };
  OrderTracking: {
    orderId: string;
  };
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#9B9BA1',

        tabBarStyle: {
          position: 'absolute',
          left: 18,
          right: 18,
          bottom: 14,
          height: 72,
          borderRadius: 26,
          backgroundColor: colors.black,
          borderTopWidth: 0,
          elevation: 8,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginBottom: 8,
        },

        tabBarItemStyle: {
          paddingTop: 8,
        },

        tabBarIcon: ({ color, focused, size }) => {
          let iconName:
            | 'home'
            | 'home-outline'
            | 'search'
            | 'search-outline'
            | 'receipt'
            | 'receipt-outline'
            | 'person'
            | 'person-outline';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <Ionicons
              name={iconName}
              size={focused ? 22 : size}
              color={focused ? colors.primary : color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { customer, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {customer ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Restaurant" component={RestaurantScreen} />
            <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen
              name="OrderConfirmation"
              component={OrderConfirmationScreen}
            />
            <Stack.Screen
              name="OrderTracking"
              component={OrderTrackingScreen}
            />
            <Stack.Screen
              name="Address"
              component={AddressScreen}
            />
            <Stack.Screen
              name="Payment"
              component={PaymentScreen}
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});






