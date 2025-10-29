import express from 'express';
import { USER_ROLES } from '../../../enums/users';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { InvoiceControllers } from './invoices.controllers';
import { InvoiceValidations } from './invoices.validations';

const router = express.Router();

router
  .route('/create')
  .post(
    auth(USER_ROLES.ADMIN),
    validateRequest(InvoiceValidations.createInvoiceZodSchema),
    InvoiceControllers.createInvoice,
  );

router
  .route('/my-invoices')
  .get(auth(USER_ROLES.CUSTOMER), InvoiceControllers.getMyInvoices);

router
  .route('/my-invoices/:id/download')
  .get(auth(USER_ROLES.CUSTOMER), InvoiceControllers.downloadMyInvoice);

router
  .route('/:id/generate-pdf')
  .get(auth(USER_ROLES.ADMIN), InvoiceControllers.generateInvoicePDF);

router
  .route('/:id/status')
  .patch(
    auth(USER_ROLES.ADMIN),
    validateRequest(InvoiceValidations.updateInvoiceStatusZodSchema),
    InvoiceControllers.updateInvoiceStatus,
  );

router
  .route('/:id')
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER),
    InvoiceControllers.getInvoice,
  )
  .delete(auth(USER_ROLES.ADMIN), InvoiceControllers.deleteInvoice);

router
  .route('/')
  .get(auth(USER_ROLES.ADMIN), InvoiceControllers.getAllInvoices);

export const InvoiceRoutes = router;
