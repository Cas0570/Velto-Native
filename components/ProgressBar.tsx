import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { InvoiceStep } from '@/types/type';

interface ProgressBarProps {
  steps: InvoiceStep[];
  currentStep: number;
  className?: string;
}

const ProgressBar = ({ steps, currentStep, className }: ProgressBarProps) => {
  const currentStepData = steps.find((step) => step.id === currentStep);

  return (
    <View className={`px-6 py-4 ${className}`}>
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
};

export default ProgressBar;
