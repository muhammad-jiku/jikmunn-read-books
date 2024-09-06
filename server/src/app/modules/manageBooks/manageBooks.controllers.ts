import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { IManageBook } from './manageBooks.interfaces';
import { ManageBookServices } from './manageBooks.services';

const getAllManageBooks = catchAsync(async (req: Request, res: Response) => {
  const result = await ManageBookServices.getAllManageBooks();

  sendResponse<IManageBook[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All books data retrieved successfully!',
    data: result,
  });
});

const getAllManageBooksByAuthor = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;

    const result = await ManageBookServices.getAllManageBooksByAuthor(user);

    sendResponse<IManageBook[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All books data retrieved successfully!',
      data: result,
    });
  },
);

const deleteManageBook = catchAsync(async (req: Request, res: Response) => {
  const { id } = await req.body;

  const result = await ManageBookServices.deleteManageBook(id);

  sendResponse<IManageBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Data deleted successfully!',
    data: result,
  });
});

export const ManageBookControllers = {
  getAllManageBooks,
  getAllManageBooksByAuthor,
  deleteManageBook,
};
