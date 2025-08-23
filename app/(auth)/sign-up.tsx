import { Link, router } from 'expo-router';
import { Image, SafeAreaView, Text, View, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import CustomButton from '@/components/CustomButton';
import InputField from '@/components/InputField';
import { icons, images } from '@/constants';
import OAuth from '@/components/OAuth';
import { useAuthStore } from '@/stores/authStore';
import { signUpSchema, SignUpFormData } from '@/utils/validationSchemas';

const SignUp = () => {
  const { signUp, isLoading } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await signUp(data.name, data.email, data.password);
      router.replace('/(root)/(tabs)/dashboard');
    } catch (error) {
      Alert.alert(
        'Sign Up Failed',
        'There was an error creating your account. Please try again.',
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
          Create Your Account
        </Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Name"
              placeholder="Enter name"
              icon={icons.person}
              textContentType="name"
              autoCapitalize="words"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              containerStyle={errors.name ? 'border-red-500' : ''}
            />
          )}
        />
        {errors.name && (
          <Text className="text-red-500 text-sm mt-1 ml-4">
            {errors.name.message}
          </Text>
        )}

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
              textContentType="newPassword"
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
          title={isLoading ? 'Creating Account...' : 'Sign Up'}
          onPress={handleSubmit(onSubmit)}
          className="mt-6"
          disabled={isLoading}
        />

        <OAuth />

        <Link
          href="/(auth)/sign-in"
          className="text-lg text-center text-general-200 mt-10"
        >
          Already have an account?{' '}
          <Text className="text-primary-500">Sign In</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
};
export default SignUp;
