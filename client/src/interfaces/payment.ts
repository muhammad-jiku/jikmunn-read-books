export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  transactionId: string;
  refundAmount?: number;
  refundReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentFilters {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  startDate?: string;
  endDate?: string;
}

export interface PaymentHistory {
  payments: Payment[];
  total: number;
  totalAmount: number;
}

export interface InitiatePaymentResponse {
  paymentUrl: string;
  transactionId: string;
}
