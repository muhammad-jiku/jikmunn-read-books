import { z } from 'zod';

export const updateStockZodSchema = z.object({
  body: z.object({
    stock: z.number().int().min(0),
  }),
});

export const restockBookZodSchema = z.object({
  body: z.object({
    quantity: z.number().int().positive(),
  }),
});

export const InventoryValidations = {
  updateStockZodSchema,
  restockBookZodSchema,
};
