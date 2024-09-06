import express from 'express';
import { USER_ROLES } from '../../../enums/users';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { CustomerBookListControllers } from './customerBookLists.controllers';
import { CustomerBookListValidations } from './customerBookLists.validations';

const router = express.Router();

router
  .route('/update')
  .post(
    auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR),
    validateRequest(CustomerBookListValidations.updateCustomerBookListSchema),
    CustomerBookListControllers.updateCustomerBookListStatus,
  );

router
  .route('/me')
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR),
    CustomerBookListControllers.getAllCustomerBookListByStatus,
  );

router
  .route('/me/remove')
  .post(
    auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR),
    CustomerBookListControllers.removeCustomerBookFromList,
  );

router
  .route('/')
  .get(
    auth(USER_ROLES.ADMIN),
    CustomerBookListControllers.getAllCustomerBookLists,
  )
  .delete(
    auth(USER_ROLES.ADMIN),
    CustomerBookListControllers.deleteCustomerBookFromList,
  );

export const CustomerBookListRoutes = router;
