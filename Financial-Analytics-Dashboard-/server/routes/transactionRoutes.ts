import { Router } from 'express';
import {
  listTransactions,
  getSingleTransaction,
  exportCsv,
} from '../controllers/transactionController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Apply JWT authentication to all transaction endpoints
router.use(authMiddleware);

// GET /api/transactions/export (Registered before /:id)
router.get('/export', exportCsv);

// GET /api/transactions
router.get('/', listTransactions);

// GET /api/transactions/:id
router.get('/:id', getSingleTransaction);

export default router;
