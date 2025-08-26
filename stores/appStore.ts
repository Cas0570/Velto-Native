import { create } from 'zustand';

interface AppState {
  // UI State
  activeTab: string;
  isOnline: boolean;
  lastSync: string | null;
  appVersion: string;

  // Modal/Overlay states
  showUpgradeModal: boolean;
  showOnboardingModal: boolean;

  // Actions
  setActiveTab: (tab: string) => void;
  setOnlineStatus: (isOnline: boolean) => void;
  updateLastSync: () => void;
  showUpgrade: () => void;
  hideUpgrade: () => void;
  showOnboarding: () => void;
  hideOnboarding: () => void;

  // Sync functions
  syncData: () => Promise<void>;
  checkConnectivity: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  activeTab: 'dashboard',
  isOnline: true,
  lastSync: null,
  appVersion: '1.0.0',
  showUpgradeModal: false,
  showOnboardingModal: false,

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),

  setOnlineStatus: (isOnline) => set({ isOnline }),

  updateLastSync: () => set({ lastSync: new Date().toISOString() }),

  showUpgrade: () => set({ showUpgradeModal: true }),

  hideUpgrade: () => set({ showUpgradeModal: false }),

  showOnboarding: () => set({ showOnboardingModal: true }),

  hideOnboarding: () => set({ showOnboardingModal: false }),

  syncData: async () => {
    const { isOnline, updateLastSync } = get();

    if (!isOnline) {
      console.log('App is offline, skipping sync');
      return;
    }

    try {
      // Simulate sync operation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, this would sync with your backend
      console.log('Data synced successfully');
      updateLastSync();
    } catch (error) {
      console.error('Sync failed:', error);
    }
  },

  checkConnectivity: () => {
    // In a real app, you'd use NetInfo or similar
    // For now, we'll assume we're online
    set({ isOnline: true });
  },
}));
