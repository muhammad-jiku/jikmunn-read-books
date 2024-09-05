import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { IManageBooks } from './manageBooks.interfaces';
import { ManageBookServices } from './manageBooks.services';

const getAllManageBooks = catchAsync(async (req: Request, res: Response) => {
  const result = await ManageBookServices.getAllManageBooks();

  sendResponse<IManageBooks[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All books data retrieved successfully!',
    data: result,
  });
});

export const ManageBookControllers = { getAllManageBooks };
