/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { InventoryServices } from './inventory.services';

const getLowStockBooks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const threshold = req.query.threshold ? Number(req.query.threshold) : 10;
      const result = await InventoryServices.getLowStockBooks(threshold);

      sendResponse<any>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Low stock books retrieved successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const updateStock = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bookId } = req.params;
      const { stock } = req.body;

      const result = await InventoryServices.updateStock(bookId, stock);

      sendResponse<any>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Stock updated successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const restockBook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bookId } = req.params;
      const { quantity } = req.body;

      const result = await InventoryServices.restockBook(bookId, quantity);

      sendResponse<any>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Book restocked successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getInventoryReport = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await InventoryServices.getInventoryReport();

      sendResponse<any>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Inventory report generated successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

export const InventoryControllers = {
  getLowStockBooks,
  updateStock,
  restockBook,
  getInventoryReport,
};
