import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { mockInvoices } from '@/constants';
import { getStatusColor, getStatusText, formatCurrency } from '@/utils';
import { tabs } from '@/constants';

import type { InvoiceStatus } from '@/types/type';

export default function Invoices() {
  const [activeTab, setActiveTab] = useState<InvoiceStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter invoices based on active tab and search query
  const filteredInvoices = mockInvoices.filter((invoice) => {
    // Filter by status
    let statusMatch = true;
    if (activeTab !== 'all') {
      const statusMap: Record<string, InvoiceStatus> = {
        draft: 'draft',
        sent: 'sent',
        paid: 'paid',
        overdue: 'overdue',
      };
      statusMatch = statusMap[invoice.status] === activeTab;
    }

    // Filter by search query
    const searchMatch =
      searchQuery === '' ||
      invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && searchMatch;
  });

  const getTabCount = (tabKey: InvoiceStatus) => {
    if (tabKey === 'all') return mockInvoices.length;
    const statusMap: Record<InvoiceStatus, string> = {
      all: '',
      draft: 'draft',
      sent: 'sent',
      paid: 'paid',
      overdue: 'overdue',
    };
    return mockInvoices.filter((inv) => inv.status === statusMap[tabKey])
      .length;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-4">
        <View className="flex-row items-center mb-2">
          <View className="w-10 h-10 bg-primary-500 rounded-lg items-center justify-center mr-3">
            <Text className="text-white font-JakartaBold text-lg">V</Text>
          </View>
          <View>
            <Text className="text-2xl font-JakartaBold text-gray-800">
              Facturen
            </Text>
            <Text className="text-gray-500 font-Jakarta">
              Overzicht van al je facturen
            </Text>
          </View>
        </View>
      </View>

      <View className=" px-6 py-4">
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
        className="flex-1 px-6 py-4"
        showsVerticalScrollIndicator={false}
      >
        {filteredInvoices.length > 0 ? (
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {filteredInvoices.map((invoice, index) => (
              <TouchableOpacity
                key={invoice.id}
                className={`p-4 flex-row items-center justify-between ${
                  index !== filteredInvoices.length - 1
                    ? 'border-b border-gray-100'
                    : ''
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center mr-4">
                    <MaterialIcons name="receipt" size={24} color="#6b7280" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-JakartaSemiBold text-gray-900 text-base">
                      {invoice.clientName}
                    </Text>
                    <Text className="text-sm text-gray-500 font-Jakarta mt-0.5">
                      {invoice.invoiceNumber} • {invoice.date}
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="font-JakartaBold text-gray-900 text-lg mb-1">
                    {formatCurrency(invoice.amount)}
                  </Text>
                  <View
                    className={`px-3 py-1 rounded-full ${getStatusColor(
                      invoice.status
                    )}`}
                  >
                    <Text className="text-xs font-JakartaMedium">
                      {getStatusText(invoice.status)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
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
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <View className="absolute bottom-6 right-6">
        <TouchableOpacity className="w-14 h-14 bg-primary-500 rounded-full items-center justify-center shadow-lg">
          <MaterialIcons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
