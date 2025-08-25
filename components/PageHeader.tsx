import { View, Text, TouchableOpacity } from 'react-native';
import { PageHeaderProps } from '@/types/type';

const PageHeader = ({
  title,
  subtitle,
  showLogo = true,
  logoText = 'V',
  rightElement,
  onLogoPress,
  className,
  titleClassName,
  subtitleClassName,
}: PageHeaderProps) => {
  const LogoComponent = onLogoPress ? TouchableOpacity : View;

  return (
    <View className={`px-6 py-4 bg-white ${className}`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {showLogo && (
            <LogoComponent
              onPress={onLogoPress}
              className="w-10 h-10 bg-primary-500 rounded-lg items-center justify-center mr-3"
            >
              <Text className="text-white font-JakartaBold text-lg">
                {logoText}
              </Text>
            </LogoComponent>
          )}
          <View className="flex-1">
            <Text
              className={`text-2xl font-JakartaBold text-gray-800 ${titleClassName}`}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                className={`text-gray-500 font-Jakarta ${subtitleClassName}`}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {rightElement && <View>{rightElement}</View>}
      </View>
    </View>
  );
};

export default PageHeader;
