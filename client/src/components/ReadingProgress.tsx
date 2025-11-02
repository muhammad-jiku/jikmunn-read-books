import React from 'react';
import { readingListApi } from '../services/readingListApi';
import '../styles/progress.css';

const { useGetReadingProgressQuery } = readingListApi;

export const ReadingProgress: React.FC = () => {
  const { data: progress, isLoading } = useGetReadingProgressQuery();

  if (isLoading) {
    return (
      <div className='animate-pulse'>
        <div className='h-24 bg-gray-200 rounded'></div>
      </div>
    );
  }

  if (!progress) return null;

  const calculatePercentage = (value: number) => (value / progress.totalBooks) * 100 || 0;

  return (
    <div className='bg-white rounded-lg shadow p-6'>
      <h2 className='text-xl font-semibold mb-4'>Reading Progress</h2>

      <div className='space-y-4'>
        <div>
          <div className='flex justify-between mb-1'>
            <span className='text-sm font-medium'>Reading</span>
            <span className='text-sm text-gray-600'>{progress.reading} books</span>
          </div>
          <div className='w-full progress-bar progress-bar-base'>
            <div
              className='progress-bar progress-bar-reading'
              style={
                {
                  '--progress-width': `${calculatePercentage(progress.reading)}%`,
                } as React.CSSProperties
              }
            ></div>
          </div>
        </div>

        <div>
          <div className='flex justify-between mb-1'>
            <span className='text-sm font-medium'>Plan to Read</span>
            <span className='text-sm text-gray-600'>{progress.planToRead} books</span>
          </div>
          <div className='w-full progress-bar progress-bar-base'>
            <div
              className='progress-bar progress-bar-plan'
              style={
                {
                  '--progress-width': `${calculatePercentage(progress.planToRead)}%`,
                } as React.CSSProperties
              }
            ></div>
          </div>
        </div>

        <div>
          <div className='flex justify-between mb-1'>
            <span className='text-sm font-medium'>Finished</span>
            <span className='text-sm text-gray-600'>{progress.finished} books</span>
          </div>
          <div className='w-full progress-bar progress-bar-base'>
            <div
              className='progress-bar progress-bar-finished'
              style={
                {
                  '--progress-width': `${calculatePercentage(progress.finished)}%`,
                } as React.CSSProperties
              }
            ></div>
          </div>
        </div>

        <div className='pt-2 border-t'>
          <div className='flex justify-between'>
            <span className='font-medium'>Total Books</span>
            <span className='font-medium'>{progress.totalBooks}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
