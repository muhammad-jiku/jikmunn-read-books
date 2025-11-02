import type { Annotation, Bookmark, EBook, ReaderSettings, ReadingProgress } from '@/types/ebook';
import type { RootState } from '@redux/store';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '@utils/api';

interface EBookState {
  ebooks: { [bookId: string]: EBook };
  readingProgress: { [bookId: string]: ReadingProgress };
  readerSettings: ReaderSettings;
  loading: boolean;
  error: string | null;
}

const defaultReaderSettings: ReaderSettings = {
  fontSize: 16,
  lineHeight: 1.5,
  fontFamily: 'Georgia',
  theme: 'light',
  margin: 20,
  brightness: 100,
};

const initialState: EBookState = {
  ebooks: {},
  readingProgress: {},
  readerSettings: {
    ...defaultReaderSettings,
    theme: (localStorage.getItem('readerTheme') as ReaderSettings['theme']) || 'light',
  },
  loading: false,
  error: null,
};

export const fetchEBook = createAsyncThunk('ebook/fetchEBook', async (bookId: string) => {
  const response = await api.get(`/books/${bookId}/ebook`);
  return response.data;
});

export const fetchReadingProgress = createAsyncThunk(
  'ebook/fetchReadingProgress',
  async (bookId: string) => {
    const response = await api.get(`/books/${bookId}/reading-progress`);
    return response.data;
  },
);

export const updateReadingProgress = createAsyncThunk(
  'ebook/updateReadingProgress',
  async ({ bookId, progress }: { bookId: string; progress: Partial<ReadingProgress> }) => {
    const response = await api.patch(`/books/${bookId}/reading-progress`, progress);
    return response.data;
  },
);

export const addBookmark = createAsyncThunk(
  'ebook/addBookmark',
  async ({
    bookId,
    bookmark,
  }: {
    bookId: string;
    bookmark: Omit<Bookmark, 'id' | 'createdAt'>;
  }) => {
    const response = await api.post(`/books/${bookId}/bookmarks`, bookmark);
    return response.data;
  },
);

export const addAnnotation = createAsyncThunk(
  'ebook/addAnnotation',
  async ({
    bookId,
    annotation,
  }: {
    bookId: string;
    annotation: Omit<Annotation, 'id' | 'createdAt'>;
  }) => {
    const response = await api.post(`/books/${bookId}/annotations`, annotation);
    return response.data;
  },
);

const ebookSlice = createSlice({
  name: 'ebook',
  initialState,
  reducers: {
    updateReaderSettings: (state, action) => {
      state.readerSettings = {
        ...state.readerSettings,
        ...action.payload,
      };
      if (action.payload.theme) {
        localStorage.setItem('readerTheme', action.payload.theme);
      }
    },
    resetReaderSettings: (state) => {
      state.readerSettings = defaultReaderSettings;
      localStorage.removeItem('readerTheme');
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch EBook
      .addCase(fetchEBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEBook.fulfilled, (state, action) => {
        state.loading = false;
        state.ebooks[action.payload.bookId] = action.payload;
      })
      .addCase(fetchEBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch ebook';
      })
      // Fetch Reading Progress
      .addCase(fetchReadingProgress.fulfilled, (state, action) => {
        state.readingProgress[action.payload.bookId] = action.payload;
      })
      // Update Reading Progress
      .addCase(updateReadingProgress.fulfilled, (state, action) => {
        state.readingProgress[action.payload.bookId] = {
          ...state.readingProgress[action.payload.bookId],
          ...action.payload,
        };
      })
      // Add Bookmark
      .addCase(addBookmark.fulfilled, (state, action) => {
        const { bookId } = action.payload;
        if (state.readingProgress[bookId]) {
          state.readingProgress[bookId].bookmarks.push(action.payload);
        }
      })
      // Add Annotation
      .addCase(addAnnotation.fulfilled, (state, action) => {
        const { bookId } = action.payload;
        if (state.readingProgress[bookId]) {
          state.readingProgress[bookId].annotations.push(action.payload);
        }
      });
  },
});

export const { updateReaderSettings, resetReaderSettings } = ebookSlice.actions;

export const selectEBook = (state: RootState, bookId: string) => state.ebook.ebooks[bookId];

export const selectReadingProgress = (state: RootState, bookId: string) =>
  state.ebook.readingProgress[bookId];

export const selectReaderSettings = (state: RootState) => state.ebook.readerSettings;

export const selectEBookLoading = (state: RootState) => state.ebook.loading;

export const selectEBookError = (state: RootState) => state.ebook.error;

export default ebookSlice.reducer;
