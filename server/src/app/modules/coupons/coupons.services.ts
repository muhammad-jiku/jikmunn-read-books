/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IOrder } from '../orders/orders.interfaces';
import { couponSearchableFields } from './coupons.constants';
import { ICoupon, ICouponFilters } from './coupons.interfaces';
import { Coupon } from './coupons.model';

const createCoupon = async (couponData: ICoupon): Promise<ICoupon> => {
  const coupon = await Coupon.create(couponData);
  return coupon;
};

const getAllCoupons = async (
  filters: ICouponFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<ICoupon[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: couponSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Coupon.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Coupon.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getCoupon = async (id: string): Promise<ICoupon | null> => {
  const coupon = await Coupon.findById(id);
  if (!coupon) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Coupon not found');
  }
  return coupon;
};

const updateCoupon = async (
  id: string,
  payload: Partial<ICoupon>,
): Promise<ICoupon | null> => {
  const coupon = await Coupon.findByIdAndUpdate(id, payload, { new: true });
  if (!coupon) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Coupon not found');
  }
  return coupon;
};

const deleteCoupon = async (id: string): Promise<ICoupon | null> => {
  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Coupon not found');
  }
  return coupon;
};

const validateCoupon = async (
  code: string,
  order: IOrder,
  userId: string,
): Promise<{ isValid: boolean; discount: number; message?: string }> => {
  const coupon = await Coupon.findOne({ code, isActive: true });

  if (!coupon) {
    return { isValid: false, discount: 0, message: 'Invalid coupon code' };
  }

  const now = new Date();
  if (now < coupon.startDate || now > coupon.endDate) {
    return {
      isValid: false,
      discount: 0,
      message: 'Coupon is expired or not yet active',
    };
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    return {
      isValid: false,
      discount: 0,
      message: 'Coupon usage limit reached',
    };
  }

  if (order.totalAmount < coupon.minOrder) {
    return {
      isValid: false,
      discount: 0,
      message: `Minimum order amount is ${coupon.minOrder}`,
    };
  }

  if (coupon.oneTimeUse && coupon.usedBy.includes(userId as any)) {
    return { isValid: false, discount: 0, message: 'Coupon already used' };
  }

  if (
    coupon.userSpecific!.length > 0 &&
    !coupon.userSpecific!.includes(userId as any)
  ) {
    return {
      isValid: false,
      discount: 0,
      message: 'Coupon not applicable for this user',
    };
  }

  // Calculate discount
  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (order.totalAmount * coupon.discountValue) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  return { isValid: true, discount, message: 'Coupon applied successfully' };
};

const applyCoupon = async (
  code: string,
  order: IOrder,
  userId: string,
): Promise<{ discount: number; finalAmount: number }> => {
  const validation = await validateCoupon(code, order, userId);

  if (!validation.isValid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      validation.message || 'Invalid coupon',
    );
  }

  // Update coupon usage
  await Coupon.findOneAndUpdate(
    { code },
    {
      $inc: { usedCount: 1 },
      $addToSet: { usedBy: userId },
    },
  );

  const finalAmount = order.totalAmount - validation.discount;

  return {
    discount: validation.discount,
    finalAmount: finalAmount > 0 ? finalAmount : 0,
  };
};

export const CouponServices = {
  createCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  applyCoupon,
};
