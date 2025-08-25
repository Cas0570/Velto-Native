import React from 'react';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StepIndicatorProps } from '@/types/type';

const getIconName = (iconName: string): any => {
  const iconMap: Record<string, any> = {
    person: 'person',
    receipt: 'receipt',
    settings: 'settings',
    preview: 'preview',
    send: 'send',
  };
  return iconMap[iconName] || 'circle';
};

const StepIndicator = ({
  steps,
  currentStep,
  className,
}: StepIndicatorProps) => {
  return (
    <View className={`px-6 py-4 bg-white ${className}`}>
      <View className="flex-row items-center justify-between">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle */}
              <View
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  isCompleted
                    ? 'bg-primary-500'
                    : isActive
                      ? 'bg-primary-500'
                      : 'bg-gray-200'
                }`}
              >
                {isCompleted ? (
                  <MaterialIcons name="check" size={20} color="white" />
                ) : (
                  <MaterialIcons
                    name={getIconName(step.icon)}
                    size={20}
                    color={isActive ? 'white' : '#9ca3af'}
                  />
                )}
              </View>

              {/* Connection Line - Only show if not the last step */}
              {index < steps.length - 1 && (
                <View
                  className={`flex-1 h-0.5 mx-2 ${
                    isCompleted ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

export default StepIndicator;
