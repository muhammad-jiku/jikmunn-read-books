import type { BookStatus } from '@/types/readingList';
import { useAddToReadingListMutation } from '@services/readingListApi';
import React, { useState } from 'react';

interface Props {
  bookId: string;
  className?: string;
}

export const AddToReadingListButton: React.FC<Props> = ({ bookId, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [addToList, { isLoading }] = useAddToReadingListMutation();

  const handleAdd = async (status: BookStatus) => {
    try {
      await addToList({ bookId, status }).unwrap();
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to add book to reading list:', error);
    }
  };

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
      >
        Add to Reading List
      </button>

      {isOpen && (
        <div className='absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5'>
          <div className='py-1' role='menu'>
            <button
              onClick={() => handleAdd('reading')}
              className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              role='menuitem'
            >
              Currently Reading
            </button>
            <button
              onClick={() => handleAdd('want-to-read')}
              className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              role='menuitem'
            >
              Want to Read
            </button>
            <button
              onClick={() => handleAdd('completed')}
              className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              role='menuitem'
            >
              Completed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
