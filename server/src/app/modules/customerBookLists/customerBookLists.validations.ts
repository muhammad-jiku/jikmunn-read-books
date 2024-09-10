import { z } from 'zod';
import { status } from './customerBookLists.constants';

// Zod validation schema for CustomersWishlists
const createCustomerBookListSchema = z.object({
  body: z.object({
    customer: z.string({
      required_error: 'Customer id is required',
    }), // Must be a non-empty string (customer ID)
    books: z.array(
      z.object({
        book: z.string({
          required_error: 'Book id is required',
        }), // Must be a non-empty string (book ID)
        status: z.enum([...status] as [string, ...string[]], {
          required_error: 'Status is required',
        }), // Must be one of the predefined statuses
        addedAt: z.date().optional(), // Optional date for when the book was added
      }),
    ),
  }),
});

export const CustomerBookListValidations = {
  createCustomerBookListSchema,
};
