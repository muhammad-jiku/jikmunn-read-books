import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchBookDetails, fetchRelatedBooks } from '../../redux/features/bookSlice';
import type { AppDispatch, RootState } from '../../redux/store';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import RelatedBooks from './RelatedBooks';

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { currentBook, relatedBooks, loading, error } = useSelector(
    (state: RootState) => state.books,
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchBookDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentBook?.category.id) {
      dispatch(
        fetchRelatedBooks({
          categoryId: currentBook.category.id,
          excludeId: currentBook.id,
          limit: 4,
        }),
      );
    }
  }, [dispatch, currentBook]);

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

  if (!currentBook) {
    return <div className='text-center text-gray-600 p-4'>Book not found</div>;
  }

  const discountedPrice = currentBook.inventory.discountPercentage
    ? currentBook.inventory.price * (1 - currentBook.inventory.discountPercentage / 100)
    : currentBook.inventory.price;

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Left Column - Image */}
        <div className='relative'>
          <img
            src={currentBook.coverImage}
            alt={currentBook.title}
            className='w-full rounded-lg shadow-lg'
          />
          {currentBook.inventory.discountPercentage && (
            <div className='absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full'>
              {currentBook.inventory.discountPercentage}% OFF
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className='space-y-6'>
          {/* Title and Badges */}
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>{currentBook.title}</h1>
            {currentBook.subtitle && (
              <p className='text-xl text-gray-600 mt-2'>{currentBook.subtitle}</p>
            )}
            <div className='flex gap-2 mt-4'>
              {currentBook.newRelease && (
                <span className='bg-blue-500 text-white px-3 py-1 rounded-full text-sm'>
                  New Release
                </span>
              )}
              {currentBook.bestSeller && (
                <span className='bg-yellow-500 text-white px-3 py-1 rounded-full text-sm'>
                  Bestseller
                </span>
              )}
            </div>
          </div>

          {/* Author */}
          <div>
            <h2 className='text-lg font-semibold text-gray-700'>Author</h2>
            <div className='flex items-center mt-2'>
              {currentBook.author.profileImage && (
                <img
                  src={currentBook.author.profileImage}
                  alt={`${currentBook.author.name.firstName} ${currentBook.author.name.lastName}`}
                  className='w-12 h-12 rounded-full mr-4'
                />
              )}
              <p className='text-lg'>
                {`${currentBook.author.name.firstName} ${
                  currentBook.author.name.middleName ? currentBook.author.name.middleName + ' ' : ''
                }${currentBook.author.name.lastName}`}
              </p>
            </div>
          </div>

          {/* Price and Stock */}
          <div>
            <div className='flex items-baseline gap-4'>
              <span className='text-3xl font-bold text-gray-900'>
                ${discountedPrice.toFixed(2)}
              </span>
              {currentBook.inventory.discountPercentage && (
                <span className='text-xl text-gray-500 line-through'>
                  ${currentBook.inventory.price.toFixed(2)}
                </span>
              )}
            </div>
            <p
              className={`mt-2 ${
                currentBook.inventory.stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {currentBook.inventory.stock > 0
                ? `${currentBook.inventory.stock} copies in stock`
                : 'Out of Stock'}
            </p>
          </div>

          {/* Book Details */}
          <div className='grid grid-cols-2 gap-4 text-sm text-gray-600'>
            <div>
              <p>Format: {currentBook.format}</p>
              <p>Language: {currentBook.language}</p>
              <p>Pages: {currentBook.pageCount}</p>
            </div>
            <div>
              <p>ISBN: {currentBook.inventory.isbn}</p>
              <p>Publisher: {currentBook.publisher}</p>
              <p>Published: {new Date(currentBook.publishedDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Ratings */}
          <div>
            <div className='flex items-center gap-2'>
              <div className='flex'>
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`w-5 h-5 ${
                      index < Math.floor(currentBook.reviews.averageRating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                  </svg>
                ))}
              </div>
              <span className='text-gray-600'>({currentBook.reviews.totalReviews} reviews)</span>
            </div>
          </div>

          {/* Actions */}
          <div className='flex gap-4'>
            <button
              className='flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400'
              disabled={currentBook.inventory.stock === 0}
            >
              Add to Cart
            </button>
            <button className='bg-gray-100 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors'>
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className='mt-12'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>About this book</h2>
        <div className='prose max-w-none'>
          {currentBook.description.split('\n').map((paragraph, index) => (
            <p key={index} className='mb-4 text-gray-600'>
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <div className='mt-16'>
          <h2 className='text-2xl font-bold text-gray-900 mb-8'>Related Books</h2>
          <RelatedBooks books={relatedBooks} />
        </div>
      )}
    </div>
  );
};

export default BookDetails;
