import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { router } from 'expo-router';
import PageHeader from '@/components/PageHeader';
import { companyData } from '@/constants';
import { formatCurrency } from '@/utils';

const SettingsItem = ({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
  showChevron = true,
  iconColor = '#6b7280',
  iconBgColor = '#f3f4f6',
}: {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
  iconColor?: string;
  iconBgColor?: string;
}) => {
  const ItemComponent = onPress ? TouchableOpacity : View;

  return (
    <ItemComponent
      onPress={onPress}
      className={`flex-row items-center p-4 ${onPress ? 'active:bg-gray-50' : ''}`}
    >
      <View
        className="w-10 h-10 rounded-xl items-center justify-center mr-4"
        style={{ backgroundColor: iconBgColor }}
      >
        <MaterialIcons name={icon as any} size={20} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className="font-JakartaSemiBold text-gray-900">{title}</Text>
        {subtitle && (
          <Text className="text-sm text-gray-500 font-Jakarta mt-0.5">
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement && <View className="ml-2">{rightElement}</View>}
      {showChevron && onPress && (
        <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
      )}
    </ItemComponent>
  );
};

const SettingsSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View className="mb-6">
    <Text className="text-sm font-JakartaSemiBold text-gray-500 uppercase tracking-wide px-6 mb-3">
      {title}
    </Text>
    <View className="bg-white rounded-2xl mx-6 shadow-sm overflow-hidden">
      {children}
    </View>
  </View>
);

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  // const [darkMode, setDarkMode] = useState(false); // For V2

  const handleCompanyInfoPress = () => {
    // TODO: Navigate to company info edit screen
    Alert.alert(
      'Bedrijfsgegevens',
      'Deze functie wordt binnenkort toegevoegd.',
      [{ text: 'OK' }]
    );
  };

  const handleSubscriptionPress = () => {
    Alert.alert(
      'Abonnement Upgraden',
      'Upgrade naar Premium voor onbeperkte facturen en geavanceerde functies!',
      [
        { text: 'Later', style: 'cancel' },
        { text: 'Upgrade Nu', style: 'default' },
      ]
    );
  };

  const handleHelpPress = () => {
    Linking.openURL('mailto:support@velto.app?subject=Velto Support');
  };

  const handleSignOut = () => {
    Alert.alert('Uitloggen', 'Weet je zeker dat je wilt uitloggen?', [
      { text: 'Annuleren', style: 'cancel' },
      {
        text: 'Uitloggen',
        style: 'destructive',
        onPress: () => {
          // TODO: Implement actual sign out logic
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <PageHeader
        title="Instellingen"
        subtitle="Beheer je account en voorkeuren"
      />

      <ScrollView className="flex-1 mt-4" showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <SettingsSection title="Account">
          <SettingsItem
            icon="business"
            title="Bedrijfsgegevens"
            subtitle={companyData.name}
            onPress={handleCompanyInfoPress}
            iconColor="#43d478"
            iconBgColor="#e9faf0"
          />
          <View className="h-px bg-gray-100 ml-14" />
          <SettingsItem
            icon="card-membership"
            title="Abonnement"
            subtitle="Gratis Plan • 3 van 5 facturen gebruikt"
            onPress={handleSubscriptionPress}
            iconColor="#f59e0b"
            iconBgColor="#fef3c7"
            rightElement={
              <View className="bg-amber-100 px-2 py-1 rounded-full">
                <Text className="text-amber-700 font-JakartaSemiBold text-xs">
                  Upgrade
                </Text>
              </View>
            }
          />
        </SettingsSection>

        {/* Preferences Section */}
        <SettingsSection title="Voorkeuren">
          <SettingsItem
            icon="notifications"
            title="Meldingen"
            subtitle="Ontvang updates over je facturen"
            showChevron={false}
            iconColor="#3b82f6"
            iconBgColor="#dbeafe"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#e5e7eb', true: '#43d478' }}
                thumbColor={notificationsEnabled ? '#ffffff' : '#f3f4f6'}
              />
            }
          />
          <View className="h-px bg-gray-100 ml-14" />
          <SettingsItem
            icon="email"
            title="E-mail notificaties"
            subtitle="Krijg updates via e-mail"
            showChevron={false}
            iconColor="#8b5cf6"
            iconBgColor="#ede9fe"
            rightElement={
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: '#e5e7eb', true: '#43d478' }}
                thumbColor={emailNotifications ? '#ffffff' : '#f3f4f6'}
              />
            }
          />
          {/* Dark Mode - Commented out for V1
          <View className="h-px bg-gray-100 ml-14" />
          <SettingsItem
            icon="dark-mode"
            title="Donkere modus"
            subtitle="Gebruik donker thema"
            showChevron={false}
            iconColor="#6b7280"
            iconBgColor="#f3f4f6"
            rightElement={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#e5e7eb', true: '#43d478' }}
                thumbColor={darkMode ? '#ffffff' : '#f3f4f6'}
              />
            }
          />
          */}
        </SettingsSection>

        {/* Support Section */}
        <SettingsSection title="Support & Info">
          <SettingsItem
            icon="help"
            title="Help & Ondersteuning"
            subtitle="Neem contact op voor hulp"
            onPress={handleHelpPress}
            iconColor="#10b981"
            iconBgColor="#d1fae5"
          />
          <View className="h-px bg-gray-100 ml-14" />
          <SettingsItem
            icon="info"
            title="Over Velto"
            subtitle="Versie 1.0.0"
            onPress={() =>
              Alert.alert(
                'Over Velto',
                'Velto is een moderne facturatie-app voor freelancers en kleine ondernemers.\n\nVersie: 1.0.0\n© 2024 Velto',
                [{ text: 'OK' }]
              )
            }
            iconColor="#6b7280"
            iconBgColor="#f3f4f6"
          />
          <View className="h-px bg-gray-100 ml-14" />
          <SettingsItem
            icon="privacy-tip"
            title="Privacy & Voorwaarden"
            subtitle="Lees ons privacybeleid"
            onPress={() =>
              Alert.alert(
                'Privacy & Voorwaarden',
                'Privacy beleid en gebruikersvoorwaarden worden binnenkort toegevoegd.',
                [{ text: 'OK' }]
              )
            }
            iconColor="#6b7280"
            iconBgColor="#f3f4f6"
          />
        </SettingsSection>

        {/* Usage Stats Section */}
        <SettingsSection title="Gebruik">
          <View className="p-6">
            <Text className="text-base font-JakartaSemiBold text-gray-800 mb-4">
              Deze maand
            </Text>
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-1">
                <Text className="text-2xl font-JakartaBold text-primary-500">
                  3
                </Text>
                <Text className="text-gray-600 font-Jakarta text-sm">
                  Facturen aangemaakt
                </Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-2xl font-JakartaBold text-blue-600">
                  {formatCurrency(4200)}
                </Text>
                <Text className="text-gray-600 font-Jakarta text-sm">
                  Totale waarde
                </Text>
              </View>
              <View className="flex-1 items-end">
                <Text className="text-2xl font-JakartaBold text-green-600">
                  1
                </Text>
                <Text className="text-gray-600 font-Jakarta text-sm">
                  Betaald
                </Text>
              </View>
            </View>
            <View className="bg-gray-100 rounded-full h-2 mb-2">
              <View
                className="bg-primary-500 h-2 rounded-full"
                style={{ width: '60%' }}
              />
            </View>
            <Text className="text-center text-gray-600 font-Jakarta text-sm">
              3 van 5 gratis facturen gebruikt
            </Text>
          </View>
        </SettingsSection>

        {/* Sign Out Section */}
        <View className="px-6 py-4">
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-white rounded-2xl p-4 shadow-sm flex-row items-center justify-center"
          >
            <MaterialIcons name="logout" size={20} color="#ef4444" />
            <Text className="ml-2 text-red-600 font-JakartaSemiBold">
              Uitloggen
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Padding */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
