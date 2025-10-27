import express from 'express';
import { USER_ROLES } from '../../../enums/users';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { EBookAccessControllers } from './ebookAccess.controllers';
import { EBookAccessValidations } from './ebookAccess.validations';

const router = express.Router();

router
  .route('/grant-access')
  .post(
    auth(USER_ROLES.ADMIN),
    validateRequest(EBookAccessValidations.grantEBookAccessZodSchema),
    EBookAccessControllers.grantEBookAccess,
  );

router
  .route('/my-ebooks')
  .get(auth(USER_ROLES.CUSTOMER), EBookAccessControllers.getMyEBooks);

router
  .route('/:accessToken')
  .get(auth(USER_ROLES.CUSTOMER), EBookAccessControllers.getEBook)
  .delete(auth(USER_ROLES.ADMIN), EBookAccessControllers.revokeEBookAccess);

export const EBookAccessRoutes = router;
