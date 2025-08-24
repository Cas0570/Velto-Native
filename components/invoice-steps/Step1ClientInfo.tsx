import { View, Text } from 'react-native';
import React, { useImperativeHandle, forwardRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientInfoSchema } from '@/utils/validation';
import InputField from '@/components/InputField';
import type { ClientInfoFormData } from '@/types/type';

interface Step1ClientInfoProps {
  onSubmit: (data: ClientInfoFormData) => void;
  defaultValues?: Partial<ClientInfoFormData>;
  onFormValidityChange?: (isValid: boolean) => void;
}

export interface Step1ClientInfoRef {
  submitForm: () => void;
}

const Step1ClientInfo = forwardRef<Step1ClientInfoRef, Step1ClientInfoProps>(
  ({ onSubmit, defaultValues, onFormValidityChange }, ref) => {
    const {
      control,
      handleSubmit,
      formState: { errors, isValid },
    } = useForm<ClientInfoFormData>({
      resolver: zodResolver(clientInfoSchema),
      mode: 'onChange',
      defaultValues: {
        clientName: defaultValues?.clientName || '',
        clientEmail: defaultValues?.clientEmail || '',
        clientAddress: defaultValues?.clientAddress || '',
        clientCity: defaultValues?.clientCity || '',
        clientPostalCode: defaultValues?.clientPostalCode || '',
      },
    });

    // Expose submit method to parent
    useImperativeHandle(ref, () => ({
      submitForm: handleSubmit(onSubmit),
    }));

    // Notify parent about form validity changes
    React.useEffect(() => {
      onFormValidityChange?.(isValid);
    }, [isValid, onFormValidityChange]);

    return (
      <View className="px-6 pb-8 flex-1">
        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <Controller
            control={control}
            name="clientName"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label="(Bedrijfs)naam *"
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
  }
);

Step1ClientInfo.displayName = 'Step1ClientInfo';

export default Step1ClientInfo;
