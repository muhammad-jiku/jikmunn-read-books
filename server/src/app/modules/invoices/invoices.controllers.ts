import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import { catchAsync } from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import { sendResponse } from '../../../shared/sendResponse';
import { invoiceFilterableFields } from './invoices.constants';
import { IInvoice } from './invoices.interfaces';
import { InvoiceServices } from './invoices.services';

const createInvoice = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.body;
      const result = await InvoiceServices.createInvoiceFromOrder(orderId);

      sendResponse<IInvoice>(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Invoice created successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const generateInvoicePDF = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const pdfBuffer = await InvoiceServices.generateInvoicePDF(id);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=invoice-${id}.pdf`,
        'Content-Length': pdfBuffer.length,
      });

      res.send(pdfBuffer);
    } catch (error) {
      return next(error);
    }
  },
);

const getAllInvoices = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = pick(req.query, invoiceFilterableFields);
      const paginationOptions = pick(req.query, paginationFields);

      const result = await InvoiceServices.getAllInvoices(
        filters,
        paginationOptions,
      );

      sendResponse<IInvoice[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All invoices retrieved successfully!',
        meta: result.meta,
        data: result.data,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getInvoice = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await InvoiceServices.getInvoice(id);

      sendResponse<IInvoice>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Invoice retrieved successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getMyInvoices = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const result = await InvoiceServices.getUserInvoices(user!.userId);

      sendResponse<IInvoice[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User invoices retrieved successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const downloadMyInvoice = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = req.user;

      // Verify the invoice belongs to the user
      const userInvoices = await InvoiceServices.getUserInvoices(user!.userId);
      const userInvoiceIds = userInvoices.map(inv => inv._id!.toString());

      if (!userInvoiceIds.includes(id)) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          'Access denied to this invoice',
        );
      }

      const pdfBuffer = await InvoiceServices.generateInvoicePDF(id);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename=invoice-${id}.pdf`,
        'Content-Length': pdfBuffer.length,
      });

      res.send(pdfBuffer);
    } catch (error) {
      return next(error);
    }
  },
);

const updateInvoiceStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { paymentStatus } = req.body;

      const result = await InvoiceServices.updateInvoicePaymentStatus(
        id,
        paymentStatus,
      );

      sendResponse<IInvoice>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Invoice status updated successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const deleteInvoice = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await InvoiceServices.deleteInvoice(id);

      sendResponse<IInvoice>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Invoice deleted successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

export const InvoiceControllers = {
  createInvoice,
  generateInvoicePDF,
  getAllInvoices,
  getInvoice,
  getMyInvoices,
  downloadMyInvoice,
  updateInvoiceStatus,
  deleteInvoice,
};
