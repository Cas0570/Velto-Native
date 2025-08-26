import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as MailComposer from 'expo-mail-composer';

import { mockInvoices, companyData } from '@/constants';
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusText,
} from '@/utils';
import CustomButton from '@/components/CustomButton';

// Mock detailed invoice data - in real app this would come from API
const getDetailedInvoiceData = (id: string) => {
  const baseInvoice = mockInvoices.find((inv) => inv.id === id);
  if (!baseInvoice) return null;

  return {
    ...baseInvoice,
    clientInfo: {
      name: baseInvoice.clientName,
      email:
        'contact@' +
        baseInvoice.clientName.toLowerCase().replace(' ', '') +
        '.com',
      address: 'Keizersgracht 123, 1015 CJ Amsterdam',
      phone: '+31 20 123 4567',
    },
    invoiceLines: [
      {
        id: '1',
        description: 'Website Development',
        quantity: 1,
        unitPrice: baseInvoice.amount * 0.6,
        vatRate: 0.21,
        total: baseInvoice.amount * 0.6 * 1.21,
      },
      {
        id: '2',
        description: 'SEO Optimization',
        quantity: 2,
        unitPrice: baseInvoice.amount * 0.2,
        vatRate: 0.21,
        total: baseInvoice.amount * 0.2 * 2 * 1.21,
      },
    ],
    totals: {
      subtotal: baseInvoice.amount / 1.21,
      vat: baseInvoice.amount - baseInvoice.amount / 1.21,
      total: baseInvoice.amount,
    },
    paymentMethod: 'bank',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    notes:
      'Betaling binnen 30 dagen na factuurdatum. Bij vragen kunt u contact opnemen.',
  };
};

export default function InvoiceDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const invoiceData = getDetailedInvoiceData(id);

  if (!invoiceData) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center p-6">
          <MaterialIcons name="receipt-long" size={64} color="#9ca3af" />
          <Text className="text-xl font-JakartaSemiBold text-gray-800 mt-4 mb-2">
            Factuur niet gevonden
          </Text>
          <Text className="text-gray-600 font-Jakarta text-center mb-6">
            De factuur die je zoekt bestaat niet of is verwijderd.
          </Text>
          <CustomButton
            title="Terug naar overzicht"
            onPress={() => router.back()}
            className="w-48"
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleStatusUpdate = () => {
    const statusOptions = [
      { title: 'Concept', value: 'draft' },
      { title: 'Verzonden', value: 'sent' },
      { title: 'Betaald', value: 'paid' },
      { title: 'Te laat', value: 'overdue' },
    ];

    Alert.alert(
      'Status wijzigen',
      'Selecteer de nieuwe status voor deze factuur:',
      [
        { text: 'Annuleren', style: 'cancel' },
        ...statusOptions.map((option) => ({
          text: option.title,
          onPress: () => {
            // TODO: Implement status update
            Alert.alert(
              'Status bijgewerkt',
              `Factuur status gewijzigd naar: ${option.title}`
            );
          },
        })),
      ]
    );
  };

  const handleDeleteInvoice = () => {
    Alert.alert(
      'Factuur verwijderen',
      `Weet je zeker dat je factuur ${invoiceData.invoiceNumber} wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.`,
      [
        { text: 'Annuleren', style: 'cancel' },
        {
          text: 'Verwijderen',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement actual deletion logic
            // This would typically call an API to delete the invoice
            Alert.alert(
              'Factuur verwijderd',
              'De factuur is succesvol verwijderd.',
              [
                {
                  text: 'OK',
                  onPress: () => router.back(),
                },
              ]
            );
          },
        },
      ]
    );
  };

  const generatePDF = async () => {
    try {
      setIsGeneratingPDF(true);

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Factuur ${invoiceData.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #374151; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .company-logo { width: 60px; height: 60px; background: #43d478; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 24px; }
            .invoice-title { font-size: 32px; font-weight: bold; margin: 0; }
            .invoice-details { text-align: right; }
            .section { margin: 30px 0; }
            .section-title { font-size: 18px; font-weight: 600; margin-bottom: 12px; }
            .invoice-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .invoice-table th, .invoice-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            .invoice-table th { background: #f9fafb; font-weight: 600; }
            .totals { text-align: right; margin: 30px 0; }
            .total-row { display: flex; justify-content: space-between; margin: 8px 0; }
            .total-final { font-size: 18px; font-weight: bold; border-top: 2px solid #e5e7eb; padding-top: 12px; color: #43d478; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="company-logo">${invoiceData.clientInfo.name.charAt(0).toUpperCase()}</div>
              <h1 class="invoice-title">FACTUUR</h1>
              <p>${invoiceData.invoiceNumber}</p>
            </div>
            <div class="invoice-details">
              <p><strong>Factuurdatum:</strong> ${formatDate(invoiceData.date)}</p>
              <p><strong>Vervaldatum:</strong> ${formatDate(invoiceData.dueDate)}</p>
              <p><strong>Status:</strong> ${getStatusText(invoiceData.status)}</p>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Van:</div>
            <p><strong>${companyData.name}</strong></p>
            <p>${companyData.address}</p>
            <p>KVK: ${companyData.kvk} | BTW: ${companyData.btw}</p>
          </div>
          
          <div class="section">
            <div class="section-title">Aan:</div>
            <p><strong>${invoiceData.clientInfo.name}</strong></p>
            <p>${invoiceData.clientInfo.email}</p>
            <p>${invoiceData.clientInfo.address}</p>
          </div>
          
          <table class="invoice-table">
            <thead>
              <tr>
                <th>Omschrijving</th>
                <th>Aantal</th>
                <th>Prijs</th>
                <th>BTW</th>
                <th>Totaal</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceData.invoiceLines
                .map(
                  (line) => `
                <tr>
                  <td>${line.description}</td>
                  <td>${line.quantity}</td>
                  <td>${formatCurrency(line.unitPrice)}</td>
                  <td>${Math.round(line.vatRate * 100)}%</td>
                  <td>${formatCurrency(line.total)}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <div class="total-row">
              <span>Subtotaal:</span>
              <span>${formatCurrency(invoiceData.totals.subtotal)}</span>
            </div>
            <div class="total-row">
              <span>BTW:</span>
              <span>${formatCurrency(invoiceData.totals.vat)}</span>
            </div>
            <div class="total-row total-final">
              <span>Totaal:</span>
              <span>${formatCurrency(invoiceData.totals.total)}</span>
            </div>
          </div>
          
          ${
            invoiceData.notes
              ? `
            <div class="section">
              <div class="section-title">Notities:</div>
              <p>${invoiceData.notes}</p>
            </div>
          `
              : ''
          }
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html, base64: false });

      setIsGeneratingPDF(false);

      // Share the PDF
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: `Factuur ${invoiceData.invoiceNumber}`,
      });
    } catch (error) {
      setIsGeneratingPDF(false);
      Alert.alert(
        'Fout',
        'Er is een probleem opgetreden bij het genereren van de PDF.'
      );
    }
  };

  const sendByEmail = async () => {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Fout', 'E-mail is niet beschikbaar op dit apparaat.');
      return;
    }

    try {
      await MailComposer.composeAsync({
        recipients: [invoiceData.clientInfo.email],
        subject: `Factuur ${invoiceData.invoiceNumber} - ${invoiceData.clientInfo.name}`,
        body: `Beste ${invoiceData.clientInfo.name},\n\nHierbij ontvangt u factuur ${invoiceData.invoiceNumber} ter waarde van ${formatCurrency(invoiceData.totals.total)}.\n\nDe factuur is betaalbaar binnen 30 dagen.\n\nMet vriendelijke groet,\n${companyData.name}`,
      });
    } catch (error) {
      Alert.alert(
        'Fout',
        'Er is een probleem opgetreden bij het versturen van de e-mail.'
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="bg-white px-6 py-4 flex-row items-center justify-between shadow-sm">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center mr-3"
          >
            <MaterialIcons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-JakartaBold text-gray-800">
              {invoiceData.invoiceNumber}
            </Text>
            <Text className="text-gray-500 font-Jakarta">
              {invoiceData.clientInfo.name}
            </Text>
          </View>
        </View>
        <View
          className={`px-3 py-1 rounded-full ${getStatusColor(invoiceData.status)}`}
        >
          <Text className="text-sm font-JakartaMedium">
            {getStatusText(invoiceData.status)}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Invoice Preview */}
        <View className="bg-white mx-6 mt-6 rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <View className="p-6 border-b border-gray-100">
            <View className="flex-row justify-between items-start mb-6">
              <View className="flex-row items-center">
                <View className="w-16 h-16 bg-primary-500 rounded-xl items-center justify-center mr-4">
                  <Text className="text-white font-JakartaBold text-xl">
                    {invoiceData.clientInfo.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View>
                  <Text className="text-2xl font-JakartaBold text-gray-900">
                    FACTUUR
                  </Text>
                  <Text className="text-gray-600 font-Jakarta">
                    {invoiceData.invoiceNumber}
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-gray-600 font-Jakarta">Factuurdatum</Text>
                <Text className="font-JakartaSemiBold text-gray-900">
                  {formatDate(invoiceData.date)}
                </Text>
                <Text className="text-gray-600 font-Jakarta mt-2">
                  Vervaldatum
                </Text>
                <Text className="font-JakartaSemiBold text-gray-900">
                  {formatDate(invoiceData.dueDate)}
                </Text>
              </View>
            </View>

            {/* Company Info */}
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
            </View>
          </View>

          {/* Client Info */}
          <View className="p-6 border-b border-gray-100">
            <Text className="text-lg font-JakartaSemiBold text-gray-800 mb-3">
              Aan:
            </Text>
            <Text className="font-JakartaSemiBold text-gray-900 text-base">
              {invoiceData.clientInfo.name}
            </Text>
            <Text className="text-gray-600 font-Jakarta mt-1">
              {invoiceData.clientInfo.email}
            </Text>
            <Text className="text-gray-600 font-Jakarta mt-1">
              {invoiceData.clientInfo.address}
            </Text>
            <Text className="text-gray-600 font-Jakarta mt-1">
              {invoiceData.clientInfo.phone}
            </Text>
          </View>

          {/* Invoice Lines */}
          <View className="p-6 border-b border-gray-100">
            <Text className="text-lg font-JakartaSemiBold text-gray-800 mb-4">
              Factuurregels:
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="min-w-full">
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

                {invoiceData.invoiceLines.map((line) => (
                  <View
                    key={line.id}
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
                  {formatCurrency(invoiceData.totals.subtotal)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600 font-Jakarta">BTW:</Text>
                <Text className="text-gray-900 font-JakartaMedium">
                  {formatCurrency(invoiceData.totals.vat)}
                </Text>
              </View>
              <View className="flex-row justify-between pt-2 border-t border-gray-200">
                <Text className="text-lg font-JakartaBold text-gray-900">
                  Totaal:
                </Text>
                <Text className="text-lg font-JakartaBold text-primary-500">
                  {formatCurrency(invoiceData.totals.total)}
                </Text>
              </View>
            </View>
          </View>

          {/* Notes */}
          {invoiceData.notes && (
            <View className="p-6">
              <Text className="text-lg font-JakartaSemiBold text-gray-800 mb-3">
                Notities & Voorwaarden:
              </Text>
              <Text className="text-gray-700 font-Jakarta leading-6">
                {invoiceData.notes}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className="px-6 py-6 gap-y-4">
          {/* Primary Actions */}
          <View className="flex-row gap-x-4">
            <CustomButton
              title={isGeneratingPDF ? 'Genereren...' : 'PDF Delen'}
              onPress={generatePDF}
              disabled={isGeneratingPDF}
              className={`flex-1 ${isGeneratingPDF ? 'opacity-50' : ''}`}
              IconLeft={() => (
                <MaterialIcons
                  name="picture-as-pdf"
                  size={20}
                  color="white"
                  style={{ marginRight: 8 }}
                />
              )}
            />
            <CustomButton
              title="E-mail"
              onPress={sendByEmail}
              bgVariant="outline"
              textVariant="primary"
              className="flex-1"
              IconLeft={() => (
                <MaterialIcons
                  name="email"
                  size={20}
                  color="#43d478"
                  style={{ marginRight: 8 }}
                />
              )}
            />
          </View>

          {/* Secondary Actions */}
          <View className="bg-white rounded-2xl p-4 shadow-sm gap-y-2">
            <TouchableOpacity
              onPress={handleStatusUpdate}
              className="flex-row items-center justify-between p-3"
            >
              <View className="flex-row items-center">
                <MaterialIcons name="edit" size={20} color="#6b7280" />
                <Text className="ml-3 font-JakartaMedium text-gray-900">
                  Status wijzigen
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <View className="h-px bg-gray-100 ml-11" />

            <TouchableOpacity
              onPress={handleDeleteInvoice}
              className="flex-row items-center justify-between p-3"
            >
              <View className="flex-row items-center">
                <MaterialIcons
                  name="delete-outline"
                  size={20}
                  color="#ef4444"
                />
                <Text className="ml-3 font-JakartaMedium text-red-600">
                  Factuur verwijderen
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
