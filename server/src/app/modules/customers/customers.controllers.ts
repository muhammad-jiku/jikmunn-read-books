import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import { catchAsync } from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import { sendResponse } from '../../../shared/sendResponse';
import { customerFilterableFields } from './customers.constants';
import { ICustomer } from './customers.interfaces';
import { CustomerServices } from './customers.services';

const getAllCustomers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = pick(req.query, customerFilterableFields);

      const filterFields = ['contactNo'];
      filterFields.forEach(field => {
        if (filters[field]) {
          filters[field] = (filters[field] as string).replace(/ /g, '+');
        }
      });
      const paginationOptions = pick(req.query, paginationFields);

      const result = await CustomerServices.getAllCustomers(
        filters,
        paginationOptions,
      );

      sendResponse<ICustomer[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All customers data retrieved successfully!',
        meta: result.meta,
        data: result.data,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getCustomer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await CustomerServices.getCustomer(id);

      sendResponse<ICustomer>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Customer data retrieved successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const updateCustomer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updatedCustomer = await req.body;

      const result = await CustomerServices.updateCustomer(id, updatedCustomer);

      sendResponse<ICustomer>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Customer data updated successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const deleteCustomer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await CustomerServices.deleteCustomer(id);

      sendResponse<ICustomer>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Customer data deleted successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

export const CustomerControllers = {
  getAllCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
};
