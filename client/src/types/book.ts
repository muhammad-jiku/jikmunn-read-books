// Author information in book context
interface BookAuthor {
  id: string;
  name: {
    firstName: string;
    middleName?: string;
    lastName: string;
  };
  profileImage?: string;
}

// Book category/genre
export interface BookCategory {
  id: string;
  name: string;
  description?: string;
  slug?: string;
  parentId?: string;
  subcategories?: BookCategory[];
}

// Book review summary
interface BookReviewSummary {
  averageRating: number;
  totalReviews: number;
}

// Book pricing and stock
interface BookInventory {
  price: number;
  discountPercentage?: number;
  stock: number;
  isbn: string;
}

// Book format types
export type BookFormat = 'hardcover' | 'paperback' | 'ebook' | 'audiobook';

// Main book interface
export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  author: BookAuthor;
  category: BookCategory;
  description: string;
  coverImage: string;
  format: BookFormat;
  language: string;
  pageCount: number;
  publishedDate: string;
  publisher: string;
  inventory: BookInventory;
  reviews: BookReviewSummary;
  featured?: boolean;
  bestSeller?: boolean;
  newRelease?: boolean;
}

// Book search/filter parameters
export interface BookFilters {
  search?: string;
  category?: string;
  author?: string;
  format?: BookFormat;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'title' | 'price' | 'rating' | 'publishedDate';
  sortOrder?: 'asc' | 'desc';
}

// Book list response with pagination
export interface BookListResponse {
  books: Book[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
