import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { UserControllers } from './users.controllers';
import { UserValidations } from './users.validations';

const router = express.Router();

router
  .route('/create-student')
  .post(
    validateRequest(UserValidations.createCustomerZodSchema),
    UserControllers.createCustomer,
  );

router
  .route('/create-author')
  .post(
    validateRequest(UserValidations.createAuthorZodSchema),
    UserControllers.createAuthor,
  );

router
  .route('/create-admin')
  .post(
    validateRequest(UserValidations.createAdminZodSchema),
    UserControllers.createAdmin,
  );

export const UserRoutes = router;
