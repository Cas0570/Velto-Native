import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import { router } from 'expo-router';
import { invoiceSteps } from '@/constants';
import PageHeader from '@/components/PageHeader';
import ProgressBar from '@/components/ProgressBar';
import CustomButton from '@/components/CustomButton';
import Step1ClientInfo, {
  Step1ClientInfoRef,
} from '@/components/invoice-steps/Step1ClientInfo';
import type { InvoiceFormData, ClientInfoFormData } from '@/types/type';

export default function NewInvoice() {
  const [currentStep, setCurrentStep] = useState(1);
  const [invoiceData, setInvoiceData] = useState<Partial<InvoiceFormData>>({});
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);

  // Refs for step components
  const step1Ref = useRef<Step1ClientInfoRef>(null);

  const onSubmitStep1 = (data: ClientInfoFormData) => {
    console.log('Step 1 data:', data);
    setInvoiceData((prev) => ({ ...prev, client: data }));
    setCurrentStep(2);
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const goNext = () => {
    if (currentStep === 1) {
      step1Ref.current?.submitForm();
      return;
    }

    if (currentStep < invoiceSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1ClientInfo
            ref={step1Ref}
            onSubmit={onSubmitStep1}
            defaultValues={invoiceData.client}
            onFormValidityChange={setIsCurrentStepValid}
          />
        );
      case 2:
        return (
          <View className="px-6 flex-1 justify-center items-center">
            <Text className="text-gray-500 font-Jakarta">
              Stap 2: Factuurregels (Nog niet geïmplementeerd)
            </Text>
          </View>
        );
      case 3:
        return (
          <View className="px-6 flex-1 justify-center items-center">
            <Text className="text-gray-500 font-Jakarta">
              Stap 3: Extra opties (Nog niet geïmplementeerd)
            </Text>
          </View>
        );
      case 4:
        return (
          <View className="px-6 flex-1 justify-center items-center">
            <Text className="text-gray-500 font-Jakarta">
              Stap 4: Voorvertoning (Nog niet geïmplementeerd)
            </Text>
          </View>
        );
      case 5:
        return (
          <View className="px-6 flex-1 justify-center items-center">
            <Text className="text-gray-500 font-Jakarta">
              Stap 5: Versturen (Nog niet geïmplementeerd)
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  const isNextButtonDisabled = () => {
    if (currentStep === 1) {
      return !isCurrentStepValid;
    }
    return false;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <PageHeader
        title="Nieuwe Factuur"
        subtitle={`Stap ${currentStep} van ${invoiceSteps.length}`}
        rightElement={
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        }
      />

      <ProgressBar steps={invoiceSteps} currentStep={currentStep} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>

      {/* Bottom Actions */}
      <View className="px-6 pt-8  border-gray-100">
        <View className="flex-row gap-x-4">
          <CustomButton
            title={currentStep === 1 ? 'Annuleren' : 'Vorige'}
            bgVariant="outline"
            textVariant="primary"
            onPress={goBack}
            className="flex-1"
          />
          <CustomButton
            title={
              currentStep === invoiceSteps.length ? 'Voltooien' : 'Volgende'
            }
            onPress={goNext}
            className={`flex-1 ${isNextButtonDisabled() ? 'opacity-50' : ''}`}
            disabled={isNextButtonDisabled()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
