import { z } from 'zod';

export const grantEBookAccessZodSchema = z.object({
  body: z.object({
    orderId: z.string(),
  }),
});

export const EBookAccessValidations = {
  grantEBookAccessZodSchema,
};
