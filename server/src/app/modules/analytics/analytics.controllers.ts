import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { AnalyticsServices } from './analytics.services';

const getSalesReport = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate, category, author } = req.query;

      const filters = {
        startDate: startDate as string,
        endDate: endDate as string,
        category: category as string,
        author: author as string,
      };

      const result = await AnalyticsServices.generateSalesReport(filters);

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Sales report generated successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getUserAnalytics = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;

      const filters = {
        startDate: startDate as string,
        endDate: endDate as string,
      };

      const result = await AnalyticsServices.generateUserAnalytics(filters);

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User analytics generated successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getPlatformAnalytics = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;

      const filters = {
        startDate: startDate as string,
        endDate: endDate as string,
      };

      const result = await AnalyticsServices.generatePlatformAnalytics(filters);

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Platform analytics generated successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getAuthorPerformance = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorId } = req.params;
      const { startDate, endDate } = req.query;

      const filters = {
        startDate: startDate as string,
        endDate: endDate as string,
      };

      const result = await AnalyticsServices.getAuthorPerformance(
        authorId,
        filters,
      );

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Author performance report generated successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

export const AnalyticsControllers = {
  getSalesReport,
  getUserAnalytics,
  getPlatformAnalytics,
  getAuthorPerformance,
};
