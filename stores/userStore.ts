import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface CompanyInfo {
  name: string;
  email: string;
  address: string;
  iban: string;
  kvk: string;
  btw: string;
  logo?: string;
  primaryColor?: string;
}

interface UserSettings {
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  darkMode: boolean;
  language: string;
}

interface Subscription {
  plan: 'free' | 'premium';
  invoiceLimit: number;
  invoicesUsed: number;
  renewalDate?: string;
}

interface UserState {
  // State
  user: User | null;
  companyInfo: CompanyInfo;
  settings: UserSettings;
  subscription: Subscription;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateCompanyInfo: (updates: Partial<CompanyInfo>) => void;
  updateSettings: (updates: Partial<UserSettings>) => void;
  upgradeSubscription: () => Promise<boolean>;
  incrementInvoiceUsage: () => void;
  resetMonthlyUsage: () => void;
  canCreateInvoice: () => boolean;
  clearError: () => void;
}

// Initial company data
const initialCompanyInfo: CompanyInfo = {
  name: 'Jouw Bedrijf BV',
  email: 'info@jouwbedrijf.nl',
  address: 'Businesslaan 123, 1234 AB Amsterdam',
  iban: 'NL12 BANK 0123 4567 89',
  kvk: '12345678',
  btw: 'NL123456789B01',
  primaryColor: '#43d478',
};

const initialSettings: UserSettings = {
  notificationsEnabled: true,
  emailNotifications: true,
  darkMode: false,
  language: 'nl',
};

const initialSubscription: Subscription = {
  plan: 'free',
  invoiceLimit: 5,
  invoicesUsed: 3,
  renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      companyInfo: initialCompanyInfo,
      settings: initialSettings,
      subscription: initialSubscription,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1500));

          // Mock authentication - in real app this would validate credentials
          if (email && password) {
            const mockUser: User = {
              id: '1',
              name: 'John Doe',
              email: email,
              avatar: undefined,
            };

            set({
              user: mockUser,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            return true;
          } else {
            throw new Error('Invalid credentials');
          }
        } catch (error) {
          set({
            error: 'Inloggen mislukt. Controleer je gegevens.',
            isLoading: false,
          });
          return false;
        }
      },

      signUp: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1500));

          // Mock registration - in real app this would create account
          if (name && email && password) {
            const mockUser: User = {
              id: Date.now().toString(),
              name: name,
              email: email,
              avatar: undefined,
            };

            set({
              user: mockUser,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            return true;
          } else {
            throw new Error('Invalid registration data');
          }
        } catch (error) {
          set({
            error: 'Registreren mislukt. Probeer opnieuw.',
            isLoading: false,
          });
          return false;
        }
      },

      signOut: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },

      updateCompanyInfo: (updates) => {
        set((state) => ({
          companyInfo: { ...state.companyInfo, ...updates },
        }));
      },

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      upgradeSubscription: async () => {
        set({ isLoading: true, error: null });

        try {
          // Simulate payment processing
          await new Promise((resolve) => setTimeout(resolve, 2000));

          set((state) => ({
            subscription: {
              ...state.subscription,
              plan: 'premium',
              invoiceLimit: -1, // Unlimited
              renewalDate: new Date(
                Date.now() + 365 * 24 * 60 * 60 * 1000
              ).toISOString(),
            },
            isLoading: false,
            error: null,
          }));

          return true;
        } catch (error) {
          set({
            error: 'Upgrade mislukt. Probeer opnieuw.',
            isLoading: false,
          });
          return false;
        }
      },

      incrementInvoiceUsage: () => {
        set((state) => ({
          subscription: {
            ...state.subscription,
            invoicesUsed: state.subscription.invoicesUsed + 1,
          },
        }));
      },

      resetMonthlyUsage: () => {
        set((state) => ({
          subscription: {
            ...state.subscription,
            invoicesUsed: 0,
            renewalDate: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
        }));
      },

      canCreateInvoice: () => {
        const { subscription } = get();
        return (
          subscription.plan === 'premium' ||
          subscription.invoicesUsed < subscription.invoiceLimit
        );
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Don't persist loading states and errors
      partialize: (state) => ({
        user: state.user,
        companyInfo: state.companyInfo,
        settings: state.settings,
        subscription: state.subscription,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
