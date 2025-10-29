/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, Types } from 'mongoose';

export type INotification = {
  user: Types.ObjectId;
  type: 'order' | 'payment' | 'promotion' | 'system' | 'support';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  sentVia: ('email' | 'sms' | 'push')[];
  emailSent?: boolean;
  smsSent?: boolean;
  pushSent?: boolean;
};

export type INotificationModel = Model<INotification, Record<string, unknown>>;

export type INotificationFilters = {
  searchTerm?: string;
  isRead?: boolean;
  title?: string;
};
