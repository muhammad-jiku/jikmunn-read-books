/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { couponSearchableFields } from './coupons.constants';
import { ICoupon, ICouponFilters } from './coupons.interfaces';
import { Coupon } from './coupons.model';

const createCoupon = async (couponData: ICoupon): Promise<ICoupon | null> => {
  // Check if coupon code already exists
  const existingCoupon = await Coupon.findOne({ code: couponData.code });
  if (existingCoupon) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Coupon code already exists');
  }

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
  const result = await Coupon.findById(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Coupon not found');
  }
  return result;
};

const updateCoupon = async (
  id: string,
  payload: Partial<ICoupon>,
): Promise<ICoupon | null> => {
  const result = await Coupon.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Coupon not found');
  }
  return result;
};

const deleteCoupon = async (id: string): Promise<ICoupon | null> => {
  const result = await Coupon.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Coupon not found');
  }
  return result;
};

const validateCoupon = async (
  code: string,
  userId: string,
  orderAmount: number,
): Promise<{ isValid: boolean; discount: number; message?: string }> => {
  const coupon = await Coupon.findOne({ code, isActive: true });

  if (!coupon) {
    return { isValid: false, discount: 0, message: 'Invalid coupon code' };
  }

  const now = new Date();
  if (now < coupon.startDate) {
    return { isValid: false, discount: 0, message: 'Coupon is not yet active' };
  }

  if (now > coupon.endDate) {
    return { isValid: false, discount: 0, message: 'Coupon has expired' };
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    return {
      isValid: false,
      discount: 0,
      message: 'Coupon usage limit reached',
    };
  }

  if (orderAmount < coupon.minOrder) {
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
    coupon.userSpecific &&
    coupon.userSpecific.length > 0 &&
    !coupon.userSpecific.includes(userId as any)
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
    discount = (orderAmount * coupon.discountValue) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  return {
    isValid: true,
    discount,
    message: 'Coupon applied successfully',
  };
};

const applyCoupon = async (
  code: string,
  userId: string,
  orderAmount: number,
): Promise<{ discount: number; finalAmount: number; coupon: ICoupon }> => {
  const validation = await validateCoupon(code, userId, orderAmount);

  if (!validation.isValid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      validation.message || 'Invalid coupon',
    );
  }

  const coupon = await Coupon.findOne({ code });
  if (!coupon) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Coupon not found');
  }

  // Update coupon usage
  coupon.usedCount += 1;
  if (coupon.oneTimeUse) {
    coupon.usedBy.push(userId as any);
  }
  await coupon.save();

  const finalAmount = orderAmount - validation.discount;

  return {
    discount: validation.discount,
    finalAmount: finalAmount > 0 ? finalAmount : 0,
    coupon,
  };
};

const getActiveCoupons = async (): Promise<ICoupon[]> => {
  const now = new Date();
  const coupons = await Coupon.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
    $expr: { $lt: ['$usedCount', '$usageLimit'] },
  } as any);

  return coupons;
};

export const CouponServices = {
  createCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  applyCoupon,
  getActiveCoupons,
};
