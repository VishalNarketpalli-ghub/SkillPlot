import User from '../models/User.js';
import { computeReadinessScore, getPersistedReadinessScore } from '../services/readinessService.js';
import { detectSkillGaps } from '../services/skillGapService.js';
import { generateRoadmap } from '../services/roadmapService.js';

/**
 * GET /api/intelligence/readiness
 *
 * Computes (or returns cached) the deterministic readiness score for the authenticated user.
 * Includes stage breakdown and competency map.
 *
 * RULE: Score is deterministic — Gemini is not called here.
 */
export const getReadinessScore = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const result = await computeReadinessScore(
      req.user.id,
      user.targetRole || 'Software Engineer',
      user.resumeId
    );

    res.status(200).json({
      success: true,
      data: {
        role:            result.role,
        overallScore:    result.overallScore,
        stageBreakdown:  result.stageBreakdown,
        competencyMap:   result.competencyMap,
        computedAt:      result.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/intelligence/skill-gap
 *
 * Detects skill gaps by comparing the user's role requirements against their
 * competency profile (from the most recently computed ReadinessScore).
 *
 * RULE: Gap classification is deterministic threshold logic — no AI.
 */
export const getSkillGap = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Load the most recent computed readiness score (which contains the competency map)
    let readinessDoc = await getPersistedReadinessScore(req.user.id);

    // If none exists yet, compute it now
    if (!readinessDoc) {
      readinessDoc = await computeReadinessScore(
        req.user.id,
        user.targetRole || 'Software Engineer',
        user.resumeId
      );
    }

    const gaps = await detectSkillGaps(
      req.user.id,
      user.targetRole || 'Software Engineer',
      readinessDoc.competencyMap,
      user.resumeId
    );

    // Group by gap level for the frontend
    const grouped = {
      high:   gaps.filter((g) => g.gapLevel === 'high'),
      medium: gaps.filter((g) => g.gapLevel === 'medium'),
      low:    gaps.filter((g) => g.gapLevel === 'low'),
    };

    res.status(200).json({
      success: true,
      data: {
        role:   readinessDoc.role,
        gaps,
        grouped,
        totalGaps: gaps.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/intelligence/roadmap
 *
 * Generates a hybrid learning roadmap:
 * - Deterministic: skill gap engine decides the priority order
 * - AI (Gemini): generates explanation text and resource suggestions per skill
 *
 * If Gemini fails, deterministic fallback explanations are used.
 */
export const getRoadmap = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Ensure we have a readiness score computed
    let readinessDoc = await getPersistedReadinessScore(req.user.id);
    if (!readinessDoc) {
      readinessDoc = await computeReadinessScore(
        req.user.id,
        user.targetRole || 'Software Engineer',
        user.resumeId
      );
    }

    // Detect gaps (sorted by severity + importance)
    const gaps = await detectSkillGaps(
      req.user.id,
      user.targetRole || 'Software Engineer',
      readinessDoc.competencyMap,
      user.resumeId
    );

    // Generate roadmap (Gemini explains, not decides)
    const roadmap = await generateRoadmap(readinessDoc.role, gaps);

    res.status(200).json({
      success: true,
      data: {
        role:           readinessDoc.role,
        overallScore:   readinessDoc.overallScore,
        roadmap,
        generatedAt:    new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};
