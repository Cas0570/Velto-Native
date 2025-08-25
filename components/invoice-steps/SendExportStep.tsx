import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MailComposer from 'expo-mail-composer';
import CustomButton from '@/components/CustomButton';
import { formatCurrency, formatDate } from '@/utils';
import type { NewInvoiceStepProps } from '@/types/type';
import { companyData } from '@/constants';
import { router } from 'expo-router';

const SendExportStep = ({ data, onPrevious }: NewInvoiceStepProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUri, setPdfUri] = useState<string | null>(null);

  const currentDate = new Date().toISOString().split('T')[0];
  const primaryColor = data.options.primaryColor || '#43d478';

  // Generate HTML template for PDF
  const generateHTMLTemplate = () => {
    const invoiceLines = data.invoiceLines
      .map(
        (line) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px 0; color: #374151;">${line.description}</td>
        <td style="padding: 12px 0; text-align: center; color: #374151;">${line.quantity}</td>
        <td style="padding: 12px 0; text-align: right; color: #374151;">${formatCurrency(line.unitPrice)}</td>
        <td style="padding: 12px 0; text-align: center; color: #374151;">${Math.round(line.vatRate * 100)}%</td>
        <td style="padding: 12px 0; text-align: right; font-weight: 600; color: #374151;">${formatCurrency(line.total)}</td>
      </tr>
    `
      )
      .join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Factuur ${data.calculated.invoiceNumber}</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.5;
          color: #374151;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .header { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-start;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e5e7eb;
        }
        .logo { 
          display: flex; 
          align-items: center;
        }
        .logo-circle {
          width: 60px;
          height: 60px;
          background-color: ${primaryColor};
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          color: white;
          font-weight: bold;
          font-size: 24px;
        }
        .invoice-title { 
          font-size: 32px; 
          font-weight: bold; 
          color: #111827;
          margin: 0;
        }
        .invoice-number { 
          color: #6b7280;
          margin: 4px 0 0 0;
        }
        .invoice-dates { 
          text-align: right;
        }
        .date-label { 
          color: #6b7280;
          font-size: 14px;
          margin: 0;
        }
        .date-value { 
          font-weight: 600;
          color: #111827;
          margin: 2px 0 12px 0;
        }
        .company-info {
          margin-bottom: 30px;
        }
        .section-title { 
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }
        .company-details, .client-details {
          margin-bottom: 30px;
        }
        .client-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 12px;
        }
        .details {
          line-height: 1.6;
        }
        .details p {
          margin: 4px 0;
        }
        .client-name {
          font-weight: 600;
          color: #111827;
          font-size: 16px;
        }
        .invoice-table { 
          width: 100%; 
          border-collapse: collapse;
          margin: 30px 0;
        }
        .table-header {
          background-color: #f9fafb;
          border-bottom: 2px solid #e5e7eb;
        }
        .table-header th { 
          padding: 16px 12px;
          font-weight: 600;
          font-size: 14px;
          color: #374151;
          text-align: left;
        }
        .table-header th:nth-child(2),
        .table-header th:nth-child(4) { text-align: center; }
        .table-header th:nth-child(3),
        .table-header th:nth-child(5) { text-align: right; }
        .totals {
          margin: 30px 0;
          text-align: right;
        }
        .totals-row {
          display: flex;
          justify-content: space-between;
          margin: 8px 0;
          padding: 8px 0;
        }
        .totals-final {
          border-top: 2px solid #e5e7eb;
          padding-top: 12px;
          font-size: 18px;
          font-weight: bold;
        }
        .total-amount {
          color: ${primaryColor};
        }
        .payment-info {
          background-color: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin: 30px 0;
        }
        .notes {
          background-color: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">
          <div class="logo-circle">
            ${data.clientInfo.name.charAt(0).toUpperCase() || 'V'}
          </div>
          <div>
            <h1 class="invoice-title">FACTUUR</h1>
            <p class="invoice-number">${data.calculated.invoiceNumber}</p>
          </div>
        </div>
        <div class="invoice-dates">
          <p class="date-label">Factuurdatum</p>
          <p class="date-value">${formatDate(currentDate)}</p>
          <p class="date-label">Vervaldatum</p>
          <p class="date-value">${formatDate(data.calculated.dueDate)}</p>
        </div>
      </div>

      <div class="company-info">
        <div class="client-title">Van:</div>
        <div class="details">
          <p style="font-weight: 600; color: #111827;">${companyData.name}</p>
          <p>${companyData.email}</p>
          <p>${companyData.address}</p>
          <p>KVK: ${companyData.kvk} | BTW: ${companyData.btw}</p>
          <p>IBAN: ${companyData.iban}</p>
        </div>
      </div>

      <div class="client-details">
        <div class="client-title">Aan:</div>
        <div class="details">
          <p class="client-name">${data.clientInfo.name}</p>
          <p>${data.clientInfo.email}</p>
          <p>${data.clientInfo.straat} ${data.clientInfo.huisnummer}, ${data.clientInfo.postcode} ${data.clientInfo.plaats}</p>
          ${data.clientInfo.phone ? `<p>${data.clientInfo.phone}</p>` : ''}
        </div>
      </div>

      <table class="invoice-table">
        <thead class="table-header">
          <tr>
            <th>Omschrijving</th>
            <th>Aantal</th>
            <th>Prijs</th>
            <th>BTW</th>
            <th>Totaal</th>
          </tr>
        </thead>
        <tbody>
          ${invoiceLines}
        </tbody>
      </table>

      <div class="totals">
        <div class="totals-row">
          <span>Subtotaal:</span>
          <span>${formatCurrency(data.calculated.subtotal)}</span>
        </div>
        <div class="totals-row">
          <span>BTW:</span>
          <span>${formatCurrency(data.calculated.totalVat)}</span>
        </div>
        <div class="totals-row totals-final">
          <span>Totaal:</span>
          <span class="total-amount">${formatCurrency(data.calculated.total)}</span>
        </div>
      </div>

      <div class="payment-info">
        <div class="section-title">Betaalinformatie:</div>
        <p><strong>${
          data.options.paymentMethod === 'tikkie'
            ? 'Tikkie'
            : data.options.paymentMethod === 'paypal'
              ? 'PayPal'
              : 'Bankoverschrijving'
        }</strong></p>
        ${data.options.paymentLink ? `<p>Betalingslink: ${data.options.paymentLink}</p>` : ''}
        ${
          data.options.paymentMethod === 'bank'
            ? '<p>Gelieve het totaalbedrag over te maken naar onze bankrekening met vermelding van het factuurnummer.</p>'
            : ''
        }
      </div>

      ${
        data.options.notes
          ? `
        <div class="notes">
          <div class="section-title">Notities & Voorwaarden:</div>
          <p>${data.options.notes.replace(/\n/g, '<br>')}</p>
        </div>
      `
          : ''
      }
    </body>
    </html>
    `;
  };

  const generatePDF = async () => {
    try {
      setIsGenerating(true);
      const html = generateHTMLTemplate();

      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      setPdfUri(uri);
      setIsGenerating(false);

      Alert.alert(
        'PDF Gegenereerd',
        'Je factuur is succesvol gegenereerd als PDF!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      setIsGenerating(false);
      Alert.alert(
        'Fout',
        'Er is een fout opgetreden bij het genereren van de PDF.',
        [{ text: 'OK' }]
      );
    }
  };

  const sharePDF = async () => {
    if (!pdfUri) {
      Alert.alert('Fout', 'Genereer eerst een PDF voordat je deze kunt delen.');
      return;
    }

    try {
      await Sharing.shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Factuur delen',
        UTI: 'com.adobe.pdf',
      });
    } catch (error) {
      Alert.alert(
        'Fout',
        'Er is een fout opgetreden bij het delen van de PDF.'
      );
    }
  };

  const sendByEmail = async () => {
    if (!pdfUri) {
      Alert.alert(
        'Fout',
        'Genereer eerst een PDF voordat je deze kunt versturen.'
      );
      return;
    }

    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Fout', 'E-mail is niet beschikbaar op dit apparaat.');
      return;
    }

    try {
      await MailComposer.composeAsync({
        recipients: [data.clientInfo.email],
        subject: `Factuur ${data.calculated.invoiceNumber} - ${data.clientInfo.name}`,
        body: `Beste ${data.clientInfo.name},\n\nHierbij ontvang je factuur ${data.calculated.invoiceNumber} ter waarde van ${formatCurrency(data.calculated.total)}.\n\nDe factuur is betaalbaar binnen 30 dagen.\n\nMet vriendelijke groet,\nJouw Bedrijf BV`,
        attachments: [pdfUri],
      });
    } catch (error) {
      Alert.alert(
        'Fout',
        'Er is een fout opgetreden bij het versturen van de e-mail.'
      );
    }
  };

  const saveToDevice = async () => {
    if (!pdfUri) {
      Alert.alert(
        'Fout',
        'Genereer eerst een PDF voordat je deze kunt opslaan.'
      );
      return;
    }

    try {
      const filename = `Factuur_${data.calculated.invoiceNumber.replace('#', '')}_${data.clientInfo.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      const documentDirectory = FileSystem.documentDirectory;

      if (documentDirectory) {
        const newPath = `${documentDirectory}${filename}`;
        await FileSystem.copyAsync({
          from: pdfUri,
          to: newPath,
        });

        Alert.alert('Opgeslagen', `Factuur is opgeslagen als: ${filename}`, [
          { text: 'OK' },
        ]);
      }
    } catch (error) {
      Alert.alert(
        'Fout',
        'Er is een fout opgetreden bij het opslaan van de PDF.'
      );
    }
  };

  return (
    <ScrollView
      className="flex-1 px-6 py-4"
      showsVerticalScrollIndicator={false}
    >
      {/* Header Info */}
      <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
        <Text className="text-lg font-JakartaSemiBold text-gray-800 mb-2">
          Versturen & Exporteren
        </Text>
        <Text className="text-gray-600 font-Jakarta">
          Exporteer je factuur als PDF en deel deze met je klant.
        </Text>
      </View>

      {/* Invoice Summary */}
      <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
        <Text className="text-base font-JakartaSemiBold text-gray-800 mb-4">
          Factuur overzicht
        </Text>
        <View className="flex-row justify-between items-center p-4 bg-gray-50 rounded-xl">
          <View>
            <Text className="font-JakartaSemiBold text-gray-900">
              {data.calculated.invoiceNumber}
            </Text>
            <Text className="text-gray-600 font-Jakarta text-sm">
              {data.clientInfo.name}
            </Text>
          </View>
          <Text
            className="text-xl font-JakartaBold"
            style={{ color: primaryColor }}
          >
            {formatCurrency(data.calculated.total)}
          </Text>
        </View>
      </View>

      {/* PDF Generation */}
      <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
        <Text className="text-base font-JakartaSemiBold text-gray-800 mb-4">
          PDF Genereren
        </Text>
        <CustomButton
          title={
            isGenerating
              ? 'Genereren...'
              : pdfUri
                ? 'PDF Gegenereerd ✓'
                : 'PDF Genereren'
          }
          onPress={generatePDF}
          disabled={isGenerating}
          bgVariant={pdfUri ? 'success' : 'primary'}
          className={`mb-4 ${isGenerating ? 'opacity-50' : ''}`}
        />

        {pdfUri && (
          <View className="bg-green-50 border border-green-200 rounded-xl p-4">
            <View className="flex-row items-center">
              <MaterialIcons name="check-circle" size={20} color="#10b981" />
              <Text className="ml-2 text-green-700 font-JakartaMedium">
                PDF succesvol gegenereerd!
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Sharing Options */}
      {pdfUri && (
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <Text className="text-base font-JakartaSemiBold text-gray-800 mb-4">
            Delen & Versturen
          </Text>

          <View className="gap-y-3">
            {/* Email Option */}
            <TouchableOpacity
              onPress={sendByEmail}
              className="flex-row items-center p-4 bg-blue-50 rounded-xl border border-blue-200"
            >
              <View className="w-12 h-12 bg-blue-100 rounded-xl items-center justify-center mr-4">
                <MaterialIcons name="email" size={24} color="#3b82f6" />
              </View>
              <View className="flex-1">
                <Text className="font-JakartaSemiBold text-blue-700">
                  E-mail versturen
                </Text>
                <Text className="text-blue-600 font-Jakarta text-sm">
                  Stuur direct naar {data.clientInfo.email}
                </Text>
              </View>
              <MaterialIcons
                name="arrow-forward-ios"
                size={16}
                color="#3b82f6"
              />
            </TouchableOpacity>

            {/* Share Option */}
            <TouchableOpacity
              onPress={sharePDF}
              className="flex-row items-center p-4 bg-green-50 rounded-xl border border-green-200"
            >
              <View className="w-12 h-12 bg-green-100 rounded-xl items-center justify-center mr-4">
                <MaterialIcons name="share" size={24} color="#10b981" />
              </View>
              <View className="flex-1">
                <Text className="font-JakartaSemiBold text-green-700">
                  Delen via WhatsApp/Andere apps
                </Text>
                <Text className="text-green-600 font-Jakarta text-sm">
                  Deel via je favoriete app
                </Text>
              </View>
              <MaterialIcons
                name="arrow-forward-ios"
                size={16}
                color="#10b981"
              />
            </TouchableOpacity>

            {/* Save Option */}
            <TouchableOpacity
              onPress={saveToDevice}
              className="flex-row items-center p-4 bg-purple-50 rounded-xl border border-purple-200"
            >
              <View className="w-12 h-12 bg-purple-100 rounded-xl items-center justify-center mr-4">
                <MaterialIcons name="save" size={24} color="#8b5cf6" />
              </View>
              <View className="flex-1">
                <Text className="font-JakartaSemiBold text-purple-700">
                  Opslaan op apparaat
                </Text>
                <Text className="text-purple-600 font-Jakarta text-sm">
                  Bewaar PDF in documenten
                </Text>
              </View>
              <MaterialIcons
                name="arrow-forward-ios"
                size={16}
                color="#8b5cf6"
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* Success Message */}
      {pdfUri && (
        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <View className="items-center">
            <View
              className="w-16 h-16 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: primaryColor }}
            >
              <MaterialIcons name="check" size={32} color="white" />
            </View>
            <Text className="text-lg font-JakartaSemiBold text-gray-800 text-center mb-2">
              Factuur Gereed!
            </Text>
            <Text className="text-gray-600 font-Jakarta text-center">
              Je factuur is succesvol aangemaakt en klaar om te versturen.
            </Text>
          </View>
        </View>
      )}

      {/* Bottom Actions */}
      <View className="py-4 flex-row gap-x-4">
        <CustomButton
          title="Vorige"
          onPress={onPrevious}
          bgVariant="outline"
          textVariant="primary"
          className="flex-1"
        />
        <CustomButton
          title="Afronden"
          onPress={() => router.push('/(tabs)/invoices')}
          className="flex-1"
        />
      </View>
    </ScrollView>
  );
};

export default SendExportStep;
