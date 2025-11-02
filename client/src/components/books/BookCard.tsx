import React from 'react';
import { Link } from 'react-router-dom';
import { type Book } from '../../types/book';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const discountedPrice = book.inventory.discountPercentage
    ? book.inventory.price * (1 - book.inventory.discountPercentage / 100)
    : book.inventory.price;

  return (
    <div className='relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'>
      {/* Badges */}
      <div className='absolute top-2 left-2 flex gap-2'>
        {book.newRelease && (
          <span className='bg-blue-500 text-white text-xs px-2 py-1 rounded'>New</span>
        )}
        {book.bestSeller && (
          <span className='bg-yellow-500 text-white text-xs px-2 py-1 rounded'>Bestseller</span>
        )}
      </div>

      {/* Discount Badge */}
      {book.inventory.discountPercentage && (
        <div className='absolute top-2 right-2'>
          <span className='bg-red-500 text-white text-xs px-2 py-1 rounded'>
            -{book.inventory.discountPercentage}%
          </span>
        </div>
      )}

      {/* Book Cover */}
      <Link to={`/books/${book.id}`}>
        <img
          src={book.coverImage}
          alt={book.title}
          className='w-full h-48 object-cover rounded-t-lg'
        />
      </Link>

      {/* Book Info */}
      <div className='p-4'>
        <Link to={`/books/${book.id}`}>
          <h3 className='text-lg font-semibold text-gray-800 hover:text-blue-600 line-clamp-2'>
            {book.title}
          </h3>
        </Link>

        <p className='text-sm text-gray-600 mt-1'>
          by{' '}
          <Link to={`/authors/${book.author.id}`} className='hover:text-blue-600'>
            {`${book.author.name.firstName} ${book.author.name.lastName}`}
          </Link>
        </p>

        {/* Rating */}
        <div className='flex items-center mt-2'>
          <div className='flex items-center'>
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                className={`w-4 h-4 ${
                  index < Math.floor(book.reviews.averageRating)
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
          <span className='text-sm text-gray-600 ml-1'>({book.reviews.totalReviews})</span>
        </div>

        {/* Price */}
        <div className='mt-3 flex items-center justify-between'>
          <div>
            <span className='text-lg font-bold text-gray-900'>${discountedPrice.toFixed(2)}</span>
            {book.inventory.discountPercentage && (
              <span className='text-sm text-gray-500 line-through ml-2'>
                ${book.inventory.price.toFixed(2)}
              </span>
            )}
          </div>
          <span
            className={`text-sm ${book.inventory.stock > 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {book.inventory.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
