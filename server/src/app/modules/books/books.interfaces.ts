import { Model, Schema } from 'mongoose';
import { IAuthor } from '../authors/authors.interfaces';

export interface IBook {
  title: string;
  subtitle?: string;
  author: Schema.Types.ObjectId | IAuthor;
  publicationDate: string;
  publisher: string;
  pages: number;
  genre: string;
  price: number;
  description: string;
  website?: string;
  reviews: string[];
  image?: string;
}

export type IBookModel = Model<IBook, Record<string, unknown>>;

export interface IBookFilters {
  searchTerm?: string;
  id?: string;
  title?: string;
  author?: string;
  publisher?: string;
  genre?: string;
}
