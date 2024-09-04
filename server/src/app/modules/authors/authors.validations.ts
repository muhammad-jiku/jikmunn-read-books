import { z } from 'zod';
import { gender } from './authors.constants';

const updateAuthorZodSchema = z.object({
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
      dateOfBirth: z.date().optional(),
      email: z.string().email().optional(),
      contactNo: z.string().optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      manageBooks: z.array(z.string()).optional(),
      profileImage: z.string().optional(),
    })
    .strict(),
});

export const AuthorValidations = {
  updateAuthorZodSchema,
};
