import { create } from 'zustand';

interface UIStore {
  sidebarCollapsed: boolean;
  selectedCategory: string;
  viewMode: 'grid' | 'list';
  showUploadZone: boolean;
  
  // Actions
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSelectedCategory: (category: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setShowUploadZone: (show: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  selectedCategory: 'all',
  viewMode: 'grid',
  showUploadZone: false,

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setShowUploadZone: (show) => set({ showUploadZone: show }),
}));