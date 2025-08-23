import { Stack, router } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

const RootLayout = () => {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Redirect to auth if not authenticated
    if (!isAuthenticated || !user) {
      router.replace('/(auth)/welcome');
    }
  }, [isAuthenticated, user]);

  // Don't render anything if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default RootLayout;
