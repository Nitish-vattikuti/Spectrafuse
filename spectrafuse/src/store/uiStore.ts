import { create } from 'zustand';

interface UIState {
  isLoading: boolean;
  isMobileMenuOpen: boolean;
  viewMode: 'compare' | 'single' | 'grid';
  setLoading: (loading: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setViewMode: (mode: UIState['viewMode']) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  isMobileMenuOpen: false,
  viewMode: 'compare',

  setLoading: (loading) => set({ isLoading: loading }),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setViewMode: (mode) => set({ viewMode: mode }),
}));
