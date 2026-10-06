import express from 'express';
import { generateVocabulary, generateGrammar, submitAnswer, generateMCQ, generateNextMCQ, getResults } from '../controllers/assessmentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/vocabulary/generate', generateVocabulary);
router.post('/grammar/generate', generateGrammar);
router.post('/mcq/generate', generateMCQ);
router.post('/mcq/next', generateNextMCQ);
router.post('/submit', submitAnswer);
router.get('/results', getResults);

export default router;
