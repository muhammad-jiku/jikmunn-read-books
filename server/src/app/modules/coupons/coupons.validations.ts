import { z } from 'zod';

export const createCouponZodSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Code is required'),
    description: z.string().min(1, 'Description is required'),
    discountType: z.enum(['percentage', 'fixed']),
    discountValue: z.number().positive('Discount value must be positive'),
    minOrder: z.number().min(0, 'Minimum order must be non-negative'),
    maxDiscount: z.number().optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    usageLimit: z
      .number()
      .int()
      .positive('Usage limit must be a positive integer'),
    isActive: z.boolean().optional().default(true),
    applicableCategories: z.array(z.string()).optional(),
    excludedProducts: z.array(z.string()).optional(),
    userSpecific: z.array(z.string()).optional(),
    oneTimeUse: z.boolean().optional().default(false),
  }),
});

export const updateCouponZodSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Code is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    discountType: z.enum(['percentage', 'fixed']).optional(),
    discountValue: z
      .number()
      .positive('Discount value must be positive')
      .optional(),
    minOrder: z
      .number()
      .min(0, 'Minimum order must be non-negative')
      .optional(),
    maxDiscount: z.number().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    usageLimit: z
      .number()
      .int()
      .positive('Usage limit must be a positive integer')
      .optional(),
    isActive: z.boolean().optional(),
    applicableCategories: z.array(z.string()).optional(),
    excludedProducts: z.array(z.string()).optional(),
    userSpecific: z.array(z.string()).optional(),
    oneTimeUse: z.boolean().optional(),
  }),
});

export const validateCouponZodSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Code is required'),
    orderAmount: z.number().min(0, 'Order amount must be non-negative'),
  }),
});

export const applyCouponZodSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Code is required'),
    orderAmount: z.number().min(0, 'Order amount must be non-negative'),
  }),
});

export const CouponValidations = {
  createCouponZodSchema,
  updateCouponZodSchema,
  validateCouponZodSchema,
  applyCouponZodSchema,
};
