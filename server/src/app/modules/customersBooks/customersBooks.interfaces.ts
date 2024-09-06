import { Model, Schema } from 'mongoose';
import { IBook } from '../books/books.interfaces';
import { ICustomer } from '../customers/customers.interfaces';

// Define the types of statuses a book can have
type BookStatus = 'reading' | 'plan to read' | 'finished';

// Define the interface for CustomerBooks schema
export interface ICustomerBooks {
  customer: Schema.Types.ObjectId | ICustomer; // Reference to the customer
  books: {
    book: Schema.Types.ObjectId | IBook; // Reference to the book
    status: BookStatus; // Status of the book
    addedAt?: Date; // Optional: Track when the book was added
  }[];
}

export type ICustomerBooksModel = Model<
  ICustomerBooks,
  Record<string, unknown>
>;
