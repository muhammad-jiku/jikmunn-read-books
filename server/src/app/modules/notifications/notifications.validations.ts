import { z } from 'zod';

export const createNotificationZodSchema = z.object({
  body: z.object({
    user: z.string(),
    type: z.enum(['order', 'payment', 'promotion', 'system', 'support']),
    title: z.string().min(1, 'Title is required'),
    message: z.string().min(1, 'Message is required'),
    data: z.any().optional(),
    sentVia: z.array(z.enum(['email', 'sms', 'push'])).optional(),
  }),
});

export const bulkNotificationZodSchema = z.object({
  body: z.object({
    users: z.array(z.string()),
    type: z.enum(['order', 'payment', 'promotion', 'system', 'support']),
    title: z.string().min(1, 'Title is required'),
    message: z.string().min(1, 'Message is required'),
    data: z.any().optional(),
    sentVia: z.array(z.enum(['email', 'sms', 'push'])).optional(),
  }),
});

export const NotificationValidations = {
  createNotificationZodSchema,
  bulkNotificationZodSchema,
};
