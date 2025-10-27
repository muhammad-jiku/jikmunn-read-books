import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import { catchAsync } from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import { sendResponse } from '../../../shared/sendResponse';
import { reviewFilterableFields } from './reviews.constants';
import { IReview } from './reviews.interfaces';
import { ReviewServices } from './reviews.services';

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ...reviewData } = await req.body;
      const user = req.user;

      // Add user to review data
      reviewData.user = user?.userId;

      const result = await ReviewServices.createReview(reviewData);

      sendResponse<IReview>(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Review created successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getAllReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = pick(req.query, reviewFilterableFields);
      const paginationOptions = pick(req.query, paginationFields);

      const result = await ReviewServices.getAllReviews(
        filters,
        paginationOptions,
      );

      sendResponse<IReview[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All reviews retrieved successfully!',
        meta: result.meta,
        data: result.data,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await ReviewServices.getReview(id);

      sendResponse<IReview>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Review retrieved successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const updateReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updatedData = await req.body;

      const result = await ReviewServices.updateReview(id, updatedData);

      sendResponse<IReview>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Review updated successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const deleteReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await ReviewServices.deleteReview(id);

      sendResponse<IReview>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Review deleted successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getReviewsByBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bookId } = req.params;

      const result = await ReviewServices.getReviewsByBook(bookId);

      sendResponse<IReview[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Book reviews retrieved successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getMyReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const result = await ReviewServices.getMyReviews(user!.userId);

      sendResponse<IReview[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User reviews retrieved successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

export const ReviewControllers = {
  createReview,
  getAllReviews,
  getReview,
  updateReview,
  deleteReview,
  getReviewsByBook,
  getMyReviews,
};
