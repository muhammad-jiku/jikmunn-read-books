import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import { catchAsync } from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import { sendResponse } from '../../../shared/sendResponse';
import { bookFilterableFields } from './books.constants';
import { IBook } from './books.interfaces';
import { BookServices } from './books.services';

const createBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ...bookData } = await req.body;

      const result = await BookServices.createBook(bookData);

      sendResponse<IBook>(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Book created successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getAllBooks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = pick(req.query, bookFilterableFields);
      const paginationOptions = pick(req.query, paginationFields);

      const result = await BookServices.getAllBooks(filters, paginationOptions);

      sendResponse<IBook[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All books data retrieved successfully!',
        meta: result.meta,
        data: result.data,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await BookServices.getBook(id);

      sendResponse<IBook>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Book data retrieved successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const updateBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updatedBookData = await req.body;

      const result = await BookServices.updateBook(id, updatedBookData);

      sendResponse<IBook>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Book data updated successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const deleteBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await BookServices.deleteBook(id);

      sendResponse<IBook>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Book data deleted successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

export const BookControllers = {
  createBook,
  getAllBooks,
  getBook,
  updateBook,
  deleteBook,
};
