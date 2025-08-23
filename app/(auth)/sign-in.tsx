import { Link, router } from 'expo-router';
import { Image, SafeAreaView, Text, View, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import CustomButton from '@/components/CustomButton';
import InputField from '@/components/InputField';
import { icons, images } from '@/constants';
import OAuth from '@/components/OAuth';
import { useAuthStore } from '@/stores/authStore';
import { signInSchema, SignInFormData } from '@/utils/validationSchemas';

const SignIn = () => {
  const { signIn, isLoading } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      await signIn(data.email, data.password);
      router.replace('/(root)/(tabs)/dashboard');
    } catch (error) {
      Alert.alert(
        'Sign In Failed',
        'Please check your credentials and try again.',
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
          Sign In To Your Account
        </Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Email"
              placeholder="Enter email"
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
          <Text className="text-red-500 text-sm mt-1 ml-4">
            {errors.email.message}
          </Text>
        )}

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Password"
              placeholder="Enter password"
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
          <Text className="text-red-500 text-sm mt-1 ml-4">
            {errors.password.message}
          </Text>
        )}

        <CustomButton
          title={isLoading ? 'Signing In...' : 'Sign In'}
          onPress={handleSubmit(onSubmit)}
          className="mt-6"
          disabled={isLoading}
        />

        <OAuth />

        <Link
          href="/(auth)/sign-up"
          className="text-lg text-center text-general-200 mt-10"
        >
          Don't have an account?{' '}
          <Text className="text-primary-500">Sign Up</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
};
export default SignIn;
