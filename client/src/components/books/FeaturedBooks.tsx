import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedBooks } from '../../redux/features/bookSlice';
import type { AppDispatch, RootState } from '../../redux/store';
import type { Book } from '../../types/book';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import BookCard from './BookCard';

const FeaturedBooks: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { featuredBooks, loading, error } = useSelector((state: RootState) => state.books);

  useEffect(() => {
    dispatch(fetchFeaturedBooks());
  }, [dispatch]);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-40'>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className='text-center text-red-600 p-4'>Error: {error}</div>;
  }

  if (featuredBooks.length === 0) {
    return null;
  }

  return (
    <section className='py-12 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <h2 className='text-3xl font-bold text-gray-800 mb-8'>Featured Books</h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {featuredBooks.map((book: Book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBooks;
