import { Model, Schema } from 'mongoose';
import { IAuthor } from '../authors/authors.interfaces';
import { IBook } from '../books/books.interfaces';

export interface IManageBook {
  author: Schema.Types.ObjectId | IAuthor; // Reference to the Author
  books: {
    book: Schema.Types.ObjectId | IBook; // Reference to the Book or the Book details
    addedAt?: Date; // Optional: Track when the book was added
  }[];
}

export type IManageBookModel = Model<IManageBook, Record<string, unknown>>;
