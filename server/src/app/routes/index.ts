import express from 'express';
import { AdminRoutes } from '../modules/admins/admins.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { AuthorRoutes } from '../modules/authors/authors.routes';
import { BookRoutes } from '../modules/books/books.routes';
import { CustomerBookListRoutes } from '../modules/customerBookLists/customerBookLists.routes';
import { CustomerBookWishlistRoutes } from '../modules/customerBookWishlists/customerBookWishlists.routes';
import { CustomerRoutes } from '../modules/customers/customers.routes';
import { ManageBookRoutes } from '../modules/manageBooks/manageBooks.routes';
import { UserRoutes } from '../modules/users/users.routes';

const routes = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },
  {
    path: '/authors',
    route: AuthorRoutes,
  },
  {
    path: '/manage-books',
    route: ManageBookRoutes,
  },
  {
    path: '/customers',
    route: CustomerRoutes,
  },
  {
    path: '/customer-book-wishlists',
    route: CustomerBookWishlistRoutes,
  },
  {
    path: '/customer-book-lists',
    route: CustomerBookListRoutes,
  },
  {
    path: '/books',
    route: BookRoutes,
  },
];

moduleRoutes.forEach(route => routes.use(route.path, route.route));

export default routes;
