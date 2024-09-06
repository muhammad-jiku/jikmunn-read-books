import express from 'express';
import { USER_ROLES } from '../../../enums/users';
import { auth } from '../../middlewares/auth';
import { ManageBookControllers } from './manageBooks.controllers';

const router = express.Router();

router
  .route('/me')
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR),
    ManageBookControllers.getAllManageBooksByAuthor,
  );

router
  .route('/')
  .get(auth(USER_ROLES.ADMIN), ManageBookControllers.getAllManageBooks)
  .delete(auth(USER_ROLES.ADMIN), ManageBookControllers.deleteManageBook);

export const ManageBookRoutes = router;
