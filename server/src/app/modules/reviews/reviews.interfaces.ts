import { Model, Types } from 'mongoose';

export type IReview = {
  user: Types.ObjectId;
  book: Types.ObjectId;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  likes: number;
  dislikes: number;
  helpfulCount: number;
  status: 'pending' | 'approved' | 'rejected';
};

export type IReviewModel = Model<IReview, Record<string, unknown>>;

export type IReviewFilters = {
  searchTerm?: string;
  book?: string;
  user?: string;
  rating?: number;
  status?: string;
  isVerifiedPurchase?: boolean;
};
