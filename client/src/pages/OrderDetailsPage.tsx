import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { OrderItem } from '@/types/order';
import { cancelOrder, fetchOrderDetails } from '@redux/features/orderSlice';
import type { AppDispatch, RootState } from '@redux/store';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { currentOrder, loading, error } = useSelector((state: RootState) => state.order);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderDetails(id));
    }
  }, [dispatch, id]);

  const handleCancelOrder = () => {
    if (id && currentOrder?.status === 'pending') {
      if (window.confirm('Are you sure you want to cancel this order?')) {
        dispatch(cancelOrder(id));
      }
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

  if (!currentOrder) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>Order Not Found</h1>
          <Link to='/orders' className='text-blue-600 hover:text-blue-800'>
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6 flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-900'>Order #{currentOrder.id}</h1>
        <div className='flex items-center gap-4'>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              currentOrder.status === 'delivered'
                ? 'bg-green-100 text-green-800'
                : currentOrder.status === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
            }`}
          >
            {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
          </span>
          {currentOrder.status === 'pending' && (
            <button onClick={handleCancelOrder} className='text-red-600 hover:text-red-800'>
              Cancel Order
            </button>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Order Details */}
        <div>
          <div className='bg-white rounded-lg shadow p-6 mb-6'>
            <h2 className='text-lg font-semibold mb-4'>Order Information</h2>
            <div className='space-y-2 text-sm'>
              <p>
                <span className='text-gray-600'>Order Date:</span>{' '}
                {new Date(currentOrder.createdAt).toLocaleDateString()}
              </p>
              {currentOrder.estimatedDelivery && (
                <p>
                  <span className='text-gray-600'>Estimated Delivery:</span>{' '}
                  {new Date(currentOrder.estimatedDelivery).toLocaleDateString()}
                </p>
              )}
              {currentOrder.trackingNumber && (
                <p>
                  <span className='text-gray-600'>Tracking Number:</span>{' '}
                  {currentOrder.trackingNumber}
                </p>
              )}
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <h2 className='text-lg font-semibold mb-4'>Shipping Information</h2>
            <div className='space-y-2 text-sm'>
              <p>
                {currentOrder.shippingAddress.firstName} {currentOrder.shippingAddress.lastName}
              </p>
              <p>{currentOrder.shippingAddress.addressLine1}</p>
              {currentOrder.shippingAddress.addressLine2 && (
                <p>{currentOrder.shippingAddress.addressLine2}</p>
              )}
              <p>
                {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state}{' '}
                {currentOrder.shippingAddress.postalCode}
              </p>
              <p>{currentOrder.shippingAddress.country}</p>
              <p>Phone: {currentOrder.shippingAddress.phone}</p>
            </div>
          </div>
        </div>

        {/* Items and Summary */}
        <div>
          <div className='bg-white rounded-lg shadow p-6 mb-6'>
            <h2 className='text-lg font-semibold mb-4'>Order Items</h2>
            <div className='space-y-4'>
              {currentOrder.items.map((item: OrderItem) => (
                <div key={item.bookId} className='flex gap-4 py-4 border-b last:border-0'>
                  <Link to={`/books/${item.bookId}`} className='shrink-0'>
                    <img
                      src={item.book.coverImage}
                      alt={item.book.title}
                      className='w-20 h-28 object-cover rounded'
                    />
                  </Link>
                  <div className='grow'>
                    <Link
                      to={`/books/${item.bookId}`}
                      className='text-lg font-medium text-gray-800 hover:text-blue-600'
                    >
                      {item.book.title}
                    </Link>
                    <p className='text-sm text-gray-600'>Quantity: {item.quantity}</p>
                    <div className='mt-2'>
                      <span className='font-medium'>${item.total.toFixed(2)}</span>
                      {item.discount > 0 && (
                        <span className='text-sm text-green-600 ml-2'>
                          (Saved ${item.discount.toFixed(2)})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <h2 className='text-lg font-semibold mb-4'>Order Summary</h2>
            <div className='space-y-3 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Subtotal</span>
                <span>${currentOrder.summary.subtotal.toFixed(2)}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Shipping</span>
                <span>${currentOrder.summary.shipping.toFixed(2)}</span>
              </div>
              {currentOrder.summary.discount > 0 && (
                <div className='flex justify-between text-green-600'>
                  <span>Discount</span>
                  <span>-${currentOrder.summary.discount.toFixed(2)}</span>
                </div>
              )}
              <div className='flex justify-between'>
                <span className='text-gray-600'>Tax</span>
                <span>${currentOrder.summary.tax.toFixed(2)}</span>
              </div>
              <div className='flex justify-between text-lg font-semibold border-t border-gray-200 pt-3'>
                <span>Total</span>
                <span>${currentOrder.summary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
