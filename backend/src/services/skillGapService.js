import { getRoleConfig } from '../config/roleConfig.js';
import Resume from '../models/Resume.js';

/**
 * GAP LEVEL THRESHOLDS (deterministic — no AI):
 * high   = skill is required by role AND candidate confidence is 'low'
 * medium = skill is required AND confidence is 'medium', OR preferred AND confidence is 'low'
 * low    = skill is preferred AND confidence is 'medium'
 */
const classifyGap = (isRequired, confidenceLevel) => {
  if (isRequired && confidenceLevel === 'low')    return 'high';
  if (isRequired && confidenceLevel === 'medium') return 'medium';
  if (!isRequired && confidenceLevel === 'low')   return 'medium';
  if (!isRequired && confidenceLevel === 'medium') return 'low';
  return null; // 'high' confidence → no actionable gap
};

/**
 * Detects and ranks skill gaps by comparing:
 *   role requirements (from roleConfig)  vs  candidate competency (from ReadinessScore.competencyMap)
 *
 * Returns an array of gap objects sorted by severity (high → medium → low).
 *
 * RULE: Classification is 100% deterministic threshold logic.
 * RULE: Gemini is NOT called in this function.
 */
export const detectSkillGaps = async (userId, targetRole, competencyMap, resumeId) => {
  const roleConfig = getRoleConfig(targetRole);

  // Load resume skills to check raw presence
  let resumeSkills = [];
  if (resumeId) {
    const resume = await Resume.findById(resumeId);
    resumeSkills = (resume?.extractedSkills || []).map((s) => s.toLowerCase());
  }

  const gaps = [];

  const allRoleSkills = [
    ...roleConfig.requiredSkills.map((s) => ({ skill: s, isRequired: true })),
    ...roleConfig.preferredSkills.map((s) => ({ skill: s, isRequired: false })),
  ];

  for (const { skill, isRequired } of allRoleSkills) {
    const skillLower = skill.toLowerCase();

    // Find the competency entry from the computed map
    const competency = (competencyMap || []).find(
      (c) => c.skill.toLowerCase() === skillLower
    );

    const confidence = competency?.confidenceLevel ?? 'low';
    const gapLevel = classifyGap(isRequired, confidence);

    if (gapLevel) {
      // Calculate importance rank for sorting: required skills rank higher
      const importanceRank = isRequired ? 2 : 1;
      const severityRank = gapLevel === 'high' ? 3 : gapLevel === 'medium' ? 2 : 1;

      gaps.push({
        skill,
        isRequired,
        gapLevel,
        currentConfidence: confidence,
        // Evidence that triggered the gap classification (stored for explainability)
        evidence: competency?.evidence ?? [],
        // Ranking value for sorting
        _rank: importanceRank * 10 + severityRank,
      });
    }
  }

  // Sort: highest rank first (most severe + most important)
  gaps.sort((a, b) => b._rank - a._rank);

  // Strip internal rank field before returning
  return gaps.map(({ _rank, ...gap }) => gap);
};
