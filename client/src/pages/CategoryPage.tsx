import { LoadingSpinner } from '@/components/ui/loading-spinner';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchBooks } from '../../redux/features/bookSlice';
import { AppDispatch, RootState } from '../../redux/store';
import type { BookCategory } from '../../types/book';
import BookList from '../books/BookList';

interface CategoryPageProps {
  categories: BookCategory[];
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categories }) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.books);

  const category = categories.find((cat) => cat.id === id);

  useEffect(() => {
    if (id) {
      dispatch(
        fetchBooks({
          category: id,
          page: 1,
          limit: 12,
        }),
      );
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className='text-center text-red-600 p-4'>Error: {error}</div>;
  }

  if (!category) {
    return <div className='text-center text-gray-600 p-4'>Category not found</div>;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>{category.name}</h1>
        {category.description && <p className='mt-2 text-gray-600'>{category.description}</p>}
      </div>

      <BookList />
    </div>
  );
};

export default CategoryPage;
