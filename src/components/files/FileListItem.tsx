import React from 'react';
import { Star, MoreVertical, Eye, Download, Trash2, Tag } from 'lucide-react';
import { FileItem } from '../../types/file';
import { useFileStore } from '../../store/fileStore';
import { formatFileSize, formatDate } from '../../utils/formatters';

interface FileListItemProps {
  file: FileItem;
}

export const FileListItem: React.FC<FileListItemProps> = ({ file }) => {
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

  return (
    <div
      className={`grid grid-cols-12 gap-4 px-6 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-50' : ''
      }`}
      onClick={handleClick}
    >
      <div className="col-span-5 flex items-center gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleFileSelection(file.id)}
          className="rounded border-gray-300"
          onClick={(e) => e.stopPropagation()}
        />
        
        {file.thumbnail ? (
          <img
            src={file.thumbnail}
            alt={file.name}
            className="w-8 h-8 object-cover rounded"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
            <Eye className="w-4 h-4 text-gray-400" />
          </div>
        )}
        
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-800 truncate">{file.name}</p>
          {file.tags.length > 0 && (
            <div className="flex gap-1 mt-1">
              {file.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-1 py-0.5 bg-blue-100 text-blue-600 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="col-span-2 flex items-center text-sm text-gray-600">
        {formatFileSize(file.size)}
      </div>
      
      <div className="col-span-2 flex items-center text-sm text-gray-600 capitalize">
        {file.category}
      </div>
      
      <div className="col-span-2 flex items-center text-sm text-gray-600">
        {formatDate(file.dateModified)}
      </div>
      
      <div className="col-span-1 flex items-center gap-1">
        <button
          onClick={handleFavorite}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <Star className={`w-4 h-4 ${file.isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedFile(file);
          }}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <Eye className="w-4 h-4 text-gray-400" />
        </button>
        
        <button
          onClick={handleDelete}
          className="p-1 hover:bg-red-100 rounded transition-colors"
        >
          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
        </button>
      </div>
    </div>
  );
};