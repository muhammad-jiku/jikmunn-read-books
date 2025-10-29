import { model, Schema } from 'mongoose';
import { INotification, INotificationModel } from './notifications.interfaces';

const notificationSchema = new Schema<INotification, INotificationModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['order', 'payment', 'promotion', 'system', 'support'],
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    sentVia: [
      {
        type: String,
        enum: ['email', 'sms', 'push'],
      },
    ],
    emailSent: {
      type: Boolean,
      default: false,
    },
    smsSent: {
      type: Boolean,
      default: false,
    },
    pushSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// Index for efficient querying
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

export const Notification = model<INotification, INotificationModel>(
  'Notification',
  notificationSchema,
);
