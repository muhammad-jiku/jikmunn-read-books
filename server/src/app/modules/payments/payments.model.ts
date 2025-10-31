import { model, Schema } from 'mongoose';
import { IPayment, IPaymentModel } from './payments.interfaces';

const paymentSchema = new Schema<IPayment, IPaymentModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paymentGateway: {
      type: String,
      required: true,
      enum: ['sslcommerz', 'stripe', 'paypal', 'bkash', 'manual'],
      default: 'sslcommerz',
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'BDT',
    },
    status: {
      type: String,
      required: true,
      enum: [
        'pending',
        'processing',
        'completed',
        'failed',
        'cancelled',
        'refunded',
      ],
      default: 'pending',
    },
    gatewayResponse: {
      type: Schema.Types.Mixed,
    },
    paymentDate: {
      type: Date,
    },
    refundAmount: {
      type: Number,
      min: 0,
    },
    refundDate: {
      type: Date,
    },
    refundReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// Indexes for better query performance
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

export const Payment = model<IPayment, IPaymentModel>('Payment', paymentSchema);
