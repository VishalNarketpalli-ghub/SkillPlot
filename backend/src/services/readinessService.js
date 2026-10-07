import Assessment from '../models/Assessment.js';
import Interview from '../models/Interview.js';
import Resume from '../models/Resume.js';
import ReadinessScore from '../models/ReadinessScore.js';
import { getRoleConfig } from '../config/roleConfig.js';

/**
 * Gathers raw stage scores for a user from the Assessment and Interview collections.
 * Returns a plain object with one key per stage.
 * RULE: No AI call here — pure database reads.
 */
const collectRawScores = async (userId) => {
  const assessments = await Assessment.find({ userId, status: 'COMPLETED' }).sort({ updatedAt: -1 });
  const interviews = await Interview.find({ userId, status: 'completed' }).sort({ updatedAt: -1 });

  // Take the most recent completed score per type (a user may retry)
  const raw = {
    vocabulary: null,
    grammar: null,
    technicalMCQ: null,
    coding: null,
    technicalInterview: null,
    hrInterview: null,
  };

  assessments.forEach((a) => {
    if (a.type === 'VOCABULARY'      && raw.vocabulary     === null) raw.vocabulary     = a.score ?? 0;
    if (a.type === 'GRAMMAR'         && raw.grammar        === null) raw.grammar        = a.score ?? 0;
    if (a.type === 'TECHNICAL_MCQ'   && raw.technicalMCQ   === null) raw.technicalMCQ   = a.score ?? 0;
    if (a.type === 'CODING'          && raw.coding         === null) raw.coding         = a.score ?? 0;
  });

  interviews.forEach((i) => {
    if (i.type === 'technical' && raw.technicalInterview === null) {
      // Interview overallScore is on a 0-10 scale — normalise to 0-100
      raw.technicalInterview = i.overallScore != null ? Math.round(i.overallScore * 10) : 0;
    }
    if (i.type === 'hr' && raw.hrInterview === null) {
      raw.hrInterview = i.overallScore != null ? Math.round(i.overallScore * 10) : 0;
    }
  });

  return raw;
};

/**
 * Computes competency evidence per skill from resume + assessment data.
 * Each skill entry includes all sources that contributed evidence.
 * RULE: Classification (high/medium/low) is deterministic threshold logic.
 */
const buildCompetencyMap = (resumeSkills, rawScores, roleConfig) => {
  const allSkills = [
    ...new Set([
      ...(roleConfig.requiredSkills || []),
      ...(roleConfig.preferredSkills || []),
    ]),
  ];

  return allSkills.map((skill) => {
    const evidence = [];
    const skillLower = skill.toLowerCase();

    // Resume evidence
    const onResume = (resumeSkills || []).some(
      (rs) => rs.toLowerCase().includes(skillLower) || skillLower.includes(rs.toLowerCase())
    );
    if (onResume) {
      evidence.push({ source: 'resume', score: 100, note: 'Listed on resume' });
    }

    // MCQ evidence (approximate — role MCQ covers all required skills)
    if (rawScores.technicalMCQ !== null) {
      evidence.push({ source: 'mcq', score: rawScores.technicalMCQ, note: 'Technical MCQ stage score' });
    }

    // Coding evidence
    if (rawScores.coding !== null) {
      evidence.push({ source: 'coding', score: rawScores.coding, note: 'Coding challenge stage score' });
    }

    // Interview evidence
    if (rawScores.technicalInterview !== null) {
      evidence.push({ source: 'interview', score: rawScores.technicalInterview, note: 'Technical interview stage score' });
    }

    // Deterministic confidence classification
    const avgScore =
      evidence.length > 0
        ? Math.round(evidence.reduce((sum, e) => sum + e.score, 0) / evidence.length)
        : 0;

    let confidenceLevel;
    if (avgScore >= 70) confidenceLevel = 'high';
    else if (avgScore >= 40) confidenceLevel = 'medium';
    else confidenceLevel = 'low';

    return { skill, evidence, confidenceLevel };
  });
};

/**
 * Main readiness score computation.
 *
 * Steps:
 * 1. Load role config (weights + required skills).
 * 2. Collect raw per-stage scores from DB.
 * 3. For each stage: compute weightedScore = rawScore * weight.
 * 4. Sum weighted scores → overallScore.
 * 5. Build competency map.
 * 6. Persist ReadinessScore document.
 * 7. Return result.
 *
 * RULE: Gemini is NOT called here. Score is 100% deterministic.
 */
export const computeReadinessScore = async (userId, targetRole, resumeId) => {
  const roleConfig = getRoleConfig(targetRole);
  const rawScores = await collectRawScores(userId);

  // Load resume skills for competency map
  let resumeSkills = [];
  if (resumeId) {
    const resume = await Resume.findById(resumeId);
    resumeSkills = resume?.extractedSkills || [];
  }

  // Build stage breakdown
  const stageBreakdown = Object.entries(roleConfig.weights).map(([stage, weight]) => {
    const rawScore = rawScores[stage] ?? 0;
    const weightedScore = Math.round(rawScore * weight * 100) / 100;
    return {
      stage,
      rawScore,
      weight,
      weightedScore,
      maxPossible: Math.round(weight * 100 * 100) / 100,
    };
  });

  // Overall score = sum of all weighted contributions
  const overallScore = Math.round(
    stageBreakdown.reduce((sum, s) => sum + s.weightedScore, 0)
  );

  const competencyMap = buildCompetencyMap(resumeSkills, rawScores, roleConfig);

  // Upsert: replace any previous ReadinessScore for this user
  const doc = await ReadinessScore.findOneAndUpdate(
    { userId },
    { userId, role: roleConfig.displayName, overallScore, stageBreakdown, competencyMap },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return doc;
};

/**
 * Returns the most recent persisted ReadinessScore for a user (if any).
 */
export const getPersistedReadinessScore = async (userId) => {
  return ReadinessScore.findOne({ userId }).sort({ updatedAt: -1 });
};
