import express from 'express';
import { USER_ROLES } from '../../../enums/users';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { AuthControllers } from './auth.controllers';
import { AuthValidations } from './auth.validations';

const router = express.Router();

router
  .route('/login')
  .post(
    validateRequest(AuthValidations.loginUserZodSchema),
    AuthControllers.loginUser,
  );

router
  .route('/refresh-token')
  .post(
    validateRequest(AuthValidations.refreshTokenHandlerZodSchema),
    AuthControllers.refreshTokenHandler,
  );

router
  .route('/change-password')
  .post(
    auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR, USER_ROLES.CUSTOMER),
    validateRequest(AuthValidations.changePasswordZodSchema),
    AuthControllers.changePassword,
  );

export const AuthRoutes = router;
