import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { invoiceSteps } from '@/constants';
import PageHeader from '@/components/PageHeader';
import StepIndicator from '@/components/StepIndicator';
import ClientInfoStep from '@/components/invoice-steps/ClientInfoStep';
import InvoiceLinesStep from '@/components/invoice-steps/InvoiceLinesStep';
import type { NewInvoiceData } from '@/types/type';

// Initial empty data structure
const initialInvoiceData: NewInvoiceData = {
  clientInfo: {
    name: '',
    email: '',
    straat: '',
    postcode: '',
    huisnummer: '',
    phone: '',
  },
  invoiceLines: [],
  options: {
    notes: '',
    paymentMethod: 'bank',
  },
  calculated: {
    subtotal: 0,
    totalVat: 0,
    total: 0,
    invoiceNumber: `#${String(Date.now()).slice(-6)}`, // Simple ID generation
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0], // 30 days from now
  },
};

export default function NewInvoice() {
  const [currentStep, setCurrentStep] = useState(1);
  const [invoiceData, setInvoiceData] =
    useState<NewInvoiceData>(initialInvoiceData);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateData = useCallback((data: Partial<NewInvoiceData>) => {
    setInvoiceData((prev) => ({
      ...prev,
      ...data,
    }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < invoiceSteps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const renderCurrentStep = () => {
    const stepProps = {
      data: invoiceData,
      onUpdate: handleUpdateData,
      onNext: handleNext,
      onPrevious: handlePrevious,
      isLoading,
    };

    switch (currentStep) {
      case 1:
        return <ClientInfoStep {...stepProps} />;
      case 2:
        return <InvoiceLinesStep {...stepProps} />;
      case 3:
        return (
          <View className="p-6">
            <Text className="text-lg">Extra Options Step - Coming Soon</Text>
          </View>
        );
      case 4:
        return (
          <View className="p-6">
            <Text className="text-lg">Preview Step - Coming Soon</Text>
          </View>
        );
      case 5:
        return (
          <View className="p-6">
            <Text className="text-lg">Send Step - Coming Soon</Text>
          </View>
        );
      default:
        return <ClientInfoStep {...stepProps} />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <PageHeader
        title="Nieuwe Factuur"
        subtitle={`Stap ${currentStep} van ${invoiceSteps.length}: ${invoiceSteps[currentStep - 1]?.title}`}
      />

      <StepIndicator steps={invoiceSteps} currentStep={currentStep} />

      <View className="flex-1">{renderCurrentStep()}</View>
    </SafeAreaView>
  );
}
