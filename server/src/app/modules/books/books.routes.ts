import express from 'express';
import { USER_ROLES } from '../../../enums/users';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { BookControllers } from './books.controllers';
import { BookValidations } from './books.validations';

const router = express.Router();

router
  .route('/create')
  .post(
    validateRequest(BookValidations.createBookZodSchema),
    auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR),
    BookControllers.createBook,
  );

router
  .route('/:id')
  .get(BookControllers.getBook)
  .patch(
    validateRequest(BookValidations.updateBookZodSchema),
    auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR),
    BookControllers.updateBook,
  )
  .delete(
    auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR),
    BookControllers.deleteBook,
  );

router.route('/').get(BookControllers.getAllBooks);

export const BookRoutes = router;
