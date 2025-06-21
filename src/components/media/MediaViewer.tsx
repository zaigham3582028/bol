import React from 'react';
import { motion } from 'framer-motion';
import { X, Download, Star, Tag, Share, MoreVertical } from 'lucide-react';
import { FileItem } from '../../types/file';
import { VideoPlayer } from './VideoPlayer';
import { ImageViewer } from './ImageViewer';
import { AudioPlayer } from './AudioPlayer';
import { DocumentViewer } from './DocumentViewer';
import { useFileStore } from '../../store/fileStore';
import { formatFileSize, formatDate } from '../../utils/formatters';

interface MediaViewerProps {
  file: FileItem;
  onClose: () => void;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({ file, onClose }) => {
  const { toggleFavorite } = useFileStore();

  const handleFavorite = () => {
    toggleFavorite(file.id);
  };

  const renderMedia = () => {
    if (file.type.startsWith('video/')) {
      return <VideoPlayer file={file} />;
    }
    
    if (file.type.startsWith('image/')) {
      return <ImageViewer file={file} />;
    }
    
    if (file.type.startsWith('audio/')) {
      return <AudioPlayer file={file} />;
    }
    
    if (file.type.includes('pdf') || file.type.startsWith('text/')) {
      return <DocumentViewer file={file} />;
    }

    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-600">Preview not available for this file type</p>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="bg-black bg-opacity-50 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-white font-medium truncate max-w-md" title={file.name}>
              {file.name}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span>{formatFileSize(file.size)}</span>
              <span>•</span>
              <span>{formatDate(file.dateModified)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleFavorite}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <Star className={`w-5 h-5 ${file.isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
            </button>
            
            <button className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
              <Download className="w-5 h-5" />
            </button>
            
            <button className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
              <Share className="w-5 h-5" />
            </button>
            
            <button className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Media Content */}
      <div className="flex-1 flex">
        {renderMedia()}
      </div>

      {/* Footer with metadata */}
      {file.metadata && (
        <div className="bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between text-sm text-gray-300">
            <div className="flex items-center gap-4">
              <span className="capitalize">{file.category}</span>
              {file.metadata.duration && (
                <span>Duration: {Math.round(file.metadata.duration)}s</span>
              )}
              {file.metadata.dimensions && (
                <span>{file.metadata.dimensions.width} × {file.metadata.dimensions.height}</span>
              )}
            </div>
            
            {file.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <div className="flex gap-1">
                  {file.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};