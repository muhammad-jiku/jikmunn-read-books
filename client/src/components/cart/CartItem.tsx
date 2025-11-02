import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart, updateCartItem } from '../../redux/features/cartSlice';
import type { AppDispatch } from '../../redux/store';
import type { CartItem as CartItemType } from '../../types/cart';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { book, quantity } = item;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch(removeFromCart(book.id));
    } else {
      dispatch(updateCartItem({ bookId: book.id, quantity: newQuantity }));
    }
  };

  const discountedPrice = book.inventory.discountPercentage
    ? book.inventory.price * (1 - book.inventory.discountPercentage / 100)
    : book.inventory.price;

  const totalPrice = discountedPrice * quantity;

  return (
    <div className='flex gap-4 py-4 border-b border-gray-200'>
      {/* Book Image */}
      <Link to={`/books/${book.id}`} className='shrink-0'>
        <img src={book.coverImage} alt={book.title} className='w-24 h-32 object-cover rounded-md' />
      </Link>

      {/* Book Details */}
      <div className='grow'>
        <Link
          to={`/books/${book.id}`}
          className='text-lg font-semibold text-gray-800 hover:text-blue-600'
        >
          {book.title}
        </Link>

        <p className='text-sm text-gray-600 mt-1'>
          by {`${book.author.name.firstName} ${book.author.name.lastName}`}
        </p>

        <div className='mt-2 text-sm text-gray-500'>Format: {book.format}</div>

        {/* Price Information */}
        <div className='mt-2 flex items-center gap-2'>
          <span className='text-lg font-semibold'>${discountedPrice.toFixed(2)}</span>
          {book.inventory.discountPercentage && (
            <>
              <span className='text-sm text-gray-500 line-through'>
                ${book.inventory.price.toFixed(2)}
              </span>
              <span className='text-sm text-red-600'>
                ({book.inventory.discountPercentage}% off)
              </span>
            </>
          )}
        </div>

        {/* Quantity Controls */}
        <div className='mt-4 flex items-center gap-4'>
          <div className='flex items-center'>
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className='p-1 rounded-l border border-gray-300 hover:bg-gray-100'
              aria-label='Decrease quantity'
              title='Decrease quantity'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 12H4' />
              </svg>
            </button>
            <input
              type='number'
              min='1'
              max={book.inventory.stock}
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
              className='w-16 text-center border-t border-b border-gray-300'
              aria-label='Quantity'
              title='Quantity'
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className='p-1 rounded-r border border-gray-300 hover:bg-gray-100'
              disabled={quantity >= book.inventory.stock}
              aria-label='Increase quantity'
              title='Increase quantity'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 4v16m8-8H4'
                />
              </svg>
            </button>
          </div>

          <button
            onClick={() => dispatch(removeFromCart(book.id))}
            className='text-red-600 hover:text-red-800'
          >
            Remove
          </button>
        </div>

        {/* Total */}
        <div className='mt-2 text-right'>
          <span className='text-sm text-gray-600'>
            Total: <span className='font-semibold'>${totalPrice.toFixed(2)}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
