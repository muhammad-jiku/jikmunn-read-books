export type BookStatus = 'want-to-read' | 'reading' | 'completed';

export interface ReadingListItem {
  bookId: string;
  status: BookStatus;
  progress: number;
  lastReadAt: string;
}

export interface ReadingList {
  userId: string;
  items: ReadingListItem[];
}

export interface ReadingProgress {
  total: number;
  completed: number;
  inProgress: number;
  abandoned: number;
  wantToRead: number;
}
