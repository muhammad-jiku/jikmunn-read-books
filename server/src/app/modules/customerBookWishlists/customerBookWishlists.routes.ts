import express from 'express';
import { USER_ROLES } from '../../../enums/users';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { CustomerBookWishlistControllers } from './customerBookWishlists.controllers';
import { CustomerBookWishlistValidations } from './customerBookWishlists.validations';

const router = express.Router();

router
  .route('/create')
  .post(
    auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR),
    validateRequest(
      CustomerBookWishlistValidations.createCustomerBookWishlistSchema,
    ),
    CustomerBookWishlistControllers.createCustomerBookWishlist,
  );

router
  .route('/me')
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR),
    CustomerBookWishlistControllers.getAllCustomerBookWishlist,
  );

router
  .route('/me/remove')
  .post(
    auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR),
    CustomerBookWishlistControllers.removeBookFromCustomerBookWishlist,
  );

router
  .route('/')
  .get(
    auth(USER_ROLES.ADMIN),
    CustomerBookWishlistControllers.getAllCustomerBookWishlists,
  )
  .delete(
    auth(USER_ROLES.ADMIN),
    CustomerBookWishlistControllers.deleteBookFromCustomeBookWishList,
  );

export const CustomerBookWishlistRoutes = router;
