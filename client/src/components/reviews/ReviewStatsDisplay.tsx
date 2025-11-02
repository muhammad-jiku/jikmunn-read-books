import React from 'react';
import '../../styles/reviews.css';
import type { ReviewStats } from '../../types/review';
import StarRating from './StarRating';

interface ReviewStatsProps {
  stats: ReviewStats;
}

const ReviewStatsDisplay: React.FC<ReviewStatsProps> = ({ stats }) => {
  const calculatePercentage = (count: number) => {
    return ((count / stats.totalReviews) * 100).toFixed(0);
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center space-x-4'>
        <div className='text-4xl font-bold'>{stats.averageRating.toFixed(1)}</div>
        <div>
          <StarRating rating={stats.averageRating} size='lg' />
          <p className='text-sm text-gray-500 mt-1'>{stats.totalReviews} total reviews</p>
        </div>
      </div>

      <div className='space-y-2'>
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className='flex items-center space-x-2'>
            <div className='w-12 text-sm text-gray-600'>{rating} stars</div>
            <div className='flex-1'>
              <div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
                <div
                  className='rating-bar'
                  style={
                    {
                      '--rating-width': `${calculatePercentage(stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution])}%`,
                    } as React.CSSProperties
                  }
                />
              </div>
            </div>
            <div className='w-12 text-sm text-gray-600 text-right'>
              {calculatePercentage(
                stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution],
              )}
              %
            </div>
          </div>
        ))}
      </div>

      <div className='text-sm text-gray-600'>{stats.verifiedPurchases} verified purchases</div>
    </div>
  );
};

export default ReviewStatsDisplay;
