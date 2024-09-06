import { Model, Schema } from 'mongoose';
import { IBook } from '../books/books.interfaces';
import { ICustomer } from '../customers/customers.interfaces';

export interface ICustomerWishlists {
  customer: Schema.Types.ObjectId | ICustomer; // Reference to the Customer
  books: {
    book: Schema.Types.ObjectId | IBook; // Reference to the Book or the Book details
    addedAt?: Date; // Optional: Track when the book was added
  }[];
}

export type ICustomerWishlistsModel = Model<
  ICustomerWishlists,
  Record<string, unknown>
>;
