import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { ICustomerBooks } from './customersBooks.interfaces';
import { CustomerBooksServices } from './customersBooks.services';

const updateCustomerBooksStatus = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const customersBooksWishlists = await req.body;

    const result = await CustomerBooksServices.updateCustomerBooksStatus(
      user,
      customersBooksWishlists,
    );

    sendResponse<ICustomerBooks>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'All books data added to wishlist successfully!',
      data: result,
    });
  },
);

const getAllCustomerBookLists = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CustomerBooksServices.getAllCustomerBookLists();

    sendResponse<ICustomerBooks[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All books data retrieved successfully!',
      data: result,
    });
  },
);

const getAllCustomerBooksByStatus = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;

    const result =
      await CustomerBooksServices.getAllCustomerBooksByStatus(user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All books data retrieved successfully!',
      data: result,
    });
  },
);

const removeCustomerBookFromList = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = await req.body;

    const result = await CustomerBooksServices.removeCustomerBookFromList(
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

export const CustomerBookListsControllers = {
  updateCustomerBooksStatus,
  getAllCustomerBookLists,
  getAllCustomerBooksByStatus,
  removeCustomerBookFromList,
};
