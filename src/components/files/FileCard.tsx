import React from 'react';
import { motion } from 'framer-motion';
import { Star, MoreVertical, Play, Eye, Download, Trash2, Tag } from 'lucide-react';
import { FileItem } from '../../types/file';
import { useFileStore } from '../../store/fileStore';
import { formatFileSize, formatDate } from '../../utils/formatters';

interface FileCardProps {
  file: FileItem;
}

export const FileCard: React.FC<FileCardProps> = ({ file }) => {
  const { setSelectedFile, toggleFavorite, deleteFiles, selectedFiles, toggleFileSelection } = useFileStore();
  const isSelected = selectedFiles.includes(file.id);

  const handleClick = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      toggleFileSelection(file.id);
    } else {
      setSelectedFile(file);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(file.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete ${file.name}?`)) {
      deleteFiles([file.id]);
    }
  };

  const renderThumbnail = () => {
    if (file.thumbnail) {
      return (
        <img
          src={file.thumbnail}
          alt={file.name}
          className="w-full h-32 object-cover"
        />
      );
    }

    if (file.type.startsWith('image/')) {
      return (
        <img
          src={file.path}
          alt={file.name}
          className="w-full h-32 object-cover"
        />
      );
    }

    if (file.type.startsWith('video/')) {
      return (
        <div className="w-full h-32 bg-gray-900 flex items-center justify-center relative">
          <Play className="w-8 h-8 text-white" />
          <video
            src={file.path}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
            muted
          />
        </div>
      );
    }

    return (
      <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
        <Eye className="w-8 h-8 text-gray-400" />
      </div>
    );
  };

  return (
    <motion.div
      className={`bg-white rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-blue-500 shadow-md' : 'border-gray-200'
      }`}
      onClick={handleClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative overflow-hidden rounded-t-lg">
        {renderThumbnail()}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(file);
              }}
              className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={handleFavorite}
              className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
            >
              <Star className={`w-4 h-4 ${file.isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-2 left-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {/* Favorite indicator */}
        {file.isFavorite && (
          <Star className="absolute top-2 right-2 w-5 h-5 text-yellow-500 fill-current" />
        )}
      </div>

      <div className="p-3">
        <h3 className="font-medium text-gray-800 truncate mb-1" title={file.name}>
          {file.name}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{formatFileSize(file.size)}</span>
          <span>{formatDate(file.dateModified)}</span>
        </div>
        
        {file.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {file.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {file.tags.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{file.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};