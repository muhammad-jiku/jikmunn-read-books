import express from 'express';
import { AdminRoutes } from '../modules/admins/admins.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { AuthorRoutes } from '../modules/authors/authors.routes';
import { BookRoutes } from '../modules/books/books.routes';
import { CustomerRoutes } from '../modules/customers/customers.routes';
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
    path: '/customers',
    route: CustomerRoutes,
  },
  {
    path: '/books',
    route: BookRoutes,
  },
];

moduleRoutes.forEach(route => routes.use(route.path, route.route));

export default routes;
