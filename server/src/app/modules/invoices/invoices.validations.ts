import { z } from 'zod';

export const createInvoiceZodSchema = z.object({
  body: z.object({
    orderId: z.string(),
  }),
});

export const updateInvoiceStatusZodSchema = z.object({
  body: z.object({
    paymentStatus: z.enum(['pending', 'paid', 'overdue', 'cancelled']),
  }),
});

export const InvoiceValidations = {
  createInvoiceZodSchema,
  updateInvoiceStatusZodSchema,
};
