import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Book, BookFilters, BookListResponse } from '../../types/book';

interface BookState {
  books: Book[];
  featuredBooks: Book[];
  newReleases: Book[];
  bestSellers: Book[];
  currentBook: Book | null;
  relatedBooks: Book[];
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  hasMore: boolean;
}

const initialState: BookState = {
  books: [],
  featuredBooks: [],
  newReleases: [],
  bestSellers: [],
  currentBook: null,
  relatedBooks: [],
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  hasMore: true,
};

// Fetch books with filters
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (filters: BookFilters & { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await axios.get<BookListResponse>(`/api/v1/books?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to fetch books');
    }
  },
);

// Fetch featured books
export const fetchFeaturedBooks = createAsyncThunk(
  'books/fetchFeaturedBooks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Book[]>('/api/v1/books/featured');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to fetch featured books');
    }
  },
);

// Fetch book details
export const fetchBookDetails = createAsyncThunk(
  'books/fetchBookDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<Book>(`/api/v1/books/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to fetch book details');
    }
  },
);

// Fetch related books
export const fetchRelatedBooks = createAsyncThunk(
  'books/fetchRelatedBooks',
  async (
    {
      categoryId,
      excludeId,
      limit = 4,
    }: {
      categoryId: string;
      excludeId: string;
      limit?: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.get<Book[]>(
        `/api/v1/books/related?categoryId=${categoryId}&excludeId=${excludeId}&limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to fetch related books');
    }
  },
);

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearBooks: (state) => {
      state.books = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Books
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg.page === 1) {
          state.books = action.payload.books;
        } else {
          state.books = [...state.books, ...action.payload.books];
        }
        state.total = action.payload.total;
        state.currentPage = action.payload.page;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Featured Books
      .addCase(fetchFeaturedBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredBooks = action.payload;
      })
      .addCase(fetchFeaturedBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Book Details
      .addCase(fetchBookDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBook = action.payload;
      })
      .addCase(fetchBookDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Related Books
      .addCase(fetchRelatedBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRelatedBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.relatedBooks = action.payload;
      })
      .addCase(fetchRelatedBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBooks } = bookSlice.actions;
export default bookSlice.reducer;
