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
  postcode: z
    .string()
    .regex(/^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/, 'Voer een geldige postcode in'),
  huisnummer: z.string().min(1, 'Huisnummer is verplicht'),
  straat: z.string().min(3, 'Straatnaam is verplicht'),
  plaats: z.string().min(2, 'Plaatsnaam is verplicht'),
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

        <View className="flex-row justify-between gap-x-4">
          <View className="basis-3/5">
            <Controller
              control={control}
              name="postcode"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Postcode *"
                  placeholder="8301 AB"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  containerStyle={errors.postcode ? 'border-red-500' : ''}
                />
              )}
            />
            {errors.postcode && (
              <Text className="text-red-500 text-sm font-Jakarta mb-2">
                {errors.postcode.message}
              </Text>
            )}
          </View>
          <View className="basis-2/5">
            <Controller
              control={control}
              name="huisnummer"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Huisnummer *"
                  placeholder="114A"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  containerStyle={errors.huisnummer ? 'border-red-500' : ''}
                />
              )}
            />
            {errors.huisnummer && (
              <Text className="text-red-500 text-sm font-Jakarta mb-2">
                {errors.huisnummer.message}
              </Text>
            )}
          </View>
        </View>

        <Controller
          control={control}
          name="straat"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Straatnaam *"
              placeholder="Hoofdstraat"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              containerStyle={errors.straat ? 'border-red-500' : ''}
            />
          )}
        />
        {errors.straat && (
          <Text className="text-red-500 text-sm font-Jakarta mb-2">
            {errors.straat.message}
          </Text>
        )}

        <Controller
          control={control}
          name="plaats"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Plaats *"
              placeholder="Amsterdam"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              containerStyle={errors.plaats ? 'border-red-500' : ''}
            />
          )}
        />
        {errors.plaats && (
          <Text className="text-red-500 text-sm font-Jakarta mb-2">
            {errors.plaats.message}
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
      <View className="py-4">
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
