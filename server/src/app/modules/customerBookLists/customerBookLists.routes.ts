import express from 'express';
import { USER_ROLES } from '../../../enums/users';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { CustomerBookListControllers } from './customerBookLists.controllers';
import { CustomerBookListValidations } from './customerBookLists.validations';

const router = express.Router();

router
  .route('/create')
  .post(
    auth(USER_ROLES.CUSTOMER),
    validateRequest(CustomerBookListValidations.createCustomerBookListSchema),
    CustomerBookListControllers.createCustomerBookListStatus,
  );

router
  .route('/me')
  .get(
    auth(USER_ROLES.CUSTOMER),
    CustomerBookListControllers.getCustomerAllBookList,
  )
  .delete(
    auth(USER_ROLES.CUSTOMER),
    CustomerBookListControllers.removeCustomerBookFromList,
  );

router
  .route('/:id')
  .delete(
    auth(USER_ROLES.ADMIN),
    CustomerBookListControllers.deleteCustomerBookFromList,
  );

router
  .route('/')
  .get(
    auth(USER_ROLES.ADMIN),
    CustomerBookListControllers.getAllCustomerBookLists,
  );

export const CustomerBookListRoutes = router;
