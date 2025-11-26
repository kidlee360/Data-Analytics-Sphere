// server_src/routes/dataRoutes.ts
import express from 'express';
import { protect } from '../middleware/authMiddleware'; // Import your security guard!
import { getSummary, getKpi } from '../controllers/dataController';

const router = express.Router();

// ALL ROUTES HERE ARE PROTECTED
// GET /api/data/summary
router.get('/summary', protect, getSummary); 
// GET /api/data/kpi
router.get('/kpi', protect, getKpi);

export default router;