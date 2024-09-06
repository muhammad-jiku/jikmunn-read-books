import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { IBook } from '../books/books.interfaces';
import { ICustomerBookList } from './customerBookLists.interfaces';
import { CustomerBookListServices } from './customerBookLists.services';

const updateCustomerBookListStatus = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const customersBooksWishlists = await req.body;

    const result = await CustomerBookListServices.updateCustomerBookListStatus(
      user,
      customersBooksWishlists,
    );

    sendResponse<ICustomerBookList>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'All books data added to wishlist successfully!',
      data: result,
    });
  },
);

const getAllCustomerBookLists = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CustomerBookListServices.getAllCustomerBookLists();

    sendResponse<ICustomerBookList[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All books data retrieved successfully!',
      data: result,
    });
  },
);

const getAllCustomerBookListByStatus = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;

    const result =
      await CustomerBookListServices.getAllCustomerBookListByStatus(user);

    sendResponse<ICustomerBookList[]>(res, {
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

    const result = await CustomerBookListServices.removeCustomerBookFromList(
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

const deleteCustomerBookFromList = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = await req.body;

    const result =
      await CustomerBookListServices.deleteCustomerBookFromList(id);

    sendResponse<ICustomerBookList>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book data list deleted successfully!',
      data: result,
    });
  },
);

export const CustomerBookListControllers = {
  updateCustomerBookListStatus,
  getAllCustomerBookLists,
  getAllCustomerBookListByStatus,
  removeCustomerBookFromList,
  deleteCustomerBookFromList,
};
