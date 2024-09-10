import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { IUser } from './users.interfaces';
import { UserServices } from './users.services';

const createCustomer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { customer, ...userData } = await req.body;

      const result = await UserServices.createCustomer(customer, userData);

      sendResponse<IUser>(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'User created successfully',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const createAuthor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { author, ...userData } = await req.body;

      const result = await UserServices.createAuthor(author, userData);

      sendResponse<IUser>(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'User created successfully',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const createAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { admin, ...userData } = await req.body;

      const result = await UserServices.createAdmin(admin, userData);

      sendResponse<IUser>(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'User created successfully',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

export const UserControllers = {
  createCustomer,
  createAuthor,
  createAdmin,
};
