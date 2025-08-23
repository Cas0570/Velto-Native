import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Dashboard() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Dashboard</Text>
        <Text className="text-gray-600">
          Welcome to Velto! Your invoicing dashboard will show:
        </Text>
        <View className="mt-4 space-y-2">
          <Text className="text-gray-600">• Open balance</Text>
          <Text className="text-gray-600">• Total paid</Text>
          <Text className="text-gray-600">• Recent invoices with status</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
