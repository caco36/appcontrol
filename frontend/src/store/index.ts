import { create } from 'zustand';

interface AppState {
  appVersion: string;
  isInitialized: boolean;
  setInitialized: (val: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  appVersion: '1.0.0',
  isInitialized: true,
  setInitialized: (val) => set({ isInitialized: val }),
}));
