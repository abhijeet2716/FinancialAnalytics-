import { Router } from 'express';
import {
  getSummary,
  getTrends,
  getCategories,
} from '../controllers/dashboardController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Apply JWT authentication to all dashboard endpoints
router.use(authMiddleware);

// GET /api/dashboard/summary
router.get('/summary', getSummary);

// GET /api/dashboard/trends
router.get('/trends', getTrends);

// GET /api/dashboard/categories
router.get('/categories', getCategories);

export default router;
