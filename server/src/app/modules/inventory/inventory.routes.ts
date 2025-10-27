import express from 'express';
import { USER_ROLES } from '../../../enums/users';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { InventoryControllers } from './inventory.controllers';
import { InventoryValidations } from './inventory.validations';

const router = express.Router();

router
  .route('/low-stock')
  .get(auth(USER_ROLES.ADMIN), InventoryControllers.getLowStockBooks);

router
  .route('/report')
  .get(auth(USER_ROLES.ADMIN), InventoryControllers.getInventoryReport);

router
  .route('/:bookId/update-stock')
  .patch(
    auth(USER_ROLES.ADMIN),
    validateRequest(InventoryValidations.updateStockZodSchema),
    InventoryControllers.updateStock,
  );

router
  .route('/:bookId/restock')
  .patch(
    auth(USER_ROLES.ADMIN),
    validateRequest(InventoryValidations.restockBookZodSchema),
    InventoryControllers.restockBook,
  );

export const InventoryRoutes = router;
