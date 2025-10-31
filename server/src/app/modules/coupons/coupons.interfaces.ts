import { Model, Types } from 'mongoose';

export type ICoupon = {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  startDate: Date;
  endDate: Date;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  applicableCategories?: Types.ObjectId[];
  excludedProducts?: Types.ObjectId[];
  userSpecific?: Types.ObjectId[];
  oneTimeUse: boolean;
  usedBy: Types.ObjectId[];
};

export type ICouponModel = Model<ICoupon, Record<string, unknown>>;

export type ICouponFilters = {
  searchTerm?: string;
  isActive?: boolean;
  discountType?: string;
};
