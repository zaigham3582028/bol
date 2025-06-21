export interface FileMetadata {
  duration?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  bitrate?: number;
  sampleRate?: number;
  channels?: number;
  codec?: string;
  [key: string]: any;
}

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  dateModified: Date;
  dateAdded: Date;
  path: string;
  category: string;
  tags: string[];
  isFavorite: boolean;
  metadata?: FileMetadata;
  thumbnail?: string;
  file?: File; // Store the actual File object for local files
}

export type FileCategory = 'images' | 'videos' | 'audio' | 'documents' | 'all' | 'favorites';