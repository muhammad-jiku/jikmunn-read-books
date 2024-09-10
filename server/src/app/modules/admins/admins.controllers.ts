import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import { catchAsync } from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import { sendResponse } from '../../../shared/sendResponse';
import { adminFilterableFields } from './admins.constants';
import { IAdmin } from './admins.interfaces';
import { AdminServices } from './admins.services';

const getAllAdmins = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = pick(req.query, adminFilterableFields);

      const filterFields = ['contactNo'];
      filterFields.forEach(field => {
        if (filters[field]) {
          filters[field] = (filters[field] as string).replace(/ /g, '+');
        }
      });

      const paginationOptions = pick(req.query, paginationFields);

      const result = await AdminServices.getAllAdmins(
        filters,
        paginationOptions,
      );

      sendResponse<IAdmin[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All admins data retrieved successfully!',
        meta: result.meta,
        data: result.data,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await AdminServices.getAdmin(id);

      sendResponse<IAdmin>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin data retrieved successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const updateAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updatedAdmin = await req.body;

      const result = await AdminServices.updateAdmin(id, updatedAdmin);

      sendResponse<IAdmin>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin data updated successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const deleteAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await AdminServices.deleteAdmin(id);

      sendResponse<IAdmin>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin data deleted successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

export const AdminControllers = {
  getAllAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
};
