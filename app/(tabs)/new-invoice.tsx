import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router } from 'expo-router';
import PageHeader from '@/components/PageHeader';
import CustomButton from '@/components/CustomButton';
import InputField from '@/components/InputField';

// Validation schemas for each step
const clientInfoSchema = z.object({
  clientName: z.string().min(2, 'Bedrijfsnaam moet minimaal 2 karakters zijn'),
  clientEmail: z.string().email('Voer een geldig e-mailadres in'),
  clientAddress: z.string().optional(),
  clientCity: z.string().optional(),
  clientPostalCode: z.string().optional(),
});

type ClientInfoFormData = z.infer<typeof clientInfoSchema>;

// Steps configuration
const steps = [
  { id: 1, title: 'Klantgegevens', description: 'Gegevens van je klant' },
  { id: 2, title: 'Factuurregels', description: 'Producten en diensten' },
  { id: 3, title: 'Extra opties', description: 'Logo, kleuren en notities' },
  { id: 4, title: 'Voorvertoning', description: 'Controleer je factuur' },
  { id: 5, title: 'Versturen', description: 'Verstuur of exporteer' },
];

export default function NewInvoice() {
  const [currentStep, setCurrentStep] = useState(1);
  const [invoiceData, setInvoiceData] = useState<any>({});

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ClientInfoFormData>({
    resolver: zodResolver(clientInfoSchema),
    mode: 'onChange',
    defaultValues: {
      clientName: '',
      clientEmail: '',
      clientAddress: '',
      clientCity: '',
      clientPostalCode: '',
    },
  });

  const currentStepData = steps.find((step) => step.id === currentStep);

  const onSubmitStep1 = (data: ClientInfoFormData) => {
    console.log('Step 1 data:', data);
    setInvoiceData((prev: any) => ({ ...prev, client: data }));
    setCurrentStep(2);
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const renderProgressBar = () => (
    <View className="px-6 py-4">
      <View className="flex-row justify-between items-center mb-4">
        {steps.map((step, index) => (
          <View key={step.id} className="flex-1 items-center">
            <View
              className={`w-8 h-8 rounded-full items-center justify-center ${
                step.id <= currentStep ? 'bg-primary-500' : 'bg-gray-200'
              }`}
            >
              {step.id < currentStep ? (
                <MaterialIcons name="check" size={16} color="white" />
              ) : (
                <Text
                  className={`text-sm font-JakartaBold ${
                    step.id <= currentStep ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  {step.id}
                </Text>
              )}
            </View>
            {index < steps.length - 1 && (
              <View
                className={`absolute top-4 left-1/2 w-full h-0.5 -translate-x-1/2 ${
                  step.id < currentStep ? 'bg-primary-500' : 'bg-gray-200'
                }`}
                style={{ marginLeft: '50%', width: '100%' }}
              />
            )}
          </View>
        ))}
      </View>
      <Text className="text-center font-JakartaSemiBold text-gray-800 text-lg">
        {currentStepData?.title}
      </Text>
      <Text className="text-center font-Jakarta text-gray-500 text-sm">
        {currentStepData?.description}
      </Text>
    </View>
  );

  const renderStep1 = () => (
    <View className="px-6 flex-1">
      <View className="bg-white rounded-2xl p-6 shadow-sm">
        <Text className="text-lg font-JakartaSemiBold text-gray-800 mb-4">
          Klantgegevens
        </Text>

        <Controller
          control={control}
          name="clientName"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Bedrijfsnaam *"
              placeholder="Bijv. Acme BV"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              containerStyle={errors.clientName ? 'border-red-500' : ''}
            />
          )}
        />
        {errors.clientName && (
          <Text className="text-red-500 text-sm font-Jakarta mt-1 px-4">
            {errors.clientName.message}
          </Text>
        )}

        <Controller
          control={control}
          name="clientEmail"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="E-mailadres *"
              placeholder="info@acme.nl"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
              textContentType="emailAddress"
              containerStyle={errors.clientEmail ? 'border-red-500' : ''}
            />
          )}
        />
        {errors.clientEmail && (
          <Text className="text-red-500 text-sm font-Jakarta mt-1 px-4">
            {errors.clientEmail.message}
          </Text>
        )}

        <Controller
          control={control}
          name="clientAddress"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Adres"
              placeholder="Hoofdstraat 123"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />

        <View className="flex-row gap-x-4">
          <View className="flex-1">
            <Controller
              control={control}
              name="clientPostalCode"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Postcode"
                  placeholder="1234 AB"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </View>
          <View className="flex-1">
            <Controller
              control={control}
              name="clientCity"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Plaats"
                  placeholder="Amsterdam"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
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
        return renderStep1();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <PageHeader
        title="Nieuwe Factuur"
        subtitle={`Stap ${currentStep} van ${steps.length}`}
        rightElement={
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        }
      />

      {renderProgressBar()}

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>

      {/* Bottom Actions */}
      <View className="px-6 py-4 bg-white border-t border-gray-100">
        <View className="flex-row gap-x-4">
          <CustomButton
            title={currentStep === 1 ? 'Annuleren' : 'Vorige'}
            bgVariant="outline"
            textVariant="primary"
            onPress={goBack}
            className="flex-1"
          />
          <CustomButton
            title={currentStep === steps.length ? 'Voltooien' : 'Volgende'}
            onPress={
              currentStep === 1
                ? handleSubmit(onSubmitStep1)
                : () => setCurrentStep(currentStep + 1)
            }
            className="flex-1"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
