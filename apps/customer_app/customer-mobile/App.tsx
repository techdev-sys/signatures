import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { CheckoutProvider } from './src/context/CheckoutContext';
import { OrderProvider } from './src/context/OrderContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <OrderProvider>
          <CartProvider>
            <CheckoutProvider>
              <StatusBar style="dark" />
              <AppNavigator />
            </CheckoutProvider>
          </CartProvider>
        </OrderProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
