import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { IEBookAccess } from './ebookAccess.interfaces';
import { EBookAccessServices } from './ebookAccess.services';

const grantEBookAccess = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.body;

      const result = await EBookAccessServices.grantEBookAccess(orderId);

      sendResponse<IEBookAccess[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'E-book access granted successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getEBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken } = req.params;

      const result = await EBookAccessServices.getEBookAccess(accessToken);

      sendResponse<IEBookAccess>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'E-book access retrieved successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getMyEBooks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const result = await EBookAccessServices.getUserEBooks(user!.userId);

      sendResponse<IEBookAccess[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User e-books retrieved successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const revokeEBookAccess = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken } = req.params;

      const result = await EBookAccessServices.revokeEBookAccess(accessToken);

      sendResponse<IEBookAccess>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'E-book access revoked successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

export const EBookAccessControllers = {
  grantEBookAccess,
  getEBook,
  getMyEBooks,
  revokeEBookAccess,
};
