import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { IBook } from '../books/books.interfaces';
import { ICustomerBookList } from './customerBookLists.interfaces';
import { CustomerBookListServices } from './customerBookLists.services';

const createCustomerBookListStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const customersBooksWishlists = await req.body;

      const result =
        await CustomerBookListServices.createCustomerBookListStatus(
          user,
          customersBooksWishlists,
        );

      sendResponse<ICustomerBookList>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Book added to the list successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getAllCustomerBookLists = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await CustomerBookListServices.getAllCustomerBookLists();

      sendResponse<ICustomerBookList[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All books list data retrieved successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getCustomerAllBookList = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      const result =
        await CustomerBookListServices.getCustomerAllBookList(user);

      sendResponse<ICustomerBookList[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All books list data retrieved successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const removeCustomerBookFromList = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const { bookId } = await req.body;

      const result = await CustomerBookListServices.removeCustomerBookFromList(
        user,
        bookId,
      );

      sendResponse<IBook>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Book removed from the list successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const deleteCustomerBookFromList = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result =
        await CustomerBookListServices.deleteCustomerBookFromList(id);

      sendResponse<ICustomerBookList>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Book data list deleted successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

export const CustomerBookListControllers = {
  createCustomerBookListStatus,
  getAllCustomerBookLists,
  getCustomerAllBookList,
  removeCustomerBookFromList,
  deleteCustomerBookFromList,
};
