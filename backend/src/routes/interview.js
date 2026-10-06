import express from 'express';
import { startInterview, submitInterviewAnswer } from '../controllers/interviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.post('/start', startInterview);
router.post('/submit', submitInterviewAnswer);

export default router;
