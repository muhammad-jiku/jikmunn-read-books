import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import { catchAsync } from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import { sendResponse } from '../../../shared/sendResponse';
import { authorFilterableFields } from './authors.constants';
import { IAuthor } from './authors.interfaces';
import { AuthorServices } from './authors.services';

const getAllAuthors = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, authorFilterableFields);

  const filterFields = ['contactNo'];
  filterFields.forEach(field => {
    if (filters[field]) {
      filters[field] = (filters[field] as string).replace(/ /g, '+');
    }
  });

  const paginationOptions = pick(req.query, paginationFields);

  const result = await AuthorServices.getAllAuthors(filters, paginationOptions);

  sendResponse<IAuthor[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All authors data retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

const getAuthor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AuthorServices.getAuthor(id);

  sendResponse<IAuthor>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Author data retrieved successfully!',
    data: result,
  });
});

const updateAuthor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedAuthor = await req.body;

  const result = await AuthorServices.updateAuthor(id, updatedAuthor);

  sendResponse<IAuthor>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Author data updated successfully!',
    data: result,
  });
});

const deleteAuthor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AuthorServices.deleteAuthor(id);

  sendResponse<IAuthor>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Author data deleted successfully!',
    data: result,
  });
});

export const AuthorControllers = {
  getAllAuthors,
  getAuthor,
  updateAuthor,
  deleteAuthor,
};
