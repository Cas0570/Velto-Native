import { Redirect } from 'expo-router';
import { useUserStore } from '@/stores';
import { View, ActivityIndicator, Text } from 'react-native';
import { useEffect, useState } from 'react';

export default function Index() {
  const { isAuthenticated, isLoading, user } = useUserStore();
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    setDebugInfo(
      `Auth: ${isAuthenticated}, Loading: ${isLoading}, User: ${user?.name || 'none'}`
    );
  }, [isAuthenticated, isLoading, user]);

  // Show loading while checking authentication state
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#43d478" />
        <Text className="text-gray-600 font-Jakarta mt-2">
          Authenticatie controleren...
        </Text>
        {__DEV__ && (
          <Text className="text-xs text-gray-400 mt-4 text-center px-4">
            Debug: {debugInfo}
          </Text>
        )}
      </View>
    );
  }

  // Redirect based on authentication state
  if (isAuthenticated && user) {
    return <Redirect href="/(tabs)/dashboard" />;
  } else {
    return <Redirect href="/(auth)/welcome" />;
  }
}
