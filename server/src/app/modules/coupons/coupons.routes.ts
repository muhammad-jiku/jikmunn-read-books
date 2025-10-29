import express from 'express';
import { USER_ROLES } from '../../../enums/users';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { CouponControllers } from './coupons.controllers';
import { CouponValidations } from './coupons.validations';

const router = express.Router();

router
  .route('/')
  .post(
    auth(USER_ROLES.ADMIN),
    validateRequest(CouponValidations.createCouponZodSchema),
    CouponControllers.createCoupon,
  )
  .get(auth(USER_ROLES.ADMIN), CouponControllers.getAllCoupons);

router
  .route('/validate')
  .post(
    auth(USER_ROLES.CUSTOMER),
    validateRequest(CouponValidations.validateCouponZodSchema),
    CouponControllers.validateCoupon,
  );

router
  .route('/:id')
  .get(auth(USER_ROLES.ADMIN), CouponControllers.getCoupon)
  .patch(
    auth(USER_ROLES.ADMIN),
    validateRequest(CouponValidations.updateCouponZodSchema),
    CouponControllers.updateCoupon,
  )
  .delete(auth(USER_ROLES.ADMIN), CouponControllers.deleteCoupon);

export const CouponRoutes = router;
