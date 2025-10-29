import express from 'express';
import { USER_ROLES } from '../../../enums/users';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { NotificationControllers } from './notifications.controllers';
import { NotificationValidations } from './notifications.validations';

const router = express.Router();

router
  .route('/create')
  .post(
    auth(USER_ROLES.ADMIN),
    validateRequest(NotificationValidations.createNotificationZodSchema),
    NotificationControllers.createNotification,
  );

router
  .route('/bulk')
  .post(
    auth(USER_ROLES.ADMIN),
    validateRequest(NotificationValidations.bulkNotificationZodSchema),
    NotificationControllers.sendBulkNotifications,
  );

router
  .route('/unread')
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR, USER_ROLES.CUSTOMER),
    NotificationControllers.getUnreadNotifications,
  );

router
  .route('/stats')
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR, USER_ROLES.CUSTOMER),
    NotificationControllers.getNotificationStats,
  );

router
  .route('/mark-all-read')
  .patch(
    auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR, USER_ROLES.CUSTOMER),
    NotificationControllers.markAllAsRead,
  );

router
  .route('/:id/mark-read')
  .patch(
    auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR, USER_ROLES.CUSTOMER),
    NotificationControllers.markAsRead,
  );

router
  .route('/')
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR, USER_ROLES.CUSTOMER),
    NotificationControllers.getUserNotifications,
  );

export const NotificationRoutes = router;
