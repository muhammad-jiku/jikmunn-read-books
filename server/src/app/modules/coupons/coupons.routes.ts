import express from 'express';
import { USER_ROLES } from '../../../enums/users';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { CouponControllers } from './coupons.controllers';
import { CouponValidations } from './coupons.validations';

const router = express.Router();

router
  .route('/create')
  .post(
    auth(USER_ROLES.ADMIN),
    validateRequest(CouponValidations.createCouponZodSchema),
    CouponControllers.createCoupon,
  );

router
  .route('/validate')
  .post(
    auth(USER_ROLES.CUSTOMER),
    validateRequest(CouponValidations.validateCouponZodSchema),
    CouponControllers.validateCoupon,
  );

router
  .route('/apply')
  .post(
    auth(USER_ROLES.CUSTOMER),
    validateRequest(CouponValidations.applyCouponZodSchema),
    CouponControllers.applyCoupon,
  );

router.route('/active').get(CouponControllers.getActiveCoupons);

router
  .route('/:id')
  .get(auth(USER_ROLES.ADMIN), CouponControllers.getCoupon)
  .patch(
    auth(USER_ROLES.ADMIN),
    validateRequest(CouponValidations.updateCouponZodSchema),
    CouponControllers.updateCoupon,
  )
  .delete(auth(USER_ROLES.ADMIN), CouponControllers.deleteCoupon);

router.route('/').get(auth(USER_ROLES.ADMIN), CouponControllers.getAllCoupons);

export const CouponRoutes = router;
