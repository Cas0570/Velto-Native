import { TouchableOpacity, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getStatusColor, getStatusText, formatCurrency } from '@/utils';
import type { InvoiceCardProps } from '@/types/type';

const InvoiceCard = ({
  invoice,
  onPress,
  showBorder = true,
  size = 'small',
  className,
}: InvoiceCardProps) => {
  const iconSize = size === 'large' ? 24 : 20;
  const containerSize = size === 'large' ? 'w-12 h-12' : 'w-10 h-10';
  const containerRadius = size === 'large' ? 'rounded-xl' : 'rounded-lg';
  const titleSize = size === 'large' ? 'text-base' : 'text-base';
  const amountSize = size === 'large' ? 'text-lg' : 'text-base';
  const badgePadding = size === 'large' ? 'px-3 py-1' : 'px-2 py-1';

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`p-4 flex-row items-center justify-between ${
        showBorder ? 'border-b border-gray-100' : ''
      } ${className}`}
    >
      <View className="flex-row items-center flex-1">
        <View
          className={`${containerSize} bg-gray-100 ${containerRadius} items-center justify-center mr-${
            size === 'large' ? '4' : '3'
          }`}
        >
          <MaterialIcons name="receipt" size={iconSize} color="#6b7280" />
        </View>
        <View className="flex-1">
          <Text
            className={`font-JakartaSemiBold text-gray-900 ${titleSize} ${
              size === 'large' ? 'mb-0.5' : ''
            }`}
          >
            {invoice.clientName}
          </Text>
          <Text className="text-sm text-gray-500 font-Jakarta">
            {invoice.invoiceNumber} • {invoice.date}
          </Text>
        </View>
      </View>
      <View className="items-end">
        <Text className={`font-JakartaBold text-gray-900 mb-1 ${amountSize}`}>
          {formatCurrency(invoice.amount)}
        </Text>
        <View
          className={`${badgePadding} rounded-full ${getStatusColor(
            invoice.status
          )}`}
        >
          <Text className="text-xs font-JakartaMedium">
            {getStatusText(invoice.status)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default InvoiceCard;
