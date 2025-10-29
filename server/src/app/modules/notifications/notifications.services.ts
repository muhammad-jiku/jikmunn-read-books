import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { User } from '../users/users.model';
import { notificationSearchableFields } from './notifications.constants';
import {
  INotification,
  INotificationFilters,
} from './notifications.interfaces';
import { Notification } from './notifications.model';

const createNotification = async (
  notificationData: INotification,
): Promise<INotification> => {
  const notification = await Notification.create(notificationData);

  // Here we would trigger the actual sending of the notification via the chosen channels
  // For now, we just create the notification in the database.

  return notification;
};

const sendBulkNotifications = async (
  users: string[],
  notificationData: Omit<INotification, 'user'>,
): Promise<void> => {
  const notifications = users.map(userId => ({
    ...notificationData,
    user: userId,
  }));

  await Notification.insertMany(notifications);
};

const getUserNotifications = async (
  userId: string,
  paginationOptions: IPaginationOptions,
  filters: INotificationFilters,
): Promise<IGenericResponse<INotification[]>> => {
  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Add user filter
  andConditions.push({ user: user._id });

  if (searchTerm) {
    andConditions.push({
      $or: notificationSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Notification.find(whereConditions)
    .populate('user')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Notification.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getUnreadNotifications = async (
  userId: string,
): Promise<INotification[]> => {
  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const notifications = await Notification.find({
    user: user._id,
    isRead: false,
  })
    .populate('user')
    .sort({ createdAt: -1 });

  return notifications;
};

const markAsRead = async (
  notificationId: string,
  userId: string,
): Promise<INotification | null> => {
  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: user._id },
    { isRead: true },
    { new: true },
  );

  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }

  return notification;
};

const markAllAsRead = async (userId: string): Promise<void> => {
  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  await Notification.updateMany(
    { user: user._id, isRead: false },
    { isRead: true },
  );
};

const getNotificationStats = async (
  userId: string,
): Promise<{ total: number; unread: number }> => {
  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const total = await Notification.countDocuments({ user: user._id });
  const unread = await Notification.countDocuments({
    user: user._id,
    isRead: false,
  });

  return { total, unread };
};

// Function to send actual email, SMS, push would be implemented here
// This would integrate with services like SendGrid, Twilio, Firebase Cloud Messaging, etc.

export const NotificationServices = {
  createNotification,
  sendBulkNotifications,
  getUserNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  getNotificationStats,
};
