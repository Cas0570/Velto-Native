import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewInvoice() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          New Invoice
        </Text>
        <Text className="text-gray-600">Invoice creation steps:</Text>
        <View className="mt-4 space-y-2">
          <Text className="text-gray-600">• Step 1: Client info</Text>
          <Text className="text-gray-600">• Step 2: Invoice lines</Text>
          <Text className="text-gray-600">
            • Step 3: Extra options (logo, colors, notes)
          </Text>
          <Text className="text-gray-600">• Step 4: Preview</Text>
          <Text className="text-gray-600">• Step 5: Send/Export</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
