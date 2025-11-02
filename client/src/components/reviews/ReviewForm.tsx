import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { ReviewCreateData } from '../../types/review';
import StarRating from './StarRating';

const reviewSchema = z.object({
  bookId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(20, 'Review must be at least 20 characters'),
});

interface ReviewFormProps {
  bookId: string;
  onSubmit: (data: ReviewCreateData) => void;
  loading: boolean;
  initialData?: Partial<ReviewCreateData>;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ bookId, onSubmit, loading, initialData }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewCreateData>({
    resolver: zodResolver<ReviewCreateData, Record<string, unknown>, ReviewCreateData>(
      reviewSchema,
    ),
    defaultValues: {
      bookId,
      rating: initialData?.rating || 0,
      title: initialData?.title || '',
      content: initialData?.content || '',
    },
  });

  const rating = watch('rating');

  const handleRatingChange = (newRating: number) => {
    setValue('rating', newRating);
  };

  const handleFormSubmit = (data: ReviewCreateData) => {
    onSubmit({ ...data, bookId });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Rating</label>
        <StarRating rating={rating} interactive onChange={handleRatingChange} size='lg' />
        {errors.rating && <p className='mt-1 text-sm text-red-600'>{errors.rating.message}</p>}
      </div>

      <div>
        <label htmlFor='title' className='block text-sm font-medium text-gray-700'>
          Review Title
        </label>
        <input
          type='text'
          {...register('title')}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
          placeholder='Summarize your thoughts'
        />
        {errors.title && <p className='mt-1 text-sm text-red-600'>{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor='content' className='block text-sm font-medium text-gray-700'>
          Review Content
        </label>
        <textarea
          {...register('content')}
          rows={4}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
          placeholder='Share your experience with this book'
        />
        {errors.content && <p className='mt-1 text-sm text-red-600'>{errors.content.message}</p>}
      </div>

      <div className='flex justify-end'>
        <button
          type='submit'
          disabled={loading}
          className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50'
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
