/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import { catchAsync } from '../../../shared/catchAsync';
import { errorlogger, logger } from '../../../shared/logger';
import { pick } from '../../../shared/pick';
import { sendResponse } from '../../../shared/sendResponse';
import { paymentFilterableFields } from './payments.constants';
import { IPayment } from './payments.interfaces';
import { PaymentServices } from './payments.services';

const initPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.body;
      const user = req.user;

      const result = await PaymentServices.initPayment(orderId, user!.userId);

      sendResponse<any>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment initiated successfully',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const paymentSuccess = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { transactionId } = req.query;

      // Update payment and order status
      await PaymentServices.handleIPN(
        transactionId as string,
        'completed',
        req.body,
      );

      // Redirect to frontend success page
      res.redirect(
        `${config.frontend_url}/payment/success?transactionId=${transactionId}`,
      );
    } catch (error) {
      errorlogger.error('Payment Success Error:', error);
      // Redirect to failure page even if there's an error
      res.redirect(`${config.frontend_url}/payment/error`);
      return next(error);
    }
  },
);

const paymentFail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { transactionId } = req.query;
      await PaymentServices.handleIPN(
        transactionId as string,
        'failed',
        req.body,
      );

      res.redirect(
        `${config.frontend_url}/payment/fail?transactionId=${transactionId}`,
      );
    } catch (error) {
      errorlogger.error('Payment Fail Error:', error);
      res.redirect(`${config.frontend_url}/payment/error`);
      return next(error);
    }
  },
);

const paymentCancel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { transactionId } = req.query;
      await PaymentServices.handleIPN(
        transactionId as string,
        'cancelled',
        req.body,
      );

      res.redirect(
        `${config.frontend_url}/payment/cancel?transactionId=${transactionId}`,
      );
    } catch (error) {
      errorlogger.error('Payment Cancel Error:', error);
      res.redirect(`${config.frontend_url}/payment/error`);
      return next(error);
    }
  },
);

const paymentIPN = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tran_id, status, val_id } = req.body;
      logger.info('valid id', val_id);

      // Validate the IPN request
      const isValid = await PaymentServices.validateSSLCommerzIPN();
      if (!isValid) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid IPN request');
      }

      // Update payment status based on IPN
      await PaymentServices.handleIPN(tran_id, status, req.body);

      sendResponse<any>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'IPN processed successfully',
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { transactionId } = req.params;
      const result = await PaymentServices.getPayment(transactionId);

      sendResponse<IPayment>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment retrieved successfully',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getAllPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = pick(req.query, paymentFilterableFields);
      const paginationOptions = pick(req.query, paginationFields);

      const result = await PaymentServices.getAllPayments(
        filters,
        paginationOptions,
      );

      sendResponse<IPayment[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payments retrieved successfully',
        meta: result.meta,
        data: result.data,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getMyPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const result = await PaymentServices.getUserPayments(user!.userId);

      sendResponse<IPayment[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User payments retrieved successfully',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const refundPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { transactionId } = req.params;
      const { refundAmount, refundReason } = req.body;

      const result = await PaymentServices.refundPayment(
        transactionId,
        refundAmount,
        refundReason,
      );

      sendResponse<IPayment>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment refunded successfully',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

export const PaymentControllers = {
  initPayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
  getPayment,
  getAllPayments,
  getMyPayments,
  refundPayment,
};
