import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { useInvoiceStore, useUserStore } from '@/stores';
import { formatCurrency } from '@/utils';
import InvoiceCard from '@/components/InvoiceCard';
import PageHeader from '@/components/PageHeader';

export default function Dashboard() {
  const {
    invoices,
    totalOutstanding,
    thisMonthTotal,
    paidCount,
    sentCount,
    overdueCount,
    fetchInvoices,
    isLoading,
  } = useInvoiceStore();

  const { subscription, user } = useUserStore();

  // Calculate monthly growth (mock calculation)
  const monthlyGrowth = 12; // In real app, this would be calculated from historical data

  // Fetch invoices on component mount
  useEffect(() => {
    if (invoices.length === 0) {
      fetchInvoices();
    }
  }, [fetchInvoices, invoices.length]);

  // Get recent invoices (last 4)
  const recentInvoices = invoices
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 4);

  if (isLoading && invoices.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <MaterialIcons name="hourglass-empty" size={48} color="#9ca3af" />
          <Text className="text-gray-500 font-Jakarta mt-4">
            Facturen laden...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <PageHeader
        title={`Welkom terug${user?.name ? `, ${user.name.split(' ')[0]}` : ''}!`}
        subtitle="Hier is je overzicht"
      />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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
                {sentCount + overdueCount} facturen
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
                {formatCurrency(thisMonthTotal)}
              </Text>
              <Text className="text-sm text-green-600 font-Jakarta">
                +{monthlyGrowth}% vs vorige maand
              </Text>
            </View>
          </View>
        </View>

        {/* Status Overview */}
        <View className="px-6 py-4 shadow-sm">
          <View className="bg-white rounded-2xl p-6">
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
            <View className="px-4 pt-6 pb-4 flex-row items-center justify-between">
              <Text className="text-lg font-JakartaSemiBold text-gray-800">
                Recente Facturen
              </Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/invoices')}>
                <Text className="text-primary-500 font-JakartaMedium">
                  Bekijk alle
                </Text>
              </TouchableOpacity>
            </View>

            {recentInvoices.length > 0 ? (
              recentInvoices.map((invoice) => (
                <InvoiceCard
                  key={invoice.id}
                  invoice={{
                    id: invoice.id,
                    clientName: invoice.clientName,
                    invoiceNumber: invoice.invoiceNumber,
                    date: invoice.date,
                    amount: invoice.amount,
                    status: invoice.status,
                  }}
                  showBorder={true}
                />
              ))
            ) : (
              <View className="p-8 items-center">
                <MaterialIcons name="receipt-long" size={48} color="#9ca3af" />
                <Text className="text-gray-500 font-Jakarta mt-2">
                  Nog geen facturen
                </Text>
              </View>
            )}
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
                {subscription.plan === 'free' ? 'Gratis plan' : 'Premium plan'}
              </Text>
              <Text className="text-sm text-amber-700 font-Jakarta">
                {subscription.plan === 'free'
                  ? `${subscription.invoicesUsed} van ${subscription.invoiceLimit} facturen gebruikt`
                  : 'Onbeperkte facturen'}
              </Text>
            </View>
            {subscription.plan === 'free' && (
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/settings')}
                className="ml-2"
              >
                <Text className="text-amber-600 font-JakartaMedium text-sm">
                  Upgrade
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
