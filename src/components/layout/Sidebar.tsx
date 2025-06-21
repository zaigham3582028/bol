import React from 'react';
import { motion } from 'framer-motion';
import {
  FolderOpen,
  Image,
  Video,
  Music,
  FileText,
  Star,
  Tag,
  Settings,
  ChevronLeft,
  ChevronRight,
  Upload,
  Search,
  Filter,
  Grid,
  List,
  Trash2,
  Download
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useFileStore } from '../../store/fileStore';

const categories = [
  { id: 'all', name: 'All Files', icon: FolderOpen, count: 0 },
  { id: 'images', name: 'Images', icon: Image, count: 0 },
  { id: 'videos', name: 'Videos', icon: Video, count: 0 },
  { id: 'audio', name: 'Audio', icon: Music, count: 0 },
  { id: 'documents', name: 'Documents', icon: FileText, count: 0 },
  { id: 'favorites', name: 'Favorites', icon: Star, count: 0 },
];

export const Sidebar: React.FC = () => {
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    selectedCategory,
    setSelectedCategory,
    viewMode,
    setViewMode,
    setShowUploadZone
  } = useUIStore();
  
  const { files, getFilesByCategory } = useFileStore();

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return files.length;
    if (categoryId === 'favorites') return files.filter(f => f.isFavorite).length;
    return getFilesByCategory(categoryId).length;
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 256 }}
      className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-30 shadow-sm"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-semibold text-gray-800"
              >
                File Manager
              </motion.h1>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-200">
          <div className="space-y-2">
            <button
              onClick={() => setShowUploadZone(true)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              {!sidebarCollapsed && 'Upload Files'}
            </button>
            
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 text-blue-600'
                    : 'hover:bg-gray-100'
                }`}
              >
                <Grid className="w-4 h-4 mx-auto" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-100 text-blue-600'
                    : 'hover:bg-gray-100'
                }`}
              >
                <List className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon;
              const count = getCategoryCount(category.id);
              const isSelected = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left">{category.name}</span>
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        {count}
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
            {!sidebarCollapsed && 'Settings'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};