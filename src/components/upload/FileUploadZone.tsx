import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, File, Image, Video, Music, FileText, Check, AlertCircle } from 'lucide-react';
import { useFileStore } from '../../store/fileStore';
import { useUIStore } from '../../store/uiStore';
import { FileItem } from '../../types/file';
import { generateThumbnail, extractMetadata, categorizeFile } from '../../utils/fileUtils';

interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
  fileItem?: FileItem;
}

export const FileUploadZone: React.FC = () => {
  const { addFiles } = useFileStore();
  const { setShowUploadZone } = useUIStore();
  const [uploads, setUploads] = useState<UploadProgress[]>([]);

  const processFile = async (file: File): Promise<FileItem> => {
    const fileItem: FileItem = {
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      dateModified: new Date(file.lastModified),
      dateAdded: new Date(),
      path: URL.createObjectURL(file),
      category: categorizeFile(file),
      tags: [],
      isFavorite: false,
      metadata: await extractMetadata(file),
      thumbnail: await generateThumbnail(file),
      file: file // Store the actual file object
    };

    return fileItem;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newUploads: UploadProgress[] = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const
    }));

    setUploads(prev => [...prev, ...newUploads]);

    // Process each file
    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      const uploadIndex = uploads.length + i;

      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 50));
          setUploads(prev => prev.map((upload, idx) => 
            idx === uploadIndex ? { ...upload, progress } : upload
          ));
        }

        // Set processing status
        setUploads(prev => prev.map((upload, idx) => 
          idx === uploadIndex ? { ...upload, status: 'processing' } : upload
        ));

        // Process the file
        const fileItem = await processFile(file);

        // Set complete status
        setUploads(prev => prev.map((upload, idx) => 
          idx === uploadIndex ? { ...upload, status: 'complete', fileItem } : upload
        ));

        // Add to store
        addFiles([fileItem]);

      } catch (error) {
        setUploads(prev => prev.map((upload, idx) => 
          idx === uploadIndex ? { 
            ...upload, 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Upload failed' 
          } : upload
        ));
      }
    }
  }, [addFiles, uploads.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
      'video/*': ['.mp4', '.webm', '.ogg', '.mov', '.avi'],
      'audio/*': ['.mp3', '.wav', '.ogg', '.m4a'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.md', '.json', '.csv']
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: true
  });

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    if (type.startsWith('audio/')) return Music;
    if (type.includes('pdf') || type.startsWith('text/')) return FileText;
    return File;
  };

  const clearCompleted = () => {
    setUploads(prev => prev.filter(upload => upload.status !== 'complete'));
  };

  const hasCompleted = uploads.some(upload => upload.status === 'complete');

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Upload Files</h2>
          <div className="flex items-center gap-2">
            {hasCompleted && (
              <button
                onClick={clearCompleted}
                className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                Clear Completed
              </button>
            )}
            <button
              onClick={() => setShowUploadZone(false)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        {/* Drop Zone */}
        <motion.div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <input {...getInputProps()} />
          <Upload className={`w-16 h-16 mx-auto mb-4 ${
            isDragActive ? 'text-blue-500' : 'text-gray-400'
          }`} />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {isDragActive ? 'Drop files here' : 'Upload your files'}
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-sm text-gray-500">
            Supports images, videos, audio, documents (max 100MB each)
          </p>
        </motion.div>

        {/* Upload Progress */}
        <AnimatePresence>
          {uploads.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Upload Progress ({uploads.length} files)
              </h3>
              <div className="space-y-3">
                {uploads.map((upload, index) => {
                  const Icon = getFileIcon(upload.file.type);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-8 h-8 text-gray-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate">
                            {upload.file.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {upload.status === 'complete' && (
                            <Check className="w-5 h-5 text-green-500" />
                          )}
                          {upload.status === 'error' && (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          )}
                          <span className="text-sm font-medium text-gray-600">
                            {upload.status === 'uploading' && `${upload.progress}%`}
                            {upload.status === 'processing' && 'Processing...'}
                            {upload.status === 'complete' && 'Complete'}
                            {upload.status === 'error' && 'Error'}
                          </span>
                        </div>
                      </div>
                      
                      {upload.status === 'uploading' && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className="bg-blue-600 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${upload.progress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {upload.error && (
                        <p className="mt-2 text-sm text-red-600">{upload.error}</p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};