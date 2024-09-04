import express from 'express';
import { USER_ROLES } from '../../../enums/users';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { AuthorControllers } from './authors.controllers';
import { AuthorValidations } from './authors.validations';

const router = express.Router();

router
  .route('/:id')
  .get(auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR), AuthorControllers.getAuthor)
  .patch(
    validateRequest(AuthorValidations.updateAuthorZodSchema),
    auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR),
    AuthorControllers.updateAuthor,
  )
  .delete(auth(USER_ROLES.ADMIN), AuthorControllers.deleteAuthor);

router.route('/').get(auth(USER_ROLES.ADMIN), AuthorControllers.getAllAuthors);

export const AuthorRoutes = router;
