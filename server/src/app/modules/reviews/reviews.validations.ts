import { z } from 'zod';

export const createReviewZodSchema = z.object({
  body: z.object({
    book: z.string(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(1, 'Comment is required'),
    isVerifiedPurchase: z.boolean().optional(),
  }),
});

export const updateReviewZodSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().min(1, 'Comment is required').optional(),
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
  }),
});

export const ReviewValidations = {
  createReviewZodSchema,
  updateReviewZodSchema,
};
