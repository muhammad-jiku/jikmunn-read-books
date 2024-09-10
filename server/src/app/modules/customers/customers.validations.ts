import { z } from 'zod';
import { gender } from './customers.constants';

const updateCustomerZodSchema = z.object({
  body: z
    .object({
      name: z
        .object({
          firstName: z.string().optional(),
          middleName: z.string().optional(),
          lastName: z.string().optional(),
        })
        .strict()
        .optional(),
      gender: z.enum([...gender] as [string, ...string[]]).optional(),
      dateOfBirth: z.string().optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      wishlist: z.string().optional(),
      books: z.string().optional(),
    })
    .strict(),
});

export const CustomerValidations = {
  updateCustomerZodSchema,
};
