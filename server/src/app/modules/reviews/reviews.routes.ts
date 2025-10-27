import express from 'express';
import { USER_ROLES } from '../../../enums/users';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { ReviewControllers } from './reviews.controllers';
import { ReviewValidations } from './reviews.validations';

const router = express.Router();

router
  .route('/create')
  .post(
    auth(USER_ROLES.CUSTOMER),
    validateRequest(ReviewValidations.createReviewZodSchema),
    ReviewControllers.createReview,
  );

router
  .route('/my-reviews')
  .get(auth(USER_ROLES.CUSTOMER), ReviewControllers.getMyReviews);

router.route('/book/:bookId').get(ReviewControllers.getReviewsByBook);

router
  .route('/:id')
  .get(ReviewControllers.getReview)
  .patch(
    auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER),
    validateRequest(ReviewValidations.updateReviewZodSchema),
    ReviewControllers.updateReview,
  )
  .delete(
    auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER),
    ReviewControllers.deleteReview,
  );

router.route('/').get(auth(USER_ROLES.ADMIN), ReviewControllers.getAllReviews);

export const ReviewRoutes = router;
