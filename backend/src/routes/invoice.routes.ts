// server/src/routes/invoice.routes.ts
import { Router } from 'express';
import { getInvoices, createInvoice } from '../controllers/invoice.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, getInvoices);
router.post('/', requireAuth, createInvoice);

export default router;