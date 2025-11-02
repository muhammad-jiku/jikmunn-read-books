import { ReadingListCard } from '@components/ReadingListCard';
import { ReadingProgress } from '@components/ReadingProgress';
import { readingListApi } from '@services/readingListApi';
import type { BookStatus, ReadingListBook } from '@types/readingList';
import React, { useState } from 'react';

const { useGetReadingListQuery } = readingListApi;

export const ReadingListPage: React.FC = () => {
  const [filter, setFilter] = useState<BookStatus | 'all'>('all');
  const { data: readingList, isLoading, error } = useGetReadingListQuery();

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='animate-pulse space-y-4'>
          <div className='h-24 bg-gray-200 rounded'></div>
          <div className='h-48 bg-gray-200 rounded'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
          Failed to load reading list. Please try again later.
        </div>
      </div>
    );
  }

  const filteredBooks = readingList?.books.filter(
    (book: ReadingListBook) => filter === 'all' || book.status === filter,
  );

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2'>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-2xl font-bold'>My Reading List</h1>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as BookStatus | 'all')}
              className='rounded-md border-gray-300 text-sm focus:ring-primary-500 focus:border-primary-500'
              title='Filter reading list'
              aria-label='Filter books by reading status'
            >
              <option value='all'>All Books</option>
              <option value='reading'>Reading</option>
              <option value='plan to read'>Plan to Read</option>
              <option value='finished'>Finished</option>
            </select>
          </div>

          {filteredBooks?.length === 0 ? (
            <div className='text-center py-8 bg-gray-50 rounded-lg'>
              <p className='text-gray-600'>
                {filter === 'all'
                  ? "You haven't added any books to your reading list yet."
                  : `You don't have any ${filter} books.`}
              </p>
            </div>
          ) : (
            <div className='space-y-4'>
              {filteredBooks?.map((book: ReadingListBook) => (
                <ReadingListCard key={book.book.id} book={book} />
              ))}
            </div>
          )}
        </div>

        <div>
          <ReadingProgress />
        </div>
      </div>
    </div>
  );
};
