import type { Payment } from '@/types/payment';
import React from 'react';

interface Props {
  payment: Payment;
}

const statusColors: Record<Payment['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
  refunded: 'bg-purple-100 text-purple-800',
};

export const PaymentSummary: React.FC<Props> = ({ payment }) => {
  return (
    <div className='bg-white rounded-lg shadow overflow-hidden'>
      <div className='px-4 py-5 sm:px-6'>
        <h3 className='text-lg leading-6 font-medium text-gray-900'>Payment Details</h3>
      </div>
      <div className='border-t border-gray-200 px-4 py-5 sm:p-0'>
        <dl className='sm:divide-y sm:divide-gray-200'>
          <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
            <dt className='text-sm font-medium text-gray-500'>Transaction ID</dt>
            <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
              {payment.transactionId}
            </dd>
          </div>
          <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
            <dt className='text-sm font-medium text-gray-500'>Amount</dt>
            <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
              {payment.currency} {payment.amount.toFixed(2)}
            </dd>
          </div>
          <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
            <dt className='text-sm font-medium text-gray-500'>Status</dt>
            <dd className='mt-1 sm:mt-0 sm:col-span-2'>
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  statusColors[payment.status]
                }`}
              >
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </span>
            </dd>
          </div>
          <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
            <dt className='text-sm font-medium text-gray-500'>Payment Date</dt>
            <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
              {payment.paymentDate ? new Date(payment.paymentDate).toLocaleString() : 'N/A'}
            </dd>
          </div>
          <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
            <dt className='text-sm font-medium text-gray-500'>Payment Gateway</dt>
            <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
              {payment.paymentGateway}
            </dd>
          </div>
          {payment.status === 'refunded' && (
            <>
              <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>Refund Amount</dt>
                <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                  {payment.currency} {payment.refundAmount?.toFixed(2)}
                </dd>
              </div>
              <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>Refund Date</dt>
                <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                  {payment.refundDate ? new Date(payment.refundDate).toLocaleString() : 'N/A'}
                </dd>
              </div>
              <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>Refund Reason</dt>
                <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                  {payment.refundReason || 'N/A'}
                </dd>
              </div>
            </>
          )}
        </dl>
      </div>
    </div>
  );
};
