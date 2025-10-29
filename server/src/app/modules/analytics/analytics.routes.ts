import express from 'express';
import { USER_ROLES } from '../../../enums/users';
import { auth } from '../../middlewares/auth';
import { AnalyticsControllers } from './analytics.controllers';

const router = express.Router();

router
  .route('/sales')
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR),
    AnalyticsControllers.getSalesReport,
  );

router
  .route('/users')
  .get(auth(USER_ROLES.ADMIN), AnalyticsControllers.getUserAnalytics);

router
  .route('/platform')
  .get(auth(USER_ROLES.ADMIN), AnalyticsControllers.getPlatformAnalytics);

router
  .route('/author/:authorId')
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR),
    AnalyticsControllers.getAuthorPerformance,
  );

export const AnalyticsRoutes = router;
