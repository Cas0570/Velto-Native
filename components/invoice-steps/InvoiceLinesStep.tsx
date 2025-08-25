import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useMemo } from 'react';
import InputField from '@/components/InputField';
import CustomButton from '@/components/CustomButton';
import { vatRates } from '@/constants';
import { formatCurrency } from '@/utils';
import type { NewInvoiceStepProps } from '@/types/type';

// Validation schema
const invoiceLineSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Omschrijving is verplicht'),
  quantity: z.number().min(0.01, 'Aantal moet groter dan 0 zijn'),
  unitPrice: z.number().min(0.01, 'Prijs moet groter dan 0 zijn'),
  vatRate: z.number().min(0, 'BTW-tarief is verplicht'),
  total: z.number(),
});

const invoiceLinesSchema = z.object({
  invoiceLines: z
    .array(invoiceLineSchema)
    .min(1, 'Minimaal één factuurregel is verplicht'),
});

type InvoiceLinesForm = z.infer<typeof invoiceLinesSchema>;

// Helper function to calculate line total
const calculateLineTotal = (
  quantity: number,
  unitPrice: number,
  vatRate: number
): number => {
  const subtotal = quantity * unitPrice;
  const vatAmount = subtotal * vatRate;
  return subtotal + vatAmount;
};

// Helper function to generate unique ID
const generateId = (): string => {
  return `line_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const InvoiceLinesStep = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
}: NewInvoiceStepProps) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<InvoiceLinesForm>({
    resolver: zodResolver(invoiceLinesSchema),
    defaultValues: {
      invoiceLines:
        data.invoiceLines.length > 0
          ? data.invoiceLines
          : [
              {
                id: generateId(),
                description: '',
                quantity: 1,
                unitPrice: 0,
                vatRate: 0.21, // Default to 21% VAT
                total: 0,
              },
            ],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'invoiceLines',
  });

  const watchedLines = watch('invoiceLines');

  // Calculate totals using useMemo to avoid re-calculations
  const calculatedTotals = useMemo(() => {
    const lines = watchedLines.map((line, index) => ({
      ...line,
      id: fields[index]?.id || generateId(),
      total: calculateLineTotal(
        line.quantity || 0,
        line.unitPrice || 0,
        line.vatRate || 0
      ),
    }));

    const subtotal = lines.reduce(
      (sum, line) => sum + line.quantity * line.unitPrice,
      0
    );
    const totalVat = lines.reduce(
      (sum, line) => sum + line.quantity * line.unitPrice * line.vatRate,
      0
    );
    const total = subtotal + totalVat;

    return {
      lines,
      subtotal,
      totalVat,
      total,
    };
  }, [watchedLines, fields]);

  // Update parent data only when calculated values change
  useEffect(() => {
    onUpdate({
      invoiceLines: calculatedTotals.lines,
      calculated: {
        ...data.calculated,
        subtotal: calculatedTotals.subtotal,
        totalVat: calculatedTotals.totalVat,
        total: calculatedTotals.total,
      },
    });
  }, [
    calculatedTotals.subtotal,
    calculatedTotals.totalVat,
    calculatedTotals.total,
    onUpdate,
  ]);

  const addLine = () => {
    append({
      id: generateId(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 0.21,
      total: 0,
    });
  };

  const removeLine = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = () => {
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
          Factuurregels
        </Text>
        <Text className="text-gray-600 font-Jakarta">
          Voeg producten of diensten toe aan je factuur.
        </Text>
      </View>

      {/* Invoice Lines */}
      <View className="gap-y-4">
        {fields.map((field, index) => (
          <View
            key={field.id}
            className="bg-white rounded-2xl p-6 shadow-sm mb-4"
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-base font-JakartaSemiBold text-gray-800">
                Regel {index + 1}
              </Text>
              {fields.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeLine(index)}
                  className="w-8 h-8 bg-red-100 rounded-full items-center justify-center"
                >
                  <MaterialIcons name="close" size={16} color="#ef4444" />
                </TouchableOpacity>
              )}
            </View>

            {/* Description */}
            <Controller
              control={control}
              name={`invoiceLines.${index}.description`}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Omschrijving *"
                  placeholder="Bijv. Website ontwikkeling"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  containerStyle={
                    errors.invoiceLines?.[index]?.description
                      ? 'border-red-500'
                      : ''
                  }
                />
              )}
            />
            {errors.invoiceLines?.[index]?.description && (
              <Text className="text-red-500 text-sm font-Jakarta mb-2">
                {errors.invoiceLines[index]?.description?.message}
              </Text>
            )}

            {/* Quantity and Unit Price Row */}
            <View className="flex-row gap-x-4">
              <View className="flex-1">
                <Controller
                  control={control}
                  name={`invoiceLines.${index}.quantity`}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                      label="Aantal *"
                      placeholder="1"
                      value={value?.toString() || ''}
                      onChangeText={(text) => onChange(parseFloat(text) || 0)}
                      onBlur={onBlur}
                      keyboardType="numeric"
                      containerStyle={
                        errors.invoiceLines?.[index]?.quantity
                          ? 'border-red-500'
                          : ''
                      }
                    />
                  )}
                />
              </View>
              <View className="flex-1">
                <Controller
                  control={control}
                  name={`invoiceLines.${index}.unitPrice`}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                      label="Prijs per stuk *"
                      placeholder="€ 0,00"
                      value={value?.toString() || ''}
                      onChangeText={(text) => onChange(parseFloat(text) || 0)}
                      onBlur={onBlur}
                      keyboardType="numeric"
                      containerStyle={
                        errors.invoiceLines?.[index]?.unitPrice
                          ? 'border-red-500'
                          : ''
                      }
                    />
                  )}
                />
              </View>
            </View>

            {/* VAT Rate Selector */}
            <Text className="text-lg font-JakartaSemiBold mb-3">
              BTW-tarief *
            </Text>
            <Controller
              control={control}
              name={`invoiceLines.${index}.vatRate`}
              render={({ field: { onChange, value } }) => (
                <View className="flex-row gap-x-4">
                  {vatRates.map((rate) => (
                    <TouchableOpacity
                      key={rate.value}
                      onPress={() => onChange(rate.value)}
                      className={`flex-1 p-3 rounded-xl border ${
                        value === rate.value
                          ? 'bg-primary-500 border-primary-500'
                          : 'bg-gray-100 border-gray-200'
                      }`}
                    >
                      <Text
                        className={`text-center font-JakartaMedium ${
                          value === rate.value ? 'text-white' : 'text-gray-700'
                        }`}
                      >
                        {rate.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />

            {/* Line Total */}
            <View className="mt-4 pt-4 border-t border-gray-100">
              <View className="flex-row justify-between">
                <Text className="font-JakartaMedium text-gray-600">
                  Regel totaal:
                </Text>
                <Text className="font-JakartaBold text-gray-900">
                  {formatCurrency(
                    calculateLineTotal(
                      watchedLines[index]?.quantity || 0,
                      watchedLines[index]?.unitPrice || 0,
                      watchedLines[index]?.vatRate || 0
                    )
                  )}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Add Line Button */}
      <TouchableOpacity
        onPress={addLine}
        className="bg-white rounded-2xl p-4 mt-4 shadow-sm flex-row items-center justify-center"
      >
        <MaterialIcons name="add" size={24} color="#43d478" />
        <Text className="ml-2 text-primary-500 font-JakartaMedium">
          Regel toevoegen
        </Text>
      </TouchableOpacity>

      {/* Total Summary */}
      <View className="bg-white rounded-2xl p-6 mt-6 shadow-sm">
        <Text className="text-lg font-JakartaSemiBold text-gray-800 mb-4">
          Totaal overzicht
        </Text>
        <View className="gap-y-2">
          <View className="flex-row justify-between">
            <Text className="font-Jakarta text-gray-600">Subtotaal:</Text>
            <Text className="font-JakartaMedium text-gray-900">
              {formatCurrency(data.calculated.subtotal)}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="font-Jakarta text-gray-600">BTW:</Text>
            <Text className="font-JakartaMedium text-gray-900">
              {formatCurrency(data.calculated.totalVat)}
            </Text>
          </View>
          <View className="flex-row justify-between pt-2 border-t border-gray-200">
            <Text className="font-JakartaBold text-lg text-gray-900">
              Totaal:
            </Text>
            <Text className="font-JakartaBold text-lg text-primary-500">
              {formatCurrency(data.calculated.total)}
            </Text>
          </View>
        </View>
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
          disabled={!isValid || fields.length === 0}
          className={`flex-1 ${!isValid || fields.length === 0 ? 'opacity-50' : ''}`}
        />
      </View>
    </ScrollView>
  );
};

export default InvoiceLinesStep;
