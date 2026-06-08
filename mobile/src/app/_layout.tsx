import { Stack } from 'expo-router';
import "../../global.css";
import { verifyInstallation } from 'nativewind';
import {CartProvider} from '../contexts/CartContext';

// Verify Nativewind installation early at module load
verifyInstallation();

export default function Layout() {
  return (
    <CartProvider>
      <Stack>
        <Stack.Screen
          name="index" 
          options={{ title: 'MVP Delivery' }} 
        />
        <Stack.Screen 
          name="restaurant/[id]" 
          options={{ title: 'Cardápio' }} 
        />
        <Stack.Screen 
          name="cart" 
          options={{ title: 'Seu Carrinho', presentation: 'modal' }} 
        />
      </Stack>
    </CartProvider>
  );
}