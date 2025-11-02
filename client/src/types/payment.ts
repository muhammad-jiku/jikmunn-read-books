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
  order: string;
  user: string;
  paymentGateway: string;
  paymentMethod: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentDate?: string;
  refundAmount?: number;
  refundDate?: string;
  refundReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentHistory {
  payments: Payment[];
  total: number;
}

export interface InitiatePaymentResponse {
  paymentUrl: string;
  transactionId: string;
}

export interface PaymentFilters {
  searchTerm?: string;
  order?: string;
  status?: PaymentStatus;
  paymentGateway?: string;
  transactionId?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaymentGatewayConfig {
  store_id: string;
  store_passwd: string;
  is_live: boolean;
}
