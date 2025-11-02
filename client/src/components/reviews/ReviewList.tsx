import { formatDistanceToNow } from 'date-fns';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import React from 'react';
import type { Review } from '../../types/review';
import StarRating from './StarRating';

interface ReviewListProps {
  reviews: Review[];
  onVote?: (reviewId: string, isHelpful: boolean) => void;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
  showActions?: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  onVote,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const handleVote = (reviewId: string, isHelpful: boolean) => {
    if (onVote) {
      onVote(reviewId, isHelpful);
    }
  };

  const handleEdit = (review: Review) => {
    if (onEdit) {
      onEdit(review);
    }
  };

  const handleDelete = (reviewId: string) => {
    if (onDelete && window.confirm('Are you sure you want to delete this review?')) {
      onDelete(reviewId);
    }
  };

  if (reviews.length === 0) {
    return (
      <div className='text-center py-8 text-gray-500'>No reviews yet. Be the first to review!</div>
    );
  }

  return (
    <div className='space-y-6'>
      {reviews.map((review) => (
        <div key={review.id} className='border-b border-gray-200 pb-6 last:border-b-0'>
          <div className='flex justify-between items-start'>
            <div className='flex items-center space-x-4'>
              {review.user.avatar ? (
                <img
                  src={review.user.avatar}
                  alt={`${review.user.firstName} ${review.user.lastName}`}
                  className='w-10 h-10 rounded-full'
                />
              ) : (
                <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
                  <span className='text-xl text-gray-600'>{review.user.firstName[0]}</span>
                </div>
              )}
              <div>
                <p className='font-medium'>
                  {review.user.firstName} {review.user.lastName}
                </p>
                <div className='flex items-center space-x-2'>
                  <StarRating rating={review.rating} size='sm' />
                  <span className='text-sm text-gray-500'>
                    {formatDistanceToNow(new Date(review.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
            {review.isVerifiedPurchase && (
              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                Verified Purchase
              </span>
            )}
          </div>

          <h4 className='mt-4 font-medium'>{review.title}</h4>
          <p className='mt-2 text-gray-600'>{review.content}</p>

          {showActions && (
            <div className='mt-4 flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <button
                  onClick={() => handleVote(review.id, true)}
                  className='inline-flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700'
                >
                  <ThumbsUp className='w-4 h-4' />
                  <span>Helpful ({review.helpfulVotes})</span>
                </button>
                <button
                  onClick={() => handleVote(review.id, false)}
                  className='inline-flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700'
                  title='Mark as not helpful'
                  aria-label='Mark review as not helpful'
                >
                  <ThumbsDown className='w-4 h-4' />
                </button>
              </div>

              {onEdit && onDelete && (
                <div className='flex items-center space-x-4'>
                  <button
                    onClick={() => handleEdit(review)}
                    className='text-sm text-indigo-600 hover:text-indigo-900'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className='text-sm text-red-600 hover:text-red-900'
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
