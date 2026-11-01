import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DeliveryProvider } from './src/context/DeliveryContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <DeliveryProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </DeliveryProvider>
    </SafeAreaProvider>
  );
}
