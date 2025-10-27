import express from 'express';
import { USER_ROLES } from '../../../enums/users';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { PaymentControllers } from './payments.controllers';
import { PaymentValidations } from './payments.validations';

const router = express.Router();

router
  .route('/init')
  .post(
    auth(USER_ROLES.CUSTOMER),
    validateRequest(PaymentValidations.initPaymentZodSchema),
    PaymentControllers.initPayment,
  );

router.route('/success').post(PaymentControllers.paymentSuccess);

router.route('/fail').post(PaymentControllers.paymentFail);

router.route('/cancel').post(PaymentControllers.paymentCancel);

router.route('/ipn').post(PaymentControllers.paymentIPN);

router
  .route('/my-payments')
  .get(auth(USER_ROLES.CUSTOMER), PaymentControllers.getMyPayments);

router
  .route('/refund/:transactionId')
  .post(
    auth(USER_ROLES.ADMIN),
    validateRequest(PaymentValidations.refundPaymentZodSchema),
    PaymentControllers.refundPayment,
  );

router
  .route('/:transactionId')
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER),
    PaymentControllers.getPayment,
  );

router
  .route('/')
  .get(auth(USER_ROLES.ADMIN), PaymentControllers.getAllPayments);

export const PaymentRoutes = router;
