import { z } from 'zod';

export const initPaymentZodSchema = z.object({
  body: z.object({
    orderId: z.string(),
  }),
});

export const refundPaymentZodSchema = z.object({
  body: z.object({
    refundAmount: z.number().positive('Refund amount must be positive'),
    refundReason: z.string().min(1, 'Refund reason is required'),
  }),
});

export const PaymentValidations = {
  initPaymentZodSchema,
  refundPaymentZodSchema,
};
