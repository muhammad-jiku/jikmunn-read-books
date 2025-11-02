import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { fetchWishlist, moveToCart, removeFromWishlist } from '@redux/features/wishlistSlice';
import type { AppDispatch, RootState } from '@redux/store';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { Book } from '../types/book';

const WishlistPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state: RootState) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = (bookId: string) => {
    dispatch(removeFromWishlist(bookId));
  };

  const handleMoveToCart = (bookId: string) => {
    dispatch(moveToCart(bookId));
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center text-red-600'>Error: {error}</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>Your Wishlist is Empty</h1>
          <p className='text-gray-600 mb-6'>Start adding books you'd like to read!</p>
          <button
            onClick={() => navigate('/books')}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
          >
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold text-gray-900 mb-8'>My Wishlist</h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {items.map(({ bookId, book, addedAt }: { bookId: string; book: Book; addedAt: string }) => (
          <div key={bookId} className='bg-white rounded-lg shadow-md overflow-hidden'>
            <img src={book.coverImage} alt={book.title} className='w-full h-48 object-cover' />
            <div className='p-4'>
              <h3 className='text-lg font-semibold text-gray-800 line-clamp-2'>{book.title}</h3>
              <p className='text-sm text-gray-600 mt-1'>
                by {`${book.author.name.firstName} ${book.author.name.lastName}`}
              </p>

              <div className='mt-3'>
                <div className='flex items-baseline gap-2'>
                  <span className='text-lg font-bold text-gray-900'>
                    $
                    {book.inventory.discountPercentage
                      ? (
                          book.inventory.price *
                          (1 - book.inventory.discountPercentage / 100)
                        ).toFixed(2)
                      : book.inventory.price.toFixed(2)}
                  </span>
                  {book.inventory.discountPercentage && (
                    <span className='text-sm text-gray-500 line-through'>
                      ${book.inventory.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <div className='mt-4 space-y-2'>
                <button
                  onClick={() => handleMoveToCart(bookId)}
                  disabled={book.inventory.stock === 0}
                  className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400'
                >
                  {book.inventory.stock === 0 ? 'Out of Stock' : 'Move to Cart'}
                </button>
                <button
                  onClick={() => handleRemove(bookId)}
                  className='w-full bg-gray-100 text-gray-800 py-2 rounded hover:bg-gray-200 transition-colors'
                >
                  Remove
                </button>
              </div>

              <div className='mt-3 text-xs text-gray-500'>
                Added {new Date(addedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
