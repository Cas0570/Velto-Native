import { Link, router } from 'expo-router';
import { Image, SafeAreaView, Text, View } from 'react-native';

import CustomButton from '@/components/CustomButton';
import InputField from '@/components/InputField';
import { icons, images } from '@/constants';
import OAuth from '@/components/OAuth';

const SignIn = () => {
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
        <InputField
          label="Email"
          placeholder="Enter email"
          icon={icons.email}
          textContentType="emailAddress"
        />
        <InputField
          label="Password"
          placeholder="Enter password"
          icon={icons.lock}
          secureTextEntry={true}
          textContentType="password"
        />
        <CustomButton title="Sign In" className="mt-6" />
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
