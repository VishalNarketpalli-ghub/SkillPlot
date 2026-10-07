import express from 'express';
import { getReadinessScore, getSkillGap, getRoadmap } from '../controllers/intelligenceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All Phase 3 intelligence routes require authentication
router.use(protect);

// GET /api/intelligence/readiness  — deterministic weighted readiness score + competency map
router.get('/readiness', getReadinessScore);

// GET /api/intelligence/skill-gap  — deterministic skill gap detection (high/medium/low)
router.get('/skill-gap', getSkillGap);

// GET /api/intelligence/roadmap    — hybrid: deterministic priorities + Gemini explanation text
router.get('/roadmap', getRoadmap);

export default router;
