import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useMemo } from 'react';
import { useInvoiceStore, useUserStore } from '@/stores';
import { tabs } from '@/constants';
import type { InvoiceStatus } from '@/types/type';
import InvoiceCard from '@/components/InvoiceCard';
import PageHeader from '@/components/PageHeader';

export default function Invoices() {
  const [activeTab, setActiveTab] = useState<InvoiceStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { invoices } = useInvoiceStore();
  const { canCreateInvoice, subscription } = useUserStore();

  // Filter invoices based on active tab and search query
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      // Filter by status
      let statusMatch = true;
      if (activeTab !== 'all') {
        statusMatch = invoice.status === activeTab;
      }

      // Filter by search query
      const searchMatch =
        searchQuery === '' ||
        invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());

      return statusMatch && searchMatch;
    });
  }, [invoices, activeTab, searchQuery]);

  const getTabCount = (tabKey: InvoiceStatus) => {
    if (tabKey === 'all') return invoices.length;
    return invoices.filter((inv) => inv.status === tabKey).length;
  };

  const handleCreateInvoice = () => {
    if (!canCreateInvoice()) {
      // Show upgrade modal or redirect to settings
      router.push('/(tabs)/settings');
      return;
    }

    router.push('/(tabs)/new-invoice');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <PageHeader title="Facturen" subtitle="Overzicht van al je facturen" />

      {/* Search and Tabs */}
      <View className="px-6 py-4 shadow-sm">
        <View className="bg-white rounded-2xl shadow-md overflow-hidden p-4">
          {/* Search Bar */}
          <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-3 mb-4">
            <MaterialIcons name="search" size={20} color="#9ca3af" />
            <TextInput
              placeholder="Zoeken naar facturen..."
              placeholderTextColor="#9ca3af"
              className="flex-1 ml-3 font-Jakarta text-gray-900"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialIcons name="close" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>

          {/* Status Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {tabs.map((tab) => {
              const count = getTabCount(tab.key);
              const isActive = activeTab === tab.key;

              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  className={`mr-4 px-4 py-2 rounded-full flex-row items-center ${
                    isActive ? 'bg-primary-500' : 'bg-gray-100'
                  }`}
                >
                  <Text
                    className={`font-JakartaMedium mr-1 ${
                      isActive ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {tab.label}
                  </Text>
                  <View
                    className={`px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white bg-opacity-20' : 'bg-gray-200'
                    }`}
                  >
                    <Text
                      className={`text-xs font-JakartaBold ${
                        isActive ? 'text-primary-500' : 'text-gray-600'
                      }`}
                    >
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Invoice List */}
      <ScrollView
        className="flex-1 px-6 py-4 shadow-sm"
        showsVerticalScrollIndicator={false}
      >
        {filteredInvoices.length > 0 ? (
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {filteredInvoices.map((invoice) => (
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
            ))}
          </View>
        ) : (
          // Empty State
          <View className="bg-white rounded-2xl p-8 items-center justify-center">
            <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
              <MaterialIcons name="receipt-long" size={32} color="#9ca3af" />
            </View>
            <Text className="text-lg font-JakartaSemiBold text-gray-800 mb-2">
              Geen facturen gevonden
            </Text>
            <Text className="text-gray-500 font-Jakarta text-center">
              {searchQuery
                ? `Geen resultaten voor "${searchQuery}"`
                : `Je hebt nog geen ${tabs.find((t) => t.key === activeTab)?.label.toLowerCase()} facturen.`}
            </Text>
            {activeTab === 'all' && invoices.length === 0 && (
              <TouchableOpacity
                onPress={handleCreateInvoice}
                className="mt-4 px-6 py-3 bg-primary-500 rounded-full"
              >
                <Text className="text-white font-JakartaMedium">
                  Maak je eerste factuur
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <View className="absolute bottom-6 right-6">
        <TouchableOpacity
          onPress={handleCreateInvoice}
          className={`w-14 h-14 rounded-full items-center justify-center shadow-lg ${
            canCreateInvoice() ? 'bg-primary-500' : 'bg-gray-400'
          }`}
          disabled={!canCreateInvoice()}
        >
          <MaterialIcons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Usage Limit Warning */}
      {subscription.plan === 'free' &&
        subscription.invoicesUsed >= subscription.invoiceLimit && (
          <View className="absolute bottom-20 left-6 right-6">
            <View className="bg-amber-500 rounded-2xl p-4 flex-row items-center shadow-lg">
              <MaterialIcons name="warning" size={24} color="white" />
              <Text className="flex-1 text-white font-JakartaMedium ml-3">
                Je hebt je maandelijkse limiet bereikt
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/settings')}
                className="bg-white bg-opacity-20 px-3 py-1 rounded-full ml-2"
              >
                <Text className="text-white font-JakartaMedium text-sm">
                  Upgrade
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
    </SafeAreaView>
  );
}
