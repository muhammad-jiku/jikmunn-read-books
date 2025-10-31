/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, Types } from 'mongoose';

export type IPayment = {
  id: string;
  order: Types.ObjectId;
  user: Types.ObjectId;
  paymentGateway: string;
  transactionId: string;
  amount: number;
  currency: string;
  status:
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'cancelled'
    | 'refunded';
  gatewayResponse?: any;
  paymentDate?: Date;
  refundAmount?: number;
  refundDate?: Date;
  refundReason?: string;
};

export type IPaymentModel = Model<IPayment, Record<string, unknown>>;

export type IPaymentFilters = {
  searchTerm?: string;
  order?: string;
  user?: string;
  status?: string;
  paymentGateway?: string;
  transactionId?: string;
  startDate?: string;
  endDate?: string;
};
