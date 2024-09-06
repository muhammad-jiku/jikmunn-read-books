import { z } from 'zod';

// Zod validation schema for CustomersWishlists
const createCustomerBookWishlistSchema = z.object({
  customer: z.string({
    required_error: 'Customer id is required',
  }), // Must be a non-empty string (customer ID)
  books: z.array(
    z.object({
      book: z.string({
        required_error: 'Book id is required',
      }), // Must be a non-empty string (book ID)
      addedAt: z.date().optional(), // Optional date for when the book was added
    }),
  ),
});

export const CustomerBookWishlistValidations = {
  createCustomerBookWishlistSchema,
};
