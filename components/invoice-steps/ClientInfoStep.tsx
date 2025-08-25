import { View, Text, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import InputField from '@/components/InputField';
import CustomButton from '@/components/CustomButton';
import type { NewInvoiceStepProps } from '@/types/type';

// Validation schema
const clientInfoSchema = z.object({
  name: z.string().min(2, 'Bedrijfsnaam is verplicht'),
  email: z.string().email('Voer een geldig e-mailadres in'),
  address: z.string().min(3, 'Adres is verplicht'),
  phone: z.string().optional(),
});

type ClientInfoForm = z.infer<typeof clientInfoSchema>;

const ClientInfoStep = ({ data, onUpdate, onNext }: NewInvoiceStepProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ClientInfoForm>({
    resolver: zodResolver(clientInfoSchema),
    defaultValues: data.clientInfo,
    mode: 'onChange',
  });

  const onSubmit = (formData: ClientInfoForm) => {
    onUpdate({
      clientInfo: formData,
    });
    onNext();
  };

  return (
    <ScrollView className="flex px-6 py-4" showsVerticalScrollIndicator={false}>
      {/* Header Info */}
      <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
        <Text className="text-lg font-JakartaSemiBold text-gray-800 mb-2">
          Klantgegevens
        </Text>
        <Text className="text-gray-600 font-Jakarta">
          Voer de gegevens van je klant in voor op de factuur.
        </Text>
      </View>

      {/* Form */}
      <View className="bg-white rounded-2xl p-6 shadow-sm">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="(Bedrijfs)naam *"
              placeholder="Bijv. Acme BV"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              containerStyle={errors.name ? 'border-red-500' : ''}
            />
          )}
        />
        {errors.name && (
          <Text className="text-red-500 text-sm font-Jakarta mb-2">
            {errors.name.message}
          </Text>
        )}

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="E-mailadres *"
              placeholder="info@acme.nl"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={errors.email ? 'border-red-500' : ''}
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-500 text-sm font-Jakarta mb-2">
            {errors.email.message}
          </Text>
        )}

        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Adres *"
              placeholder="Hoofdstraat 123, 1234 AB Amsterdam"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              numberOfLines={2}
              containerStyle={errors.address ? 'border-red-500' : ''}
            />
          )}
        />
        {errors.address && (
          <Text className="text-red-500 text-sm font-Jakarta mb-2">
            {errors.address.message}
          </Text>
        )}

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Telefoonnummer"
              placeholder="+31 6 12345678"
              value={value || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="phone-pad"
            />
          )}
        />

        <Text className="text-xs text-gray-500 font-Jakarta mt-4">
          * Verplichte velden
        </Text>
      </View>

      {/* Bottom Action */}
      <View className="px-6 py-4">
        <CustomButton
          title="Volgende Stap"
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid}
          className={!isValid ? 'opacity-50' : ''}
        />
      </View>
    </ScrollView>
  );
};

export default ClientInfoStep;
