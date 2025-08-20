// server/src/routes/invoice.routes.ts
import { Router } from 'express';
import { getInvoices, createInvoice } from '../controllers/invoice.controller';

const router = Router();

router.get('/', getInvoices);
router.post('/', createInvoice);

export default router;