import express from 'express';
import { getProblem, submitCode } from '../controllers/codingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/problem', getProblem);
router.post('/submit', submitCode);

export default router;
