import { LoadingSpinner } from '@/components/ui/loading-spinner';
import CartItem from '@components/cart/CartItem';
import { applyCoupon, fetchCart } from '@redux/features/cartSlice';
import type { AppDispatch, RootState } from '@redux/store';
import type { CartItem as CartItemType } from '@types/cart';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, subtotal, discount, total, loading, error, couponCode } = useSelector(
    (state: RootState) => state.cart,
  );
  const [coupon, setCoupon] = useState(couponCode || '');

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleApplyCoupon = () => {
    if (coupon.trim()) {
      dispatch(applyCoupon(coupon.trim()));
    }
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
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>Your Cart is Empty</h1>
          <p className='text-gray-600 mb-6'>Add some books to your cart and come back!</p>
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
      <h1 className='text-2xl font-bold text-gray-900 mb-8'>Shopping Cart</h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Cart Items */}
        <div className='lg:col-span-2 space-y-4'>
          {items.map((item: CartItemType) => (
            <CartItem key={item.bookId} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <div className='lg:col-span-1'>
          <div className='bg-gray-50 rounded-lg p-6 sticky top-4'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>Order Summary</h2>

            {/* Coupon Code */}
            <div className='mb-6'>
              <div className='flex gap-2'>
                <input
                  type='text'
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder='Enter coupon code'
                  className='grow px-4 py-2 border rounded-lg'
                  aria-label='Coupon code'
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={!coupon.trim()}
                  className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300'
                >
                  Apply
                </button>
              </div>
              {error && error.includes('coupon') && (
                <p className='text-red-600 text-sm mt-2'>{error}</p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className='space-y-3 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Subtotal</span>
                <span className='font-semibold'>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className='flex justify-between text-green-600'>
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className='flex justify-between text-lg font-semibold border-t border-gray-200 pt-3'>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className='w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition-colors'
            >
              Proceed to Checkout
            </button>

            {/* Continue Shopping */}
            <button
              onClick={() => navigate('/books')}
              className='w-full bg-gray-100 text-gray-800 py-3 rounded-lg mt-3 hover:bg-gray-200 transition-colors'
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
