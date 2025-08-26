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
const signInSchema = z.object({
  email: z
    .string()
    .email('Voer een geldig e-mailadres in')
    .min(1, 'E-mail is verplicht'),
  password: z
    .string()
    .min(6, 'Wachtwoord moet minimaal 6 tekens zijn')
    .min(1, 'Wachtwoord is verplicht'),
});

type SignInForm = z.infer<typeof signInSchema>;

const SignIn = () => {
  const { signIn, isLoading, error, clearError } = useUserStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: SignInForm) => {
    clearError();

    const success = await signIn(data.email, data.password);

    if (success) {
      // Reset form
      reset();
      // Navigate to main app
      router.replace('/(tabs)/dashboard');
    } else {
      // Error is already set in the store, will be displayed
      Alert.alert(
        'Inloggen mislukt',
        'Controleer je e-mailadres en wachtwoord en probeer opnieuw.',
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
          Inloggen
        </Text>

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
              placeholder="Voer je wachtwoord in"
              icon={icons.lock}
              secureTextEntry={true}
              textContentType="password"
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

        {/* Error Message */}
        {error && (
          <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <Text className="text-red-600 font-Jakarta text-center">
              {error}
            </Text>
          </View>
        )}

        {/* Sign In Button */}
        <CustomButton
          title={isLoading ? 'Inloggen...' : 'Inloggen'}
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid || isLoading}
          className={`mt-6 ${!isValid || isLoading ? 'opacity-50' : ''}`}
        />

        {/* Sign Up Link */}
        <Link
          href="/(auth)/sign-up"
          className="text-lg text-center text-general-200 mt-10"
        >
          Nog geen account?{' '}
          <Text className="text-primary-500">Registreren</Text>
        </Link>

        {/* Demo Credentials Helper */}
        <View className="mt-8 bg-gray-50 rounded-xl p-4">
          <Text className="text-gray-600 font-JakartaSemiBold text-center mb-2">
            Demo Inloggegevens
          </Text>
          <Text className="text-gray-500 font-Jakarta text-center text-sm">
            E-mail: demo@velto.app{'\n'}
            Wachtwoord: demo123
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
