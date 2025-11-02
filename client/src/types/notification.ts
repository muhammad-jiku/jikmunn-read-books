import type { NotificationData } from './notificationData';

export type NotificationType =
  | 'order'
  | 'payment'
  | 'promotion'
  | 'system'
  | 'support'
  | 'book'
  | 'review'
  | 'auth';
export type NotificationChannel = 'email' | 'sms' | 'push';

export interface Notification {
  _id: string;
  user: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationData;
  isRead: boolean;
  sentVia: NotificationChannel[];
  emailSent?: boolean;
  smsSent?: boolean;
  pushSent?: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  email: {
    orders: boolean;
    payments: boolean;
    promotions: boolean;
    system: boolean;
    support: boolean;
  };
  sms: {
    orders: boolean;
    payments: boolean;
    promotions: boolean;
    system: boolean;
    support: boolean;
  };
  push: {
    orders: boolean;
    payments: boolean;
    promotions: boolean;
    system: boolean;
    support: boolean;
  };
}

export interface NotificationFilters {
  searchTerm?: string;
  isRead?: boolean;
  type?: NotificationType;
}
