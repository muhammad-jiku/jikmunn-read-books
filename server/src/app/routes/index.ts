import express from 'express';
import { UserRoutes } from '../modules/users/users.routes';

const routes = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
];

moduleRoutes.forEach(route => routes.use(route.path, route.route));
export default routes;
