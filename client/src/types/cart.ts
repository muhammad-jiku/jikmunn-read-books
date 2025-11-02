import type { Book } from './book';

export interface CartItem {
  bookId: string;
  quantity: number;
  book: Book;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
}

export interface WishlistItem {
  bookId: string;
  addedAt: string;
  book: Book;
}

export interface Wishlist {
  items: WishlistItem[];
}
