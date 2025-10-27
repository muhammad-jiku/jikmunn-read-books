import { z } from 'zod';

const orderItemSchema = z.object({
  book: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  ebookAccess: z.boolean().optional(),
});

const shippingAddressSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().min(1, 'Phone is required'),
});

export const createOrderZodSchema = z.object({
  body: z.object({
    items: z.array(orderItemSchema).min(1, 'At least one item is required'),
    totalAmount: z.number().positive('Total amount must be positive'),
    vat: z.number().min(0).default(0),
    surcharge: z.number().min(0).default(0),
    shippingAddress: shippingAddressSchema,
    paymentMethod: z.enum(['card', 'bkash', 'nagad', 'rocket', 'bank', 'cod']),
    paymentGateway: z
      .enum(['sslcommerz', 'stripe', 'paypal', 'bkash', 'manual'])
      .default('sslcommerz'),
    orderNotes: z.string().optional(),
  }),
});

export const updateOrderZodSchema = z.object({
  body: z.object({
    paymentStatus: z
      .enum([
        'pending',
        'processing',
        'completed',
        'failed',
        'cancelled',
        'refunded',
      ])
      .optional(),
    deliveryStatus: z
      .enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
      .optional(),
    cancellationReason: z.string().optional(),
    estimatedDelivery: z.string().optional(),
  }),
});

export const OrderValidations = {
  createOrderZodSchema,
  updateOrderZodSchema,
};
