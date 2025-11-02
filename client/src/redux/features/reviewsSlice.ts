import { api } from '@/utils/api';
import type { RootState } from '@redux/store';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Review, ReviewCreateData, ReviewStats, ReviewUpdateData } from '@types/review';

interface ReviewsState {
  reviews: { [bookId: string]: Review[] };
  stats: { [bookId: string]: ReviewStats };
  userReviews: Review[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewsState = {
  reviews: {},
  stats: {},
  userReviews: [],
  loading: false,
  error: null,
};

export const fetchBookReviews = createAsyncThunk(
  'reviews/fetchBookReviews',
  async (bookId: string) => {
    const response = await api.get(`/books/${bookId}/reviews`);
    return { bookId, data: response.data };
  },
);

export const fetchBookReviewStats = createAsyncThunk(
  'reviews/fetchBookReviewStats',
  async (bookId: string) => {
    const response = await api.get(`/books/${bookId}/reviews/stats`);
    return { bookId, data: response.data };
  },
);

export const fetchUserReviews = createAsyncThunk('reviews/fetchUserReviews', async () => {
  const response = await api.get('/users/me/reviews');
  return response.data;
});

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (data: ReviewCreateData) => {
    const response = await api.post(`/books/${data.bookId}/reviews`, data);
    return response.data;
  },
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, data }: { reviewId: string; data: ReviewUpdateData }) => {
    const response = await api.patch(`/reviews/${reviewId}`, data);
    return response.data;
  },
);

export const deleteReview = createAsyncThunk('reviews/deleteReview', async (reviewId: string) => {
  await api.delete(`/reviews/${reviewId}`);
  return reviewId;
});

export const voteReview = createAsyncThunk(
  'reviews/voteReview',
  async ({ reviewId, isHelpful }: { reviewId: string; isHelpful: boolean }) => {
    const response = await api.post(`/reviews/${reviewId}/vote`, { isHelpful });
    return response.data;
  },
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Book Reviews
      .addCase(fetchBookReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookReviews.fulfilled, (state, action) => {
        const { bookId, data } = action.payload;
        state.loading = false;
        state.reviews[bookId] = data;
      })
      .addCase(fetchBookReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch reviews';
      })
      // Fetch Book Review Stats
      .addCase(fetchBookReviewStats.fulfilled, (state, action) => {
        const { bookId, data } = action.payload;
        state.stats[bookId] = data;
      })
      // Fetch User Reviews
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.userReviews = action.payload;
      })
      // Create Review
      .addCase(createReview.fulfilled, (state, action) => {
        const review = action.payload;
        if (state.reviews[review.bookId]) {
          state.reviews[review.bookId].unshift(review);
        } else {
          state.reviews[review.bookId] = [review];
        }
        state.userReviews.unshift(review);
      })
      // Update Review
      .addCase(updateReview.fulfilled, (state, action) => {
        const updatedReview = action.payload;
        if (state.reviews[updatedReview.bookId]) {
          state.reviews[updatedReview.bookId] = state.reviews[updatedReview.bookId].map((review) =>
            review.id === updatedReview.id ? updatedReview : review,
          );
        }
        state.userReviews = state.userReviews.map((review) =>
          review.id === updatedReview.id ? updatedReview : review,
        );
      })
      // Delete Review
      .addCase(deleteReview.fulfilled, (state, action) => {
        const reviewId = action.payload;
        // Remove from book reviews
        Object.keys(state.reviews).forEach((bookId) => {
          state.reviews[bookId] = state.reviews[bookId].filter((review) => review.id !== reviewId);
        });
        // Remove from user reviews
        state.userReviews = state.userReviews.filter((review) => review.id !== reviewId);
      })
      // Vote Review
      .addCase(voteReview.fulfilled, (state, action) => {
        const votedReview = action.payload;
        // Update in book reviews
        if (state.reviews[votedReview.bookId]) {
          state.reviews[votedReview.bookId] = state.reviews[votedReview.bookId].map((review) =>
            review.id === votedReview.id ? votedReview : review,
          );
        }
        // Update in user reviews
        state.userReviews = state.userReviews.map((review) =>
          review.id === votedReview.id ? votedReview : review,
        );
      });
  },
});

export const selectBookReviews = (state: RootState, bookId: string) =>
  state.reviews.reviews[bookId] || [];

export const selectBookReviewStats = (state: RootState, bookId: string) =>
  state.reviews.stats[bookId];

export const selectUserReviews = (state: RootState) => state.reviews.userReviews;

export const selectReviewsLoading = (state: RootState) => state.reviews.loading;

export const selectReviewsError = (state: RootState) => state.reviews.error;

export default reviewsSlice.reducer;
