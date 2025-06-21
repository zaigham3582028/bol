import React, { useState, useEffect } from 'react';
import { FileText, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { FileItem } from '../../types/file';

interface DocumentViewerProps {
  file: FileItem;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ file }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const loadContent = async () => {
      try {
        if (file.type.startsWith('text/') || file.type.includes('json')) {
          const response = await fetch(file.path);
          const text = await response.text();
          setContent(text);
        } else if (file.type.includes('pdf')) {
          // For PDF files, we'll show a placeholder since full PDF rendering requires additional libraries
          setContent('PDF preview not available. Click download to view the file.');
        }
      } catch (error) {
        setContent('Error loading document content.');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [file]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file.path;
    link.download = file.name;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* Document Controls */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FileText className="w-6 h-6 text-gray-600" />
            <h3 className="font-medium text-gray-800">{file.name}</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            
            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            
            <button
              onClick={handleZoomIn}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={zoom >= 3}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            
            <div className="w-px h-6 bg-gray-300 mx-2" />
            
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Document Content */}
      <div className="flex-1 overflow-auto p-6">
        <div 
          className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        >
          {file.type.includes('pdf') ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">PDF Document</h3>
              <p className="text-gray-600 mb-4">{content}</p>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download PDF
              </button>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed">
              {content}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};