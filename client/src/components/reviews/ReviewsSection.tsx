import React, { useEffect, useState } from 'react';
import {
  createReview,
  deleteReview,
  fetchBookReviews,
  fetchBookReviewStats,
  selectBookReviews,
  selectBookReviewStats,
  selectReviewsLoading,
  updateReview,
  voteReview,
} from '../../redux/features/reviewsSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import type { Review, ReviewCreateData, ReviewUpdateData } from '../../types/review';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import ReviewStatsDisplay from './ReviewStatsDisplay';

interface ReviewsSectionProps {
  bookId: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ bookId }) => {
  const dispatch = useAppDispatch();
  const reviews = useAppSelector((state) => selectBookReviews(state, bookId));
  const stats = useAppSelector((state) => selectBookReviewStats(state, bookId));
  const loading = useAppSelector(selectReviewsLoading);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  useEffect(() => {
    dispatch(fetchBookReviews(bookId));
    dispatch(fetchBookReviewStats(bookId));
  }, [dispatch, bookId]);

  const handleCreateReview = async (data: ReviewCreateData) => {
    await dispatch(createReview(data));
    setShowReviewForm(false);
    // Refresh stats after creating a review
    dispatch(fetchBookReviewStats(bookId));
  };

  const handleUpdateReview = async (data: ReviewUpdateData) => {
    if (editingReview) {
      await dispatch(updateReview({ reviewId: editingReview.id, data }));
      setEditingReview(null);
      // Refresh stats after updating a review
      dispatch(fetchBookReviewStats(bookId));
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    await dispatch(deleteReview(reviewId));
    // Refresh stats after deleting a review
    dispatch(fetchBookReviewStats(bookId));
  };

  const handleVoteReview = async (reviewId: string, isHelpful: boolean) => {
    await dispatch(voteReview({ reviewId, isHelpful }));
  };

  if (!stats) {
    return (
      <div className='py-8'>
        <div className='text-center'>Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className='py-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Left column: Stats and Write Review button */}
          <div>
            <h3 className='text-xl font-semibold mb-4'>Customer Reviews</h3>
            <ReviewStatsDisplay stats={stats} />

            {!showReviewForm && !editingReview && (
              <button
                onClick={() => setShowReviewForm(true)}
                className='mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                Write a Review
              </button>
            )}
          </div>

          {/* Right column: Review form or filters */}
          <div>
            {(showReviewForm || editingReview) && (
              <div>
                <h3 className='text-xl font-semibold mb-4'>
                  {editingReview ? 'Edit Review' : 'Write a Review'}
                </h3>
                <ReviewForm
                  bookId={bookId}
                  onSubmit={editingReview ? handleUpdateReview : handleCreateReview}
                  loading={loading}
                  initialData={editingReview || undefined}
                />
                <button
                  onClick={() => {
                    setShowReviewForm(false);
                    setEditingReview(null);
                  }}
                  className='mt-4 text-sm text-gray-600 hover:text-gray-900'
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews list */}
        <div className='mt-8'>
          <ReviewList
            reviews={reviews}
            onVote={handleVoteReview}
            onEdit={setEditingReview}
            onDelete={handleDeleteReview}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;
