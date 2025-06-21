import React from 'react';
import { motion } from 'framer-motion';
import { FileCard } from './FileCard';
import { FileListItem } from './FileListItem';
import { FileItem } from '../../types/file';

interface FileGridProps {
  files: FileItem[];
  viewMode: 'grid' | 'list';
}

export const FileGrid: React.FC<FileGridProps> = ({ files, viewMode }) => {
  if (files.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No files yet</h3>
          <p className="text-gray-600">Upload some files to get started</p>
        </div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="h-full overflow-auto">
        <div className="bg-white">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200 text-sm font-medium text-gray-600">
            <div className="col-span-5">Name</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Modified</div>
            <div className="col-span-1">Actions</div>
          </div>
          <div className="divide-y divide-gray-200">
            {files.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <FileListItem file={file} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {files.map((file, index) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <FileCard file={file} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};