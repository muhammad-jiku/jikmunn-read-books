import express from 'express';
import { USER_ROLES } from '../../../enums/users';
import { auth } from '../../middlewares/auth';
import { CustomersWishlistsControllers } from './customersWishlists.controllers';

const router = express.Router();

router
  .route('/create')
  .post(
    auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR),
    CustomersWishlistsControllers.createCustomersWishlist,
  );

router
  .route('/me')
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR),
    CustomersWishlistsControllers.getAllCustomersWishlist,
  );

router
  .route('/me/remove')
  .post(
    auth(USER_ROLES.ADMIN, USER_ROLES.AUTHOR),
    CustomersWishlistsControllers.removeBookFromWishlist,
  );

router
  .route('/')
  .get(
    auth(USER_ROLES.ADMIN),
    CustomersWishlistsControllers.getAllCustomersWishlists,
  );

export const CustomersWishlistsRoutes = router;
