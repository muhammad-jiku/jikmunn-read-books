import { LoadingSpinner } from '@/components/ui/loading-spinner';
import CheckoutForm from '@components/checkout/CheckoutForm';
import { fetchCart } from '@redux/features/cartSlice';
import { placeOrder } from '@redux/features/orderSlice';
import type { AppDispatch, RootState } from '@redux/store';
import type { PaymentMethod, ShippingAddress } from '@types/order';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    items,
    subtotal,
    discount,
    total,
    loading: cartLoading,
    error: cartError,
  } = useSelector((state: RootState) => state.cart);
  const {
    loading: orderLoading,
    error: orderError,
    currentOrder,
  } = useSelector((state: RootState) => state.order);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (currentOrder) {
      navigate(`/orders/${currentOrder.id}`);
    }
  }, [currentOrder, navigate]);

  const handleSubmit = async (data: {
    shippingAddress: ShippingAddress;
    paymentMethod: PaymentMethod;
  }) => {
    dispatch(placeOrder(data));
  };

  if (cartLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <LoadingSpinner />
      </div>
    );
  }

  if (cartError) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center text-red-600'>Error: {cartError}</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>Your Cart is Empty</h1>
          <p className='text-gray-600 mb-6'>
            Add some books to your cart to proceed with checkout.
          </p>
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
      <h1 className='text-2xl font-bold text-gray-900 mb-8'>Checkout</h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Order Form */}
        <div className='lg:col-span-2'>
          <CheckoutForm onSubmit={handleSubmit} isSubmitting={orderLoading} />
          {orderError && <div className='mt-4 text-red-600'>Error: {orderError}</div>}
        </div>

        {/* Order Summary */}
        <div className='lg:col-span-1'>
          <div className='bg-gray-50 rounded-lg p-6 sticky top-4'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>Order Summary</h2>

            {/* Items */}
            <div className='space-y-4 mb-6'>
              {items.map((item: CartItem) => (
                <div key={item.bookId} className='flex justify-between'>
                  <div className='grow'>
                    <p className='text-gray-800 font-medium'>{item.book.title}</p>
                    <p className='text-sm text-gray-600'>Quantity: {item.quantity}</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-gray-800'>
                      ${(item.book.inventory.price * item.quantity).toFixed(2)}
                    </p>
                    {item.book.inventory.discountPercentage > 0 && (
                      <p className='text-sm text-red-600'>
                        -{item.book.inventory.discountPercentage}%
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className='space-y-3 text-sm border-t border-gray-200 pt-4'>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
