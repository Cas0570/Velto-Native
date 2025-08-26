import { View, Text, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import CustomButton from '@/components/CustomButton';
import { formatCurrency, formatDate } from '@/utils';
import type { NewInvoiceStepProps } from '@/types/type';
import { companyData } from '@/constants';

const InvoicePreviewStep = ({
  data,
  onNext,
  onPrevious,
}: NewInvoiceStepProps) => {
  const currentDate = new Date().toISOString().split('T')[0];
  const primaryColor = data.options.primaryColor || '#43d478';

  // Get payment method display info
  const getPaymentMethodInfo = () => {
    switch (data.options.paymentMethod) {
      case 'tikkie':
        return { label: 'Tikkie', icon: 'smartphone' };
      case 'paypal':
        return { label: 'PayPal', icon: 'payment' };
      case 'bank':
        return { label: 'Bankoverschrijving', icon: 'account-balance' };
      default:
        return { label: 'Bankoverschrijving', icon: 'account-balance' };
    }
  };

  const paymentInfo = getPaymentMethodInfo();

  return (
    <ScrollView
      className="flex-1 px-6 py-4"
      showsVerticalScrollIndicator={false}
    >
      {/* Header Info */}
      <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
        <Text className="text-lg font-JakartaSemiBold text-gray-800 mb-2">
          Voorvertoning
        </Text>
        <Text className="text-gray-600 font-Jakarta">
          Controleer je factuur voordat je deze verstuurt.
        </Text>
      </View>

      {/* Invoice Preview */}
      <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Invoice Header */}
        <View className="p-6 border-b border-gray-100">
          <View className="flex-row justify-between items-start mb-6">
            {/* Company Logo/Initial */}
            <View className="flex-row items-center">
              {data.options.logo ? (
                <View className="w-16 h-16 bg-gray-100 rounded-xl items-center justify-center mr-4">
                  <MaterialIcons name="image" size={32} color="#9ca3af" />
                </View>
              ) : (
                <View
                  className="w-16 h-16 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Text className="text-white font-JakartaBold text-xl">
                    {data.clientInfo.name.charAt(0).toUpperCase() || 'V'}
                  </Text>
                </View>
              )}
              <View>
                <Text className="text-2xl font-JakartaBold text-gray-900">
                  FACTUUR
                </Text>
                <Text className="text-gray-600 font-Jakarta">
                  {data.calculated.invoiceNumber}
                </Text>
              </View>
            </View>

            {/* Invoice Details */}
            <View className="items-end">
              <Text className="text-gray-600 font-Jakarta">Factuurdatum</Text>
              <Text className="font-JakartaSemiBold text-gray-900">
                {formatDate(currentDate)}
              </Text>
              <Text className="text-gray-600 font-Jakarta mt-2">
                Vervaldatum
              </Text>
              <Text className="font-JakartaSemiBold text-gray-900">
                {formatDate(data.calculated.dueDate)}
              </Text>
            </View>
          </View>

          {/* Company Information */}
          <View className="mb-4">
            <Text className="text-lg font-JakartaSemiBold text-gray-800 mb-2">
              Van:
            </Text>
            <Text className="font-JakartaSemiBold text-gray-900">
              {companyData.name}
            </Text>
            <Text className="text-gray-600 font-Jakarta text-sm">
              {companyData.email}
            </Text>
            <Text className="text-gray-600 font-Jakarta text-sm">
              {companyData.address}
            </Text>
            <Text className="text-gray-600 font-Jakarta text-sm">
              KVK: {companyData.kvk} | BTW: {companyData.btw}
            </Text>
            <Text className="text-gray-600 font-Jakarta text-sm">
              IBAN: {companyData.iban}
            </Text>
          </View>
        </View>

        {/* Client Information */}
        <View className="p-6 border-b border-gray-100">
          <Text className="text-lg font-JakartaSemiBold text-gray-800 mb-3">
            Aan:
          </Text>
          <Text className="font-JakartaSemiBold text-gray-900 text-base">
            {data.clientInfo.name}
          </Text>
          <Text className="text-gray-600 font-Jakarta mt-1">
            {data.clientInfo.email}
          </Text>
          <Text className="text-gray-600 font-Jakarta mt-1">
            {data.clientInfo.straat} {data.clientInfo.huisnummer},{' '}
            {data.clientInfo.postcode} {data.clientInfo.plaats}
          </Text>
          {data.clientInfo.phone && (
            <Text className="text-gray-600 font-Jakarta mt-1">
              {data.clientInfo.phone}
            </Text>
          )}
        </View>

        {/* Invoice Lines */}
        <View className="p-6 border-b border-gray-100">
          <Text className="text-lg font-JakartaSemiBold text-gray-800 mb-4">
            Factuurregels:
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="min-w-full">
              {/* Table Header */}
              <View className="flex-row pb-3 border-b border-gray-200 mb-3">
                <Text className="w-32 text-sm font-JakartaSemiBold text-gray-600">
                  Omschrijving
                </Text>
                <Text className="w-20 text-sm font-JakartaSemiBold text-gray-600 text-center">
                  Aantal
                </Text>
                <Text className="w-24 text-sm font-JakartaSemiBold text-gray-600 text-right">
                  Prijs
                </Text>
                <Text className="w-20 text-sm font-JakartaSemiBold text-gray-600 text-center">
                  BTW
                </Text>
                <Text className="w-28 text-sm font-JakartaSemiBold text-gray-600 text-right">
                  Totaal
                </Text>
              </View>

              {/* Invoice Lines */}
              {data.invoiceLines.map((line, index) => (
                <View
                  key={line.id || index}
                  className="flex-row py-3 border-b border-gray-100"
                >
                  <Text className="w-32 text-gray-900 font-Jakarta">
                    {line.description}
                  </Text>
                  <Text className="w-20 text-gray-900 font-Jakarta text-center">
                    {line.quantity}
                  </Text>
                  <Text className="w-24 text-gray-900 font-Jakarta text-right">
                    {formatCurrency(line.unitPrice)}
                  </Text>
                  <Text className="w-20 text-gray-900 font-Jakarta text-center">
                    {Math.round(line.vatRate * 100)}%
                  </Text>
                  <Text className="w-28 text-gray-900 font-JakartaSemiBold text-right">
                    {formatCurrency(line.total)}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Totals */}
        <View className="p-6 border-b border-gray-100">
          <View className="gap-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600 font-Jakarta">Subtotaal:</Text>
              <Text className="text-gray-900 font-JakartaMedium">
                {formatCurrency(data.calculated.subtotal)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600 font-Jakarta">BTW:</Text>
              <Text className="text-gray-900 font-JakartaMedium">
                {formatCurrency(data.calculated.totalVat)}
              </Text>
            </View>
            <View className="flex-row justify-between pt-2 border-t border-gray-200">
              <Text className="text-lg font-JakartaBold text-gray-900">
                Totaal:
              </Text>
              <Text
                className="text-lg font-JakartaBold"
                style={{ color: primaryColor }}
              >
                {formatCurrency(data.calculated.total)}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Information */}
        <View className="p-6 border-b border-gray-100">
          <Text className="text-lg font-JakartaSemiBold text-gray-800 mb-3">
            Betaalinformatie:
          </Text>
          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 bg-gray-100 rounded-lg items-center justify-center mr-3">
              <MaterialIcons
                name={paymentInfo.icon as any}
                size={16}
                color="#6b7280"
              />
            </View>
            <Text className="text-gray-900 font-JakartaMedium">
              {paymentInfo.label}
            </Text>
          </View>

          {data.options.paymentLink && (
            <View className="bg-gray-50 rounded-xl p-4">
              <Text className="text-gray-600 font-Jakarta text-sm mb-1">
                Directe betalingslink:
              </Text>
              <Text className="text-primary-600 font-JakartaMedium text-sm">
                {data.options.paymentLink}
              </Text>
            </View>
          )}

          {data.options.paymentMethod === 'bank' && (
            <View className="bg-gray-50 rounded-xl p-4">
              <Text className="text-gray-600 font-Jakarta text-sm">
                Gelieve het totaalbedrag over te maken naar onze bankrekening
                met vermelding van het factuurnummer.
              </Text>
            </View>
          )}
        </View>

        {/* Notes */}
        {data.options.notes && (
          <View className="p-6">
            <Text className="text-lg font-JakartaSemiBold text-gray-800 mb-3">
              Notities & Voorwaarden:
            </Text>
            <Text className="text-gray-700 font-Jakarta leading-6">
              {data.options.notes}
            </Text>
          </View>
        )}
      </View>

      {/* Summary Stats */}
      <View className="bg-white rounded-2xl p-6 mt-6 shadow-sm">
        <Text className="text-lg font-JakartaSemiBold text-gray-800 mb-4">
          Samenvatting
        </Text>
        <View className="gap-y-4">
          {/* First Row */}
          <View className="flex-row justify-between">
            <View className="flex-1 items-center">
              <Text
                className="text-2xl font-JakartaBold"
                style={{ color: primaryColor }}
              >
                {data.invoiceLines.length}
              </Text>
              <Text className="text-gray-600 font-Jakarta text-sm text-center">
                Factuurregels
              </Text>
            </View>
            <View className="flex-1 items-center">
              <Text
                className="text-2xl font-JakartaBold"
                style={{ color: primaryColor }}
              >
                {formatCurrency(data.calculated.total)}
              </Text>
              <Text className="text-gray-600 font-Jakarta text-sm text-center">
                Totaalbedrag
              </Text>
            </View>
          </View>
          {/* Second Row */}
          <View className="flex-row justify-center">
            <View className="flex-1 items-center">
              <Text
                className="text-2xl font-JakartaBold"
                style={{ color: primaryColor }}
              >
                30
              </Text>
              <Text className="text-gray-600 font-Jakarta text-sm text-center">
                Dagen betaaltermijn
              </Text>
            </View>
          </View>
        </View>
      </View>
      {/* Bottom Actions */}
      <View className="py-4 flex-row gap-x-4">
        <CustomButton
          title="Vorige"
          onPress={onPrevious}
          bgVariant="outline"
          textVariant="primary"
          className="flex-1"
        />
        <CustomButton title="Versturen" onPress={onNext} className="flex-1" />
      </View>
    </ScrollView>
  );
};

export default InvoicePreviewStep;
