import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import InputField from '@/components/InputField';
import CustomButton from '@/components/CustomButton';
import { paymentMethods, colorOptions } from '@/constants';
import type { NewInvoiceStepProps } from '@/types/type';

// Validation schema
const extraOptionsSchema = z.object({
  notes: z.string().optional(),
  paymentMethod: z.enum(['tikkie', 'paypal', 'bank']),
  paymentLink: z
    .string()
    .url('Voer een geldige URL in')
    .optional()
    .or(z.literal('')),
  primaryColor: z.string().optional(),
});

type ExtraOptionsForm = z.infer<typeof extraOptionsSchema>;

const ExtraOptionsStep = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
}: NewInvoiceStepProps) => {
  const [selectedLogo, setSelectedLogo] = useState<string | null>(
    data.options.logo || null
  );

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ExtraOptionsForm>({
    resolver: zodResolver(extraOptionsSchema),
    defaultValues: {
      notes: data.options.notes || '',
      paymentMethod: data.options.paymentMethod || 'bank',
      paymentLink: data.options.paymentLink || '',
      primaryColor: data.options.primaryColor || '#43d478',
    },
    mode: 'onChange',
  });

  const watchedPaymentMethod = watch('paymentMethod');

  const pickImage = async () => {
    // Request permission
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Toestemming vereist',
        "Toegang tot je foto's is nodig om een logo te selecteren."
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedLogo(result.assets[0].uri);
      onUpdate({
        options: {
          ...data.options,
          logo: result.assets[0].uri,
        },
      });
    }
  };

  const removeLogo = () => {
    setSelectedLogo(null);
    onUpdate({
      options: {
        ...data.options,
        logo: undefined,
      },
    });
  };

  const onSubmit = (formData: ExtraOptionsForm) => {
    onUpdate({
      options: {
        ...data.options,
        ...formData,
        logo: selectedLogo || undefined,
      },
    });
    onNext();
  };

  return (
    <ScrollView
      className="flex-1 px-6 py-4"
      showsVerticalScrollIndicator={false}
    >
      {/* Header Info */}
      <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
        <Text className="text-lg font-JakartaSemiBold text-gray-800 mb-2">
          Extra Opties
        </Text>
        <Text className="text-gray-600 font-Jakarta">
          Personaliseer je factuur met logo, kleuren en betalingsopties.
        </Text>
      </View>

      {/* Logo Upload Section */}
      <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
        <Text className="text-base font-JakartaSemiBold text-gray-800 mb-4">
          Bedrijfslogo (optioneel)
        </Text>

        {selectedLogo ? (
          <View className="items-center">
            <View className="w-24 h-24 bg-gray-100 rounded-xl items-center justify-center mb-4">
              <MaterialIcons name="image" size={40} color="#9ca3af" />
            </View>
            <Text className="text-sm text-gray-600 mb-4 text-center">
              Logo geselecteerd
            </Text>
            <View className="flex-row gap-x-4">
              <TouchableOpacity
                onPress={pickImage}
                className="flex-1 bg-primary-100 rounded-xl p-3"
              >
                <Text className="text-primary-600 font-JakartaMedium text-center">
                  Vervangen
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={removeLogo}
                className="flex-1 bg-red-100 rounded-xl p-3"
              >
                <Text className="text-red-600 font-JakartaMedium text-center">
                  Verwijderen
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={pickImage}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 items-center"
          >
            <MaterialIcons
              name="add-photo-alternate"
              size={48}
              color="#9ca3af"
            />
            <Text className="text-gray-600 font-JakartaMedium mt-3">
              Logo toevoegen
            </Text>
            <Text className="text-gray-400 font-Jakarta text-sm mt-1">
              Aanbevolen: 200x200px
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Color Selection */}
      <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
        <Text className="text-base font-JakartaSemiBold text-gray-800 mb-4">
          Primaire kleur
        </Text>
        <Controller
          control={control}
          name="primaryColor"
          render={({ field: { onChange, value } }) => (
            <View className="flex-row flex-wrap gap-3">
              {colorOptions.map((option) => (
                <TouchableOpacity
                  key={option.color}
                  onPress={() => onChange(option.color)}
                  className={`flex-row items-center p-3 rounded-xl border-2 ${
                    value === option.color
                      ? 'border-gray-400 bg-gray-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <View
                    className="w-6 h-6 rounded-full mr-3"
                    style={{ backgroundColor: option.color }}
                  />
                  <Text className="font-JakartaMedium text-gray-700">
                    {option.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
      </View>

      {/* Payment Method Selection */}
      <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
        <Text className="text-base font-JakartaSemiBold text-gray-800 mb-4">
          Betaalmethode
        </Text>
        <Controller
          control={control}
          name="paymentMethod"
          render={({ field: { onChange, value } }) => (
            <View className="gap-y-3">
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.key}
                  onPress={() => onChange(method.key)}
                  className={`p-4 rounded-xl border-2 flex-row items-center ${
                    value === method.key
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <View className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center mr-4">
                    <MaterialIcons
                      name={method.icon as any}
                      size={24}
                      color={value === method.key ? '#43d478' : '#6b7280'}
                    />
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`font-JakartaSemiBold ${
                        value === method.key
                          ? 'text-primary-700'
                          : 'text-gray-900'
                      }`}
                    >
                      {method.label}
                    </Text>
                    <Text className="text-gray-600 font-Jakarta text-sm">
                      {method.description}
                    </Text>
                  </View>
                  {value === method.key && (
                    <MaterialIcons
                      name="check-circle"
                      size={24}
                      color="#43d478"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
      </View>

      {/* Payment Link (conditional) */}
      {(watchedPaymentMethod === 'tikkie' ||
        watchedPaymentMethod === 'paypal') && (
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <Text className="text-base font-JakartaSemiBold text-gray-800 mb-2">
            Betalingslink (optioneel)
          </Text>
          <Text className="text-gray-600 font-Jakarta text-sm mb-4">
            Voeg een directe betalingslink toe voor{' '}
            {watchedPaymentMethod === 'tikkie' ? 'Tikkie' : 'PayPal'}
          </Text>
          <Controller
            control={control}
            name="paymentLink"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label=""
                placeholder={`https://${watchedPaymentMethod === 'tikkie' ? 'tikkie.me' : 'paypal.me'}/jouwlink`}
                value={value || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="url"
                autoCapitalize="none"
                containerStyle={errors.paymentLink ? 'border-red-500' : ''}
              />
            )}
          />
          {errors.paymentLink && (
            <Text className="text-red-500 text-sm font-Jakarta mt-2">
              {errors.paymentLink.message}
            </Text>
          )}
        </View>
      )}

      {/* Notes Section */}
      <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
        <Text className="text-base font-JakartaSemiBold text-gray-800">
          Notities & Voorwaarden (optioneel)
        </Text>
        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label=""
              placeholder="Bijv. Betaling binnen 30 dagen na factuurdatum..."
              value={value || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              numberOfLines={4}
              inputStyle="text-start"
            />
          )}
        />
      </View>
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
          title="Volgende Stap"
          onPress={handleSubmit(onSubmit)}
          disabled={
            !isValid ||
            (watchedPaymentMethod !== 'bank' && !watch('paymentLink'))
          }
          className={`flex-1 ${!isValid || (watchedPaymentMethod !== 'bank' && !watch('paymentLink')) ? 'opacity-50' : ''}`}
        />
      </View>
    </ScrollView>
  );
};

export default ExtraOptionsStep;
