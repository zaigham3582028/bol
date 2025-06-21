import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { FileItem } from '../types/file';
import { addToast } from '../components/ui/Toaster';

interface FileStore {
  files: FileItem[];
  selectedFile: FileItem | null;
  selectedFiles: string[];
  searchQuery: string;
  filteredFiles: FileItem[];
  
  // Actions
  addFiles: (files: FileItem[]) => void;
  deleteFiles: (fileIds: string[]) => void;
  setSelectedFile: (file: FileItem | null) => void;
  toggleFileSelection: (fileId: string) => void;
  clearSelection: () => void;
  toggleFavorite: (fileId: string) => void;
  updateFile: (fileId: string, updates: Partial<FileItem>) => void;
  searchFiles: (query: string) => void;
  getFilesByCategory: (category: string) => FileItem[];
  bulkCategorize: (fileIds: string[], category: string) => void;
}

export const useFileStore = create<FileStore>()(
  immer((set, get) => ({
    files: [],
    selectedFile: null,
    selectedFiles: [],
    searchQuery: '',
    filteredFiles: [],

    addFiles: (newFiles) =>
      set((state) => {
        state.files.push(...newFiles);
        state.filteredFiles = state.files;
        addToast({
          type: 'success',
          title: 'Files uploaded',
          message: `${newFiles.length} file(s) added successfully`
        });
      }),

    deleteFiles: (fileIds) =>
      set((state) => {
        const deletedCount = fileIds.length;
        state.files = state.files.filter(file => !fileIds.includes(file.id));
        state.filteredFiles = state.filteredFiles.filter(file => !fileIds.includes(file.id));
        state.selectedFiles = state.selectedFiles.filter(id => !fileIds.includes(id));
        
        if (state.selectedFile && fileIds.includes(state.selectedFile.id)) {
          state.selectedFile = null;
        }
        
        addToast({
          type: 'success',
          title: 'Files deleted',
          message: `${deletedCount} file(s) deleted successfully`
        });
      }),

    setSelectedFile: (file) =>
      set((state) => {
        state.selectedFile = file;
      }),

    toggleFileSelection: (fileId) =>
      set((state) => {
        const index = state.selectedFiles.indexOf(fileId);
        if (index > -1) {
          state.selectedFiles.splice(index, 1);
        } else {
          state.selectedFiles.push(fileId);
        }
      }),

    clearSelection: () =>
      set((state) => {
        state.selectedFiles = [];
      }),

    toggleFavorite: (fileId) =>
      set((state) => {
        const file = state.files.find(f => f.id === fileId);
        if (file) {
          file.isFavorite = !file.isFavorite;
          addToast({
            type: 'success',
            title: file.isFavorite ? 'Added to favorites' : 'Removed from favorites',
            message: file.name
          });
        }
      }),

    updateFile: (fileId, updates) =>
      set((state) => {
        const file = state.files.find(f => f.id === fileId);
        if (file) {
          Object.assign(file, updates);
        }
      }),

    searchFiles: (query) =>
      set((state) => {
        state.searchQuery = query;
        if (!query.trim()) {
          state.filteredFiles = state.files;
        } else {
          const lowercaseQuery = query.toLowerCase();
          state.filteredFiles = state.files.filter(file =>
            file.name.toLowerCase().includes(lowercaseQuery) ||
            file.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
            file.category.toLowerCase().includes(lowercaseQuery)
          );
        }
      }),

    getFilesByCategory: (category) => {
      const { files } = get();
      if (category === 'all') return files;
      if (category === 'favorites') return files.filter(f => f.isFavorite);
      return files.filter(f => f.category === category);
    },

    bulkCategorize: (fileIds, category) =>
      set((state) => {
        fileIds.forEach(fileId => {
          const file = state.files.find(f => f.id === fileId);
          if (file) {
            file.category = category;
          }
        });
        
        addToast({
          type: 'success',
          title: 'Files categorized',
          message: `${fileIds.length} file(s) moved to ${category}`
        });
      }),
  }))
);