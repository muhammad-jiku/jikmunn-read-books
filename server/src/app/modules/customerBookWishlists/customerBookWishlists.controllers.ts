import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { IBook } from '../books/books.interfaces';
import { ICustomerBookWishlist } from './customerBookWishlists.interfaces';
import { CustomerBookWishlistServices } from './customerBookWishlists.services';

const createCustomerBookWishlist = catchAsync(
  async (req: Request, res: Response) => {
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
      message: 'All books data added to wishlist successfully!',
      data: result,
    });
  },
);

const getAllCustomerBookWishlists = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await CustomerBookWishlistServices.getAllCustomerBookWishlists();

    sendResponse<ICustomerBookWishlist[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All books data retrieved successfully!',
      data: result,
    });
  },
);

const getAllCustomerBookWishlist = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;

    const result =
      await CustomerBookWishlistServices.getAllCustomerBookWishlist(user);

    sendResponse<ICustomerBookWishlist[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All books data retrieved successfully!',
      data: result,
    });
  },
);

const removeBookFromCustomerBookWishlist = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = await req.body;

    const result =
      await CustomerBookWishlistServices.removeBookFromCustomerBookWishlist(
        user,
        id,
      );

    sendResponse<IBook>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All books data retrieved successfully!',
      data: result,
    });
  },
);

const deleteBookFromCustomeBookWishList = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = await req.body;

    const result =
      await CustomerBookWishlistServices.deleteBookFromCustomeBookWishList(id);

    sendResponse<ICustomerBookWishlist>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All books data retrieved successfully!',
      data: result,
    });
  },
);

export const CustomerBookWishlistControllers = {
  createCustomerBookWishlist,
  getAllCustomerBookWishlists,
  getAllCustomerBookWishlist,
  removeBookFromCustomerBookWishlist,
  deleteBookFromCustomeBookWishList,
};
