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
    auth(USER_ROLES.CUSTOMER),
    validateRequest(
      CustomerBookWishlistValidations.createCustomerBookWishlistSchema,
    ),
    CustomerBookWishlistControllers.createCustomerBookWishlist,
  );

router
  .route('/me')
  .get(
    auth(USER_ROLES.CUSTOMER),
    CustomerBookWishlistControllers.getCustomerAllBookWishlist,
  )
  .delete(
    auth(USER_ROLES.CUSTOMER),
    CustomerBookWishlistControllers.removeBookFromCustomerBookWishlist,
  );

router
  .route('/:id')
  .delete(
    auth(USER_ROLES.ADMIN),
    CustomerBookWishlistControllers.deleteBookFromCustomeBookWishList,
  );

router
  .route('/')
  .get(
    auth(USER_ROLES.ADMIN),
    CustomerBookWishlistControllers.getAllCustomerBookWishlists,
  );

export const CustomerBookWishlistRoutes = router;
