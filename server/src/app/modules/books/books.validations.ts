import { z } from 'zod';

const createBookZodSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: 'Book id must be provided',
    }),
    title: z.string({
      required_error: 'Book title must be provided',
    }),
    subtitle: z.string().optional(),
    author: z.string({
      required_error: 'Book author must be provided',
    }),
    publicationDate: z.date({
      required_error: 'Book publication date must be provided',
    }),
    publisher: z.string({
      required_error: 'Book publisher must be provided',
    }),
    pages: z.number({
      required_error: 'Book pages must be provided',
    }),
    genre: z.string({
      required_error: 'Book genre must be provided',
    }),
    price: z.number({
      required_error: 'Book price must be provided',
    }),
    description: z.string({
      required_error: 'Book description must be provided',
    }),
    website: z.string().optional(),
    reviews: z.array(z.string().optional()),
    image: z.string().optional(),
  }),
});

const updateBookZodSchema = z.object({
  body: z
    .object({
      id: z.string().optional(),
      title: z.string().optional(),
      subtitle: z.string().optional(),
      author: z.string().optional(),
      publicationDate: z.date().optional(),
      publisher: z.string().optional(),
      pages: z.number().optional(),
      genre: z.string().optional(),
      price: z.number().optional(),
      description: z.string().optional(),
      website: z.string().optional(),
      reviews: z.array(z.string().optional()),
      image: z.string().optional(),
    })
    .strict(),
});

export const BookValidations = {
  createBookZodSchema,
  updateBookZodSchema,
};
