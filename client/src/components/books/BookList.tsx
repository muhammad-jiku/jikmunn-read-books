import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearBooks, fetchBooks } from '../../redux/features/bookSlice';
import { type AppDispatch, type RootState } from '../../redux/store';
import type { Book, BookFilters, BookFormat } from '../../types/book';
import { PriceFilter } from '../filters/PriceFilter';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import BookCard from './BookCard';

const ITEMS_PER_PAGE = 12;

const BookList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { books, loading, error, currentPage, hasMore, total } = useSelector(
    (state: RootState) => state.books,
  );

  const [filters, setFilters] = useState<BookFilters>({
    sortBy: 'title',
    sortOrder: 'asc',
  });

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<BookFormat | ''>('');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000,
  });

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min, max });
  };
  const [searchTerm, setSearchTerm] = useState('');

  // Handle filter changes
  const handleFilterChange = () => {
    const newFilters: BookFilters = {
      ...filters,
      search: searchTerm,
      category: selectedCategory || undefined,
      format: selectedFormat || undefined,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    };
    setFilters(newFilters);
    dispatch(clearBooks());
    dispatch(
      fetchBooks({
        ...newFilters,
        page: 1,
        limit: ITEMS_PER_PAGE,
      }),
    );
  };

  // Load more books
  const loadMore = () => {
    if (!loading && hasMore) {
      dispatch(
        fetchBooks({
          ...filters,
          page: currentPage + 1,
          limit: ITEMS_PER_PAGE,
        }),
      );
    }
  };

  // Initial load
  useEffect(() => {
    dispatch(
      fetchBooks({
        ...filters,
        page: 1,
        limit: ITEMS_PER_PAGE,
      }),
    );
  }, [dispatch, filters]);

  if (error) {
    return <div className='text-center text-red-600 p-4'>Error: {error}</div>;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Filters */}
      <div className='mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {/* Search */}
        <div>
          <input
            type='text'
            placeholder='Search books...'
            className='w-full px-4 py-2 border rounded-lg'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            aria-label='Filter by category'
            className='w-full px-4 py-2 border rounded-lg'
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value=''>All Categories</option>
            {/* Add categories dynamically */}
          </select>
        </div>

        {/* Format Filter */}
        <div>
          <select
            aria-label='Filter by format'
            className='w-full px-4 py-2 border rounded-lg'
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value as BookFormat)}
          >
            <option value=''>All Formats</option>
            <option value='hardcover'>Hardcover</option>
            <option value='paperback'>Paperback</option>
            <option value='ebook'>eBook</option>
            <option value='audiobook'>Audiobook</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <select
            aria-label='Sort books'
            className='w-full px-4 py-2 border rounded-lg'
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              setFilters({
                ...filters,
                sortBy: sortBy as BookFilters['sortBy'],
                sortOrder: sortOrder as 'asc' | 'desc',
              });
            }}
          >
            <option value='title-asc'>Title (A-Z)</option>
            <option value='title-desc'>Title (Z-A)</option>
            <option value='price-asc'>Price (Low to High)</option>
            <option value='price-desc'>Price (High to Low)</option>
            <option value='rating-desc'>Highest Rated</option>
            <option value='publishedDate-desc'>Newest</option>
          </select>
        </div>

        {/* Price Filter */}
        <div className='md:col-span-2 lg:col-span-4'>
          <PriceFilter
            min={priceRange.min}
            max={priceRange.max}
            onPriceChange={handlePriceRangeChange}
          />
        </div>

        {/* Apply Filters Button */}
        <div className='md:col-span-2 lg:col-span-4'>
          <button
            onClick={handleFilterChange}
            className='w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className='mb-4 text-gray-600'>
        Showing {books.length} of {total} books
      </div>

      {/* Book Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {books.map((book: Book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className='mt-8 text-center'>
          <button
            onClick={loadMore}
            disabled={loading}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300'
          >
            {loading ? <LoadingSpinner /> : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BookList;
