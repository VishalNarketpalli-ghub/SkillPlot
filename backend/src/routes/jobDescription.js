import express from 'express';
import { analyzeJD } from '../controllers/jobDescriptionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/analyze')
  .post(analyzeJD);

export default router;
