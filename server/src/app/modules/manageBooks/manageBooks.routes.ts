import express from 'express';
import { ManageBookControllers } from './manageBooks.controllers';

const router = express.Router();

router.route('/').get(ManageBookControllers.getAllManageBooks);

export const ManageBookRoutes = router;
