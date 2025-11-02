import { paymentsApi } from '@services/paymentsApi';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Payment, PaymentStatus } from '../../interfaces/payment';

const { useGetPaymentHistoryQuery } = paymentsApi;

const statusColors: Record<PaymentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
  refunded: 'bg-purple-100 text-purple-800',
};

export const PaymentHistory: React.FC = () => {
  const [filters, setFilters] = useState<{
    startDate: string;
    endDate: string;
    status: PaymentStatus | undefined;
  }>({
    startDate: '',
    endDate: '',
    status: undefined,
  });

  const { data, isLoading } = useGetPaymentHistoryQuery(filters);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isLoading) {
    return (
      <div className='animate-pulse'>
        <div className='h-10 bg-gray-200 rounded w-1/4 mb-4'></div>
        <div className='space-y-4'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='h-20 bg-gray-200 rounded'></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='bg-white shadow rounded-lg p-6'>
        <h2 className='text-lg font-medium text-gray-900 mb-4'>Payment Filters</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label htmlFor='startDate' className='block text-sm font-medium text-gray-700'>
              Start Date
            </label>
            <input
              type='date'
              id='startDate'
              name='startDate'
              value={filters.startDate}
              onChange={handleFilterChange}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500'
            />
          </div>
          <div>
            <label htmlFor='endDate' className='block text-sm font-medium text-gray-700'>
              End Date
            </label>
            <input
              type='date'
              id='endDate'
              name='endDate'
              value={filters.endDate}
              onChange={handleFilterChange}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500'
            />
          </div>
          <div>
            <label htmlFor='status' className='block text-sm font-medium text-gray-700'>
              Status
            </label>
            <select
              id='status'
              name='status'
              value={filters.status}
              onChange={handleFilterChange}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500'
            >
              <option value=''>All</option>
              <option value='pending'>Pending</option>
              <option value='processing'>Processing</option>
              <option value='completed'>Completed</option>
              <option value='failed'>Failed</option>
              <option value='cancelled'>Cancelled</option>
              <option value='refunded'>Refunded</option>
            </select>
          </div>
        </div>
      </div>

      <div className='bg-white shadow rounded-lg overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Transaction ID
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Amount
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Date
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {data?.payments.map((payment: Payment) => (
                <tr key={payment.id}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {payment.transactionId}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {payment.currency} {payment.amount.toFixed(2)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusColors[payment.status]
                      }`}
                    >
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    <Link
                      to={`/payments/${payment.id}`}
                      className='text-primary-600 hover:text-primary-900'
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data?.payments.length === 0 && (
          <div className='text-center py-6 text-gray-500'>No payment records found</div>
        )}
      </div>
    </div>
  );
};
