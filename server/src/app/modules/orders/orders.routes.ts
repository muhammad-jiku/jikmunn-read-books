import express from 'express';
import { USER_ROLES } from '../../../enums/users';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { OrderControllers } from './orders.controllers';
import { OrderValidations } from './orders.validations';

const router = express.Router();

router
  .route('/create')
  .post(
    auth(USER_ROLES.CUSTOMER),
    validateRequest(OrderValidations.createOrderZodSchema),
    OrderControllers.createOrder,
  );

router
  .route('/my-orders')
  .get(auth(USER_ROLES.CUSTOMER), OrderControllers.getMyOrders);

router
  .route('/:id')
  .get(auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), OrderControllers.getOrder)
  .patch(
    auth(USER_ROLES.ADMIN),
    validateRequest(OrderValidations.updateOrderZodSchema),
    OrderControllers.updateOrder,
  )
  .delete(auth(USER_ROLES.ADMIN), OrderControllers.deleteOrder);

router.route('/').get(auth(USER_ROLES.ADMIN), OrderControllers.getAllOrders);

export const OrderRoutes = router;
