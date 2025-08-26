import { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { router, useSegments } from 'expo-router';
import { useUserStore } from '@/stores';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading } = useUserStore();
  const segments = useSegments();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // User is not authenticated and trying to access protected routes
      router.replace('/(auth)/welcome');
    } else if (isAuthenticated && inAuthGroup) {
      // User is authenticated but still on auth screens
      router.replace('/(tabs)/dashboard');
    }
  }, [isAuthenticated, segments, isLoading]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <View className="w-16 h-16 bg-primary-500 rounded-2xl items-center justify-center mb-4">
          <Text className="text-white font-JakartaBold text-xl">V</Text>
        </View>
        <ActivityIndicator size="large" color="#43d478" />
        <Text className="text-gray-600 font-Jakarta mt-4">Velto laden...</Text>
      </View>
    );
  }

  return <>{children}</>;
}
