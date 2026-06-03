import { Stack } from 'expo-router';
import "../../global.css";
import { verifyInstallation } from 'nativewind';

// Verify Nativewind installation early at module load
verifyInstallation();

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index" 
        options={{ title: 'MVP Delivery' }} 
      />
      <Stack.Screen 
        name="restaurant/[id]" 
        options={{ title: 'Cardápio' }} 
      />
    </Stack>
  );
}