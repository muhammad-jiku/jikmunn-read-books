import express from 'express';
import { USER_ROLES } from '../../../enums/users';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { CustomerControllers } from './customers.controllers';
import { CustomerValidations } from './customers.validations';

const router = express.Router();

router
  .route('/:id')
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER),
    CustomerControllers.getCustomer,
  )
  .patch(
    validateRequest(CustomerValidations.updateCustomerZodSchema),
    auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER),
    CustomerControllers.updateCustomer,
  )
  .delete(auth(USER_ROLES.ADMIN), CustomerControllers.deleteCustomer);

router
  .route('/')
  .get(auth(USER_ROLES.ADMIN), CustomerControllers.getAllCustomers);

export const CustomerRoutes = router;
