export interface EBook {
  id: string;
  bookId: string;
  format: 'PDF' | 'EPUB';
  fileUrl: string;
  fileSize: number;
  totalPages: number;
  drm: boolean;
  downloadable: boolean;
}

export interface ReadingProgress {
  id: string;
  bookId: string;
  userId: string;
  currentPage: number;
  totalPages: number;
  readingTime: number; // in minutes
  lastReadAt: string;
  completed: boolean;
  bookmarks: Bookmark[];
  annotations: Annotation[];
}

export interface Bookmark {
  id: string;
  page: number;
  position: {
    x: number;
    y: number;
  };
  text: string;
  createdAt: string;
}

export interface Annotation {
  id: string;
  page: number;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  text: string;
  note: string;
  color: string;
  createdAt: string;
}

export interface ReaderSettings {
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  theme: 'light' | 'dark' | 'sepia';
  margin: number;
  brightness: number;
}
