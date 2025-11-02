import React from 'react';
import { Link } from 'react-router-dom';
import { readingListApi } from '../services/readingListApi';
import type { BookStatus, ReadingListBook } from '../types/readingList';

const { useUpdateBookStatusMutation, useRemoveFromReadingListMutation } = readingListApi;

interface Props {
  book: ReadingListBook;
}

const statusColors: Record<BookStatus, string> = {
  reading: 'bg-blue-100 text-blue-800',
  'plan to read': 'bg-yellow-100 text-yellow-800',
  finished: 'bg-green-100 text-green-800',
};

export const ReadingListCard: React.FC<Props> = ({ book }) => {
  const [updateStatus] = useUpdateBookStatusMutation();
  const [removeBook] = useRemoveFromReadingListMutation();

  const handleStatusChange = async (status: BookStatus) => {
    try {
      await updateStatus({ bookId: book.book.id, status }).unwrap();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleRemove = async () => {
    try {
      await removeBook(book.book.id).unwrap();
    } catch (error) {
      console.error('Failed to remove book:', error);
    }
  };

  return (
    <div className='flex items-start space-x-4 p-4 bg-white rounded-lg shadow'>
      <img
        src={book.book.coverImage}
        alt={book.book.title}
        className='w-24 h-36 object-cover rounded'
      />
      <div className='flex-1'>
        <Link
          to={`/books/${book.book.id}`}
          className='text-lg font-semibold hover:text-primary-600'
        >
          {book.book.title}
        </Link>
        <p className='text-gray-600'>
          {`${book.book.author.name.firstName} ${book.book.author.name.middleName ? book.book.author.name.middleName + ' ' : ''}${book.book.author.name.lastName}`}
        </p>

        <div className='mt-2'>
          <select
            value={book.status}
            onChange={(e) => handleStatusChange(e.target.value as BookStatus)}
            className='rounded-md border-gray-300 text-sm focus:ring-primary-500 focus:border-primary-500'
            aria-label='Reading status'
            title='Change reading status'
          >
            <option value='reading'>Reading</option>
            <option value='plan to read'>Plan to Read</option>
            <option value='finished'>Finished</option>
          </select>

          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${statusColors[book.status]}`}>
            {book.status}
          </span>
        </div>

        <button onClick={handleRemove} className='mt-2 text-sm text-red-600 hover:text-red-800'>
          Remove from list
        </button>
      </div>
    </div>
  );
};
