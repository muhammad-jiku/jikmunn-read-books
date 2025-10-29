import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import { catchAsync } from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import { sendResponse } from '../../../shared/sendResponse';
import { notificationFilterableFields } from './notifications.constants';
import { INotification } from './notifications.interfaces';
import { NotificationServices } from './notifications.services';

const createNotification = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ...notificationData } = await req.body;
      const result =
        await NotificationServices.createNotification(notificationData);

      sendResponse<INotification>(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Notification created successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const sendBulkNotifications = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { users, ...notificationData } = await req.body;
      await NotificationServices.sendBulkNotifications(users, notificationData);

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Bulk notifications sent successfully!',
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getUserNotifications = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const filters = pick(req.query, notificationFilterableFields);
      const paginationOptions = pick(req.query, paginationFields);

      const result = await NotificationServices.getUserNotifications(
        user!.userId,
        paginationOptions,
        filters,
      );

      sendResponse<INotification[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User notifications retrieved successfully!',
        meta: result.meta,
        data: result.data,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getUnreadNotifications = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const result = await NotificationServices.getUnreadNotifications(
        user!.userId,
      );

      sendResponse<INotification[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Unread notifications retrieved successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const markAsRead = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = req.user;

      const result = await NotificationServices.markAsRead(id, user!.userId);

      sendResponse<INotification>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Notification marked as read!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const markAllAsRead = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      await NotificationServices.markAllAsRead(user!.userId);

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All notifications marked as read!',
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  },
);

const getNotificationStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const result = await NotificationServices.getNotificationStats(
        user!.userId,
      );

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Notification stats retrieved successfully!',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
);

export const NotificationControllers = {
  createNotification,
  sendBulkNotifications,
  getUserNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  getNotificationStats,
};
