import { Link, router } from 'expo-router';
import { Image, SafeAreaView, Text, View, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import CustomButton from '@/components/CustomButton';
import InputField from '@/components/InputField';
import { icons, images } from '@/constants';
import { useUserStore } from '@/stores';

// Form validation schema
const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Naam moet minimaal 2 tekens zijn')
      .min(1, 'Naam is verplicht'),
    email: z
      .string()
      .email('Voer een geldig e-mailadres in')
      .min(1, 'E-mail is verplicht'),
    password: z
      .string()
      .min(6, 'Wachtwoord moet minimaal 6 tekens zijn')
      .min(1, 'Wachtwoord is verplicht'),
    confirmPassword: z.string().min(1, 'Bevestig je wachtwoord'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Wachtwoorden komen niet overeen',
    path: ['confirmPassword'],
  });

type SignUpForm = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const { signUp, isLoading, error, clearError } = useUserStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: SignUpForm) => {
    clearError();

    const success = await signUp(data.name, data.email, data.password);

    if (success) {
      // Reset form
      reset();
      // Show success message
      Alert.alert(
        'Account Aangemaakt!',
        'Je account is succesvol aangemaakt. Welkom bij Velto!',
        [
          {
            text: 'Ga verder',
            onPress: () => router.replace('/(tabs)/dashboard'),
          },
        ]
      );
    } else {
      // Error is already set in the store
      Alert.alert(
        'Registratie mislukt',
        'Er is een probleem opgetreden bij het aanmaken van je account. Probeer opnieuw.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView className="flex h-full w-full bg-white">
      <View className="flex-1 justify-center p-5">
        <Image
          source={images.logo}
          className="w-full h-[60px] my-12"
          resizeMode="contain"
        />
        <Text className="text-black text-2xl text-start font-JakartaSemiBold mb-2">
          Account aanmaken
        </Text>

        {/* Name Field */}
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Volledige naam"
              placeholder="John Doe"
              icon={icons.person}
              textContentType="name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              containerStyle={errors.name ? 'border-red-500' : ''}
            />
          )}
        />
        {errors.name && (
          <Text className="text-red-500 text-sm font-Jakarta mb-2 px-4">
            {errors.name.message}
          </Text>
        )}

        {/* Email Field */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="E-mailadres"
              placeholder="info@bedrijf.nl"
              icon={icons.email}
              textContentType="emailAddress"
              keyboardType="email-address"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              containerStyle={errors.email ? 'border-red-500' : ''}
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-500 text-sm font-Jakarta mb-2 px-4">
            {errors.email.message}
          </Text>
        )}

        {/* Password Field */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Wachtwoord"
              placeholder="Minimaal 6 tekens"
              icon={icons.lock}
              secureTextEntry={true}
              textContentType="newPassword"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              containerStyle={errors.password ? 'border-red-500' : ''}
            />
          )}
        />
        {errors.password && (
          <Text className="text-red-500 text-sm font-Jakarta mb-2 px-4">
            {errors.password.message}
          </Text>
        )}

        {/* Confirm Password Field */}
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Bevestig wachtwoord"
              placeholder="Herhaal je wachtwoord"
              icon={icons.lock}
              secureTextEntry={true}
              textContentType="newPassword"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              containerStyle={errors.confirmPassword ? 'border-red-500' : ''}
            />
          )}
        />
        {errors.confirmPassword && (
          <Text className="text-red-500 text-sm font-Jakarta mb-2 px-4">
            {errors.confirmPassword.message}
          </Text>
        )}

        {/* Error Message */}
        {error && (
          <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <Text className="text-red-600 font-Jakarta text-center">
              {error}
            </Text>
          </View>
        )}

        {/* Sign Up Button */}
        <CustomButton
          title={isLoading ? 'Account aanmaken...' : 'Account aanmaken'}
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid || isLoading}
          className={`mt-6 ${!isValid || isLoading ? 'opacity-50' : ''}`}
        />

        {/* Sign In Link */}
        <Link
          href="/(auth)/sign-in"
          className="text-lg text-center text-general-200 mt-10"
        >
          Heb je al een account?{' '}
          <Text className="text-primary-500">Inloggen</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
