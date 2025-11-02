import { api } from '@utils/api';
import type { BookStatus, ReadingList, ReadingProgress } from '../interfaces/readingList';

export const readingListApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReadingList: builder.query<ReadingList, void>({
      query: () => 'customer-book-lists/my-list',
      providesTags: ['Books'],
    }),

    getReadingProgress: builder.query<ReadingProgress, void>({
      query: () => 'customer-book-lists/progress',
      providesTags: ['Books'],
    }),

    addToReadingList: builder.mutation<void, { bookId: string; status: BookStatus }>({
      query: (body) => ({
        url: 'customer-book-lists',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Books'],
    }),

    updateBookStatus: builder.mutation<void, { bookId: string; status: BookStatus }>({
      query: ({ bookId, status }) => ({
        url: `customer-book-lists/${bookId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Books'],
    }),

    removeFromReadingList: builder.mutation<void, string>({
      query: (bookId) => ({
        url: `customer-book-lists/${bookId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Books'],
    }),
  }),
});

export const {
  useGetReadingListQuery,
  useGetReadingProgressQuery,
  useAddToReadingListMutation,
  useUpdateBookStatusMutation,
  useRemoveFromReadingListMutation,
} = readingListApi;
