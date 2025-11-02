import type { Book } from '@/types/book';

export type BookStatus = 'want-to-read' | 'reading' | 'completed';

export interface ReadingListBook {
  book: Book;
  status: BookStatus;
  addedAt: string;
}

export interface ReadingList {
  books: ReadingListBook[];
}

export interface ReadingProgress {
  totalBooks: number;
  reading: number;
  planToRead: number;
  finished: number;
}

export interface AddToReadingListPayload {
  bookId: string;
  status: BookStatus;
}

export interface UpdateBookStatusPayload {
  bookId: string;
  status: BookStatus;
}
