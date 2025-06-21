import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './layout/Sidebar';
import { Header } from './layout/Header';
import { FileGrid } from './files/FileGrid';
import { MediaViewer } from './media/MediaViewer';
import { FileUploadZone } from './upload/FileUploadZone';
import { useFileStore } from '../store/fileStore';
import { useUIStore } from '../store/uiStore';

export const DataManagementPlatform: React.FC = () => {
  const { files, selectedFile, setSelectedFile } = useFileStore();
  const { sidebarCollapsed, viewMode, showUploadZone } = useUIStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <Header />
        
        <main className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {showUploadZone ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full"
              >
                <FileUploadZone />
              </motion.div>
            ) : selectedFile ? (
              <motion.div
                key="viewer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full"
              >
                <MediaViewer
                  file={selectedFile}
                  onClose={() => setSelectedFile(null)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <FileGrid files={files} viewMode={viewMode} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};