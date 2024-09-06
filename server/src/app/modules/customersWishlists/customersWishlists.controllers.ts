import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { ICustomerWishlists } from './customersWishlists.interfaces';
import { CustomersWishlistsServices } from './customersWishlists.services';

const createCustomersWishlist = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const customersBooksWishlists = await req.body;

    const result = await CustomersWishlistsServices.createCustomersWishlist(
      user,
      customersBooksWishlists,
    );

    sendResponse<ICustomerWishlists>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'All books data added to wishlist successfully!',
      data: result,
    });
  },
);
const getAllCustomersWishlists = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CustomersWishlistsServices.getAllCustomersWishlists();

    sendResponse<ICustomerWishlists[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All books data retrieved successfully!',
      data: result,
    });
  },
);

const getAllCustomersWishlist = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;

    const result =
      await CustomersWishlistsServices.getAllCustomersWishlist(user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All books data retrieved successfully!',
      data: result,
    });
  },
);

const removeBookFromWishlist = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = await req.body;

    const result = await CustomersWishlistsServices.removeBookFromWishlist(
      user,
      id,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All books data retrieved successfully!',
      data: result,
    });
  },
);

export const CustomersWishlistsControllers = {
  createCustomersWishlist,
  getAllCustomersWishlists,
  getAllCustomersWishlist,
  removeBookFromWishlist,
};
