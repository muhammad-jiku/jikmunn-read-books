import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { fetchOrderHistory } from '../../redux/features/orderSlice';
import { AppDispatch, RootState } from '../../redux/store';
import type { Order } from '../../types/order';

const ORDERS_PER_PAGE = 10;

const OrderHistoryPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error, page, hasMore, total } = useSelector(
    (state: RootState) => state.order,
  );

  useEffect(() => {
    dispatch(fetchOrderHistory({ page: 1, limit: ORDERS_PER_PAGE }));
  }, [dispatch]);

  const loadMore = () => {
    if (!loading && hasMore) {
      dispatch(fetchOrderHistory({ page: page + 1, limit: ORDERS_PER_PAGE }));
    }
  };

  if (loading && orders.length === 0) {
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

  if (orders.length === 0) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>No Orders Found</h1>
          <p className='text-gray-600 mb-6'>You haven't placed any orders yet.</p>
          <Link
            to='/books'
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold text-gray-900 mb-8'>Order History</h1>

      <div className='bg-white rounded-lg shadow overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Order ID
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Date
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Total
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Items
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {orders.map((order: Order) => (
                <tr key={order.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    #{order.id}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    ${order.summary.total.toFixed(2)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <Link to={`/orders/${order.id}`} className='text-blue-600 hover:text-blue-900'>
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {hasMore && (
        <div className='mt-6 text-center'>
          <button
            onClick={loadMore}
            disabled={loading}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300'
          >
            {loading ? <LoadingSpinner /> : 'Load More'}
          </button>
        </div>
      )}

      <div className='mt-4 text-center text-sm text-gray-600'>
        Showing {orders.length} of {total} orders
      </div>
    </div>
  );
};

export default OrderHistoryPage;
