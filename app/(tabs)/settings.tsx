import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Settings</Text>
        <Text className="text-gray-600">Settings & Profile will include:</Text>
        <View className="mt-4 space-y-2">
          <Text className="text-gray-600">• Edit company info</Text>
          <Text className="text-gray-600">• Manage subscription</Text>
          <Text className="text-gray-600">• Payment method management</Text>
          <Text className="text-gray-600">• Notification settings</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
