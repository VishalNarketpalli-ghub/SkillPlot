import express from 'express';
import { getMatchScore, getWorkflow } from '../controllers/analysisController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/match', getMatchScore);
router.get('/workflow', getWorkflow);

export default router;
