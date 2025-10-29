/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import { catchAsync } from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import { sendResponse } from '../../../shared/sendResponse';
import { couponFilterableFields } from './coupons.constants';
import { ICoupon } from './coupons.interfaces';
import { CouponServices } from './coupons.services';

const createCoupon = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ...couponData } = await req.body;
      const result = await CouponServices.createCoupon(couponData);

      sendResponse<ICoupon>(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Coupon created successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getAllCoupons = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = pick(req.query, couponFilterableFields);
      const paginationOptions = pick(req.query, paginationFields);

      const result = await CouponServices.getAllCoupons(
        filters,
        paginationOptions,
      );

      sendResponse<ICoupon[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All coupons retrieved successfully!',
        meta: result.meta,
        data: result.data,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getCoupon = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await CouponServices.getCoupon(id);

      sendResponse<ICoupon>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Coupon retrieved successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const updateCoupon = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updatedData = await req.body;

      const result = await CouponServices.updateCoupon(id, updatedData);

      sendResponse<ICoupon>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Coupon updated successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const deleteCoupon = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await CouponServices.deleteCoupon(id);

      sendResponse<ICoupon>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Coupon deleted successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const validateCoupon = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.body;
      const { order, user } = req.body; // We'll need to adjust this to get the current user and order

      // In a real scenario, we would get the order from the request body or based on the user's cart
      const result = await CouponServices.validateCoupon(code, order, user);

      sendResponse<any>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Coupon validated successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

export const CouponControllers = {
  createCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
};
