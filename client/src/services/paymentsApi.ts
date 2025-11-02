import { api } from '@utils/api';
import type {
  InitiatePaymentResponse,
  Payment,
  PaymentFilters,
  PaymentHistory,
} from '../types/payment';

export const paymentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    initiatePayment: builder.mutation<InitiatePaymentResponse, { orderId: string; amount: number }>(
      {
        query: (data: { orderId: string; amount: number }) => ({
          url: 'payments/initiate',
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['Orders'],
      },
    ),

    getPaymentHistory: builder.query<PaymentHistory, PaymentFilters>({
      query: (filters: PaymentFilters) => ({
        url: 'payments/history',
        params: filters,
      }),
      providesTags: ['Orders'],
    }),

    getPaymentDetails: builder.query<Payment, string>({
      query: (id: string) => `payments/${id}`,
      providesTags: ['Orders'],
    }),

    requestRefund: builder.mutation<void, { paymentId: string; reason: string; amount?: number }>({
      query: ({ paymentId, ...data }: { paymentId: string; reason: string; amount?: number }) => ({
        url: `payments/${paymentId}/refund`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Orders'],
    }),

    verifyPayment: builder.mutation<Payment, { transactionId: string }>({
      query: (data: { transactionId: string }) => ({
        url: 'payments/verify',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

export const {
  useInitiatePaymentMutation,
  useVerifyPaymentMutation,
  useGetPaymentHistoryQuery,
  useGetPaymentDetailsQuery,
  useRequestRefundMutation,
} = paymentsApi;
