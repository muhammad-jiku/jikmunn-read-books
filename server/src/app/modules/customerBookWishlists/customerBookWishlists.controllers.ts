import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { IBook } from '../books/books.interfaces';
import { ICustomerBookWishlist } from './customerBookWishlists.interfaces';
import { CustomerBookWishlistServices } from './customerBookWishlists.services';

const createCustomerBookWishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const customersBooksWishlists = await req.body;

      const result =
        await CustomerBookWishlistServices.createCustomerBookWishlist(
          user,
          customersBooksWishlists,
        );

      sendResponse<ICustomerBookWishlist>(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Book data added to the wishlist successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getAllCustomerBookWishlists = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result =
        await CustomerBookWishlistServices.getAllCustomerBookWishlists();

      sendResponse<ICustomerBookWishlist[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All books data retrieved successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getCustomerAllBookWishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      const result =
        await CustomerBookWishlistServices.getCustomerAllBookWishlist(user);

      sendResponse<ICustomerBookWishlist[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All books data retrieved successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const removeBookFromCustomerBookWishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const { bookId } = await req.body;

      const result =
        await CustomerBookWishlistServices.removeBookFromCustomerBookWishlist(
          user,
          bookId,
        );

      sendResponse<IBook>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Book from wishlist removed successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const deleteBookFromCustomeBookWishList = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result =
        await CustomerBookWishlistServices.deleteBookFromCustomeBookWishList(
          id,
        );

      sendResponse<ICustomerBookWishlist>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All books data from wishlist removed successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

export const CustomerBookWishlistControllers = {
  createCustomerBookWishlist,
  getAllCustomerBookWishlists,
  getCustomerAllBookWishlist,
  removeBookFromCustomerBookWishlist,
  deleteBookFromCustomeBookWishList,
};
