import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Invoices() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Invoices</Text>
        <Text className="text-gray-600">Your invoice list will show:</Text>
        <View className="mt-4 space-y-2">
          <Text className="text-gray-600">
            • Tabs: Drafts | Sent | Paid | Late
          </Text>
          <Text className="text-gray-600">
            • Invoice cards with client, amount, date, status
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
