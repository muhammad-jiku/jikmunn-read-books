// Notification data types based on notification type
export interface OrderNotificationData {
  orderId: string;
  orderStatus: string;
  totalAmount: number;
}

export interface PaymentNotificationData {
  paymentId: string;
  amount: number;
  status: string;
}

export interface PromotionNotificationData {
  promotionId: string;
  discountPercent: number;
  validUntil: string;
}

export interface SystemNotificationData {
  actionRequired?: boolean;
  severity: 'info' | 'warning' | 'error';
  systemComponent?: string;
}

export interface SupportNotificationData {
  ticketId: string;
  status: string;
  agentName?: string;
}

export interface BookNotificationData {
  bookId: string;
  title: string;
  action: 'added' | 'removed' | 'updated';
}

export interface ReviewNotificationData {
  reviewId: string;
  bookId: string;
  rating: number;
  comment: string;
}

export interface AuthNotificationData {
  type: 'login' | 'logout' | 'password_change' | 'security_alert';
  message: string;
  timestamp: string;
}

export type NotificationData =
  | OrderNotificationData
  | PaymentNotificationData
  | PromotionNotificationData
  | SystemNotificationData
  | SupportNotificationData
  | BookNotificationData
  | ReviewNotificationData
  | AuthNotificationData;
