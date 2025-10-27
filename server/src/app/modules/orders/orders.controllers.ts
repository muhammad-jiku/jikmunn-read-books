import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import { catchAsync } from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import { sendResponse } from '../../../shared/sendResponse';
import { orderFilterableFields } from './orders.constants';
import { IOrder } from './orders.interfaces';
import { OrderServices } from './orders.services';

const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ...orderData } = await req.body;
      const user = req.user;

      // Add user to order data
      orderData.user = user?.userId;

      const result = await OrderServices.createOrder(orderData);

      sendResponse<IOrder>(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Order created successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getAllOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = pick(req.query, orderFilterableFields);
      const paginationOptions = pick(req.query, paginationFields);

      const result = await OrderServices.getAllOrders(
        filters,
        paginationOptions,
      );

      sendResponse<IOrder[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All orders retrieved successfully!',
        meta: result.meta,
        data: result.data,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await OrderServices.getOrder(id);

      sendResponse<IOrder>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Order retrieved successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getMyOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const result = await OrderServices.getUserOrders(user!.userId);

      sendResponse<IOrder[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User orders retrieved successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const updateOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updatedData = await req.body;

      const result = await OrderServices.updateOrder(id, updatedData);

      sendResponse<IOrder>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Order updated successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const deleteOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await OrderServices.deleteOrder(id);

      sendResponse<IOrder>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Order deleted successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

export const OrderControllers = {
  createOrder,
  getAllOrders,
  getOrder,
  getMyOrders,
  updateOrder,
  deleteOrder,
};
