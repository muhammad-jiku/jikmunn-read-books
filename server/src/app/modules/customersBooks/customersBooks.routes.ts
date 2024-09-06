import express from 'express';
import { USER_ROLES } from '../../../enums/users';
import { auth } from '../../middlewares/auth';
import { CustomerBookListsControllers } from './customersBooks.controllers';

const router = express.Router();

router
  .route('/update')
  .post(
    auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR),
    CustomerBookListsControllers.updateCustomerBooksStatus,
  );

router
  .route('/me')
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR),
    CustomerBookListsControllers.getAllCustomerBooksByStatus,
  );

router
  .route('/me/remove')
  .post(
    auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR),
    CustomerBookListsControllers.removeCustomerBookFromList,
  );

router
  .route('/')
  .get(
    auth(USER_ROLES.ADMIN),
    CustomerBookListsControllers.getAllCustomerBookLists,
  );

export const CustomerBookListsRoutes = router;
