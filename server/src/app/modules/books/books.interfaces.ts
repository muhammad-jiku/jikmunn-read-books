import { Model, Types } from 'mongoose';

export type IBook = {
  title: string;
  subtitle?: string;
  author: Types.ObjectId;
  publicationDate: string;
  publisher: string;
  pages: number;
  genre: string;
  price: number;
  description: string;
  website?: string;
  reviews: string[];
  image?: string;
  // New fields for e-commerce
  isbn?: string;
  stock: number;
  isAvailable: boolean;
  ebookUrl?: string;
  categories: string[];
  tags?: string[];
  averageRating: number;
  totalReviews: number;
  discount?: number;
  originalPrice?: number;
  isFeatured: boolean;
  language: string;
  edition?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
};

export type IBookModel = Model<IBook, Record<string, unknown>>;

export type IBookFilters = {
  searchTerm?: string;
  title?: string;
  author?: string;
  genre?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
  language?: string;
};
