import { Alert, Image, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

import CustomButton from '@/components/CustomButton';
import { icons } from '@/constants';
import { useUserStore } from '@/stores';

const OAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useUserStore();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      // Simulate OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful Google sign-in
      const success = await signIn(
        'google-user@gmail.com',
        'google-auth-token'
      );

      if (success) {
        router.replace('/(tabs)/dashboard');
      } else {
        Alert.alert(
          'Inloggen mislukt',
          'Er is een probleem opgetreden met Google inloggen. Probeer opnieuw.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Fout', 'Google inloggen is tijdelijk niet beschikbaar.', [
        { text: 'OK' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = () => {
    Alert.alert(
      'Binnenkort beschikbaar',
      'Apple inloggen wordt binnenkort toegevoegd.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-general-100" />
        <Text className="text-lg">Of</Text>
        <View className="flex-1 h-[1px] bg-general-100" />
      </View>

      <CustomButton
        title={isLoading ? 'Google verbinden...' : 'Doorgaan met Google'}
        className={`mt-5 w-full shadow-none ${isLoading ? 'opacity-50' : ''}`}
        onPress={handleGoogleSignIn}
        disabled={isLoading}
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            className="w-5 h-5 mx-2"
          />
        )}
        bgVariant="outline"
        textVariant="primary"
      />
    </View>
  );
};

export default OAuth;
