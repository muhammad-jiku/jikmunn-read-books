import { Model, Schema } from 'mongoose';
import { IBook } from '../books/books.interfaces';

export interface IManageBooks {
  author: Schema.Types.ObjectId; // Reference to the Author
  books: {
    book: Schema.Types.ObjectId | IBook; // Reference to the Book or the Book details
    addedAt?: Date; // Optional: Track when the book was added
  }[];
}

export type IManageBooksModel = Model<IManageBooks, Record<string, unknown>>;
