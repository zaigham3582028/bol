import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Download, Trash2, Tag } from 'lucide-react';
import { useFileStore } from '../../store/fileStore';
import { useUIStore } from '../../store/uiStore';

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { searchFiles, selectedFiles, deleteFiles, bulkCategorize } = useFileStore();
  const { selectedCategory } = useUIStore();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchFiles(query);
  };

  const handleBulkDelete = () => {
    if (selectedFiles.length > 0 && confirm(`Delete ${selectedFiles.length} files?`)) {
      deleteFiles(selectedFiles);
    }
  };

  const handleBulkCategorize = () => {
    if (selectedFiles.length > 0) {
      const category = prompt('Enter category:');
      if (category) {
        bulkCategorize(selectedFiles, category);
      }
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">
            {selectedCategory === 'all' ? 'All Files' : selectedCategory}
          </h2>
          
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedFiles.length > 0 && (
            <div className="flex items-center gap-2 mr-4">
              <span className="text-sm text-gray-600">
                {selectedFiles.length} selected
              </span>
              <button
                onClick={handleBulkCategorize}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Categorize selected"
              >
                <Tag className="w-4 h-4" />
              </button>
              <button
                onClick={handleBulkDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete selected"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Filter className="w-4 h-4" />
          </button>
          
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};