import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { mockInvoices } from '@/constants';
import { formatCurrency } from '@/utils';
import InvoiceCard from '@/components/InvoiceCard';
import PageHeader from '@/components/PageHeader';

export default function Dashboard() {
  const totalOutstanding = 2950;
  const thisMonth = 4200;
  const monthlyGrowth = 12;
  const invoiceCount = mockInvoices.length;
  const paidCount = mockInvoices.filter((inv) => inv.status === 'paid').length;
  const sentCount = mockInvoices.filter((inv) => inv.status === 'sent').length;
  const overdueCount = mockInvoices.filter(
    (inv) => inv.status === 'overdue'
  ).length;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <PageHeader title="Welkom terug!" subtitle="Hier is je overzicht" />

        {/* Main Stats Cards */}
        <View className="px-6 py-4">
          <View className="flex-row gap-x-4">
            {/* Outstanding Amount */}
            <View className="flex-1 bg-white rounded-2xl p-6 shadow-sm">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-600 font-JakartaMedium">
                  Openstaand
                </Text>
                <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center">
                  <MaterialIcons name="euro" size={16} color="#3b82f6" />
                </View>
              </View>
              <Text className="text-2xl font-JakartaBold text-gray-900 mb-1">
                {formatCurrency(totalOutstanding)}
              </Text>
              <Text className="text-sm text-gray-500 font-Jakarta">
                {invoiceCount} facturen
              </Text>
            </View>

            {/* This Month */}
            <View className="flex-1 bg-white rounded-2xl p-6 shadow-sm">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-600 font-JakartaMedium">
                  Deze maand
                </Text>
                <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center">
                  <MaterialIcons name="trending-up" size={16} color="#10b981" />
                </View>
              </View>
              <Text className="text-2xl font-JakartaBold text-gray-900 mb-1">
                {formatCurrency(thisMonth)}
              </Text>
              <Text className="text-sm text-green-600 font-Jakarta">
                +{monthlyGrowth}% vs vorige maand
              </Text>
            </View>
          </View>
        </View>

        {/* Status Overview */}
        <View className="px-6 py-4 shadow-sm">
          <View className="bg-white rounded-2xl p-6 ">
            <Text className="text-lg font-JakartaSemiBold text-gray-800 mb-4">
              Status overzicht
            </Text>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-2xl font-JakartaBold text-green-600 mb-1">
                  {paidCount}
                </Text>
                <Text className="text-sm text-gray-600 font-Jakarta">
                  Betaald
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-JakartaBold text-orange-500 mb-1">
                  {sentCount}
                </Text>
                <Text className="text-sm text-gray-600 font-Jakarta">
                  Verzonden
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-JakartaBold text-red-600 mb-1">
                  {overdueCount}
                </Text>
                <Text className="text-sm text-gray-600 font-Jakarta">
                  Te laat
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Invoices */}
        <View className="px-6 py-4 shadow-sm">
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <View className="px-4 pt-6 pb-4 flex-row items-center justify-between ">
              <Text className="text-lg font-JakartaSemiBold text-gray-800">
                Recente Facturen
              </Text>
              <TouchableOpacity>
                <Text className="text-primary-500 font-JakartaMedium">
                  Bekijk alle
                </Text>
              </TouchableOpacity>
            </View>

            {mockInvoices.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                invoice={invoice}
                showBorder={true}
              />
            ))}
          </View>
        </View>

        {/* Free Plan Notice */}
        <View className="px-6 py-4 pb-8">
          <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex-row items-center">
            <View className="w-8 h-8 bg-amber-100 rounded-full items-center justify-center mr-3">
              <MaterialIcons name="info" size={20} color="#f59e0b" />
            </View>
            <View className="flex-1">
              <Text className="font-JakartaSemiBold text-amber-800">
                Gratis plan
              </Text>
              <Text className="text-sm text-amber-700 font-Jakarta">
                3 van 5 facturen gebruikt deze maand
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
