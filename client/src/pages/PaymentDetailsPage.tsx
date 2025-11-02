import { PaymentSummary } from '@components/payments/PaymentSummary';
import { useGetPaymentDetailsQuery, useRequestRefundMutation } from '@services/paymentsApi';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export const PaymentDetailsPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { data: payment, isLoading } = useGetPaymentDetailsQuery(id);
  const [requestRefund] = useRequestRefundMutation();
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [refundAmount, setRefundAmount] = useState('');

  if (isLoading) {
    return (
      <div className='animate-pulse p-6 space-y-6'>
        <div className='h-8 bg-gray-200 rounded w-1/4'></div>
        <div className='h-64 bg-gray-200 rounded'></div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className='p-6'>
        <div className='bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded'>
          Payment not found
        </div>
      </div>
    );
  }

  const handleRequestRefund = async () => {
    try {
      await requestRefund({
        paymentId: payment.id,
        reason: refundReason,
        amount: refundAmount ? parseFloat(refundAmount) : undefined,
      }).unwrap();
      setIsRefundModalOpen(false);
      setRefundReason('');
      setRefundAmount('');
    } catch (error) {
      console.error('Failed to request refund:', error);
    }
  };

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-semibold text-gray-900'>Payment Details</h1>
        {payment.status === 'completed' && (
          <button
            onClick={() => setIsRefundModalOpen(true)}
            className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
          >
            Request Refund
          </button>
        )}
      </div>

      <PaymentSummary payment={payment} />

      {/* Refund Modal */}
      {isRefundModalOpen && (
        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
            <div
              className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'
              onClick={() => setIsRefundModalOpen(false)}
            ></div>

            <div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'>
              <div>
                <h3 className='text-lg leading-6 font-medium text-gray-900'>Request Refund</h3>
                <div className='mt-4 space-y-4'>
                  <div>
                    <label
                      htmlFor='refundAmount'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Refund Amount (Optional)
                    </label>
                    <input
                      type='number'
                      id='refundAmount'
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      max={payment.amount}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500'
                      placeholder='Leave empty for full refund'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='refundReason'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Reason for Refund
                    </label>
                    <textarea
                      id='refundReason'
                      rows={3}
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500'
                      placeholder='Please provide a reason for the refund'
                    />
                  </div>
                </div>
              </div>
              <div className='mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense'>
                <button
                  type='button'
                  onClick={handleRequestRefund}
                  disabled={!refundReason}
                  className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Submit Request
                </button>
                <button
                  type='button'
                  onClick={() => setIsRefundModalOpen(false)}
                  className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1'
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
