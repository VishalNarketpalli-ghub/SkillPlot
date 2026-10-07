import { generateStructuredOutput } from '../providers/aiProvider.js';

/**
 * HYBRID ROADMAP GENERATION
 *
 * Step 1 (deterministic): The skill gap engine already ranked skill gaps.
 *         We take the top N gaps as the priority list.
 * Step 2 (AI): Gemini generates human-readable explanation text for each priority skill.
 *         It does NOT decide which skills to focus on — that is determined by the gap engine.
 * Step 3 (validation): We validate the AI output before returning it.
 *
 * RULE: Gemini generates explanation, NOT the priority order.
 * RULE: If Gemini fails, we fall back to a deterministic template explanation.
 */

const MAX_ROADMAP_ITEMS = 6;

const FALLBACK_EXPLANATION = (skill, gapLevel) =>
  `Focus on strengthening your ${skill} skills. ` +
  (gapLevel === 'high'
    ? 'This is a critical requirement for your target role. Prioritise this first.'
    : 'This will improve your overall competency profile for this role.');

/**
 * Generates a learning roadmap for the top skill gaps.
 *
 * @param {string} role - Target role display name
 * @param {Array}  gaps - Sorted skill gap array from skillGapService
 * @returns {Array} roadmap items: { skill, gapLevel, isRequired, explanation, resources }
 */
export const generateRoadmap = async (role, gaps) => {
  // Take top N gaps (prioritised by severity + importance from the skill gap engine)
  const topGaps = gaps.slice(0, MAX_ROADMAP_ITEMS);

  if (topGaps.length === 0) {
    return [];
  }

  // Build the prompt — we provide the priority order; Gemini only writes explanation text
  const prompt = `
You are a career coach. A candidate targeting the role of "${role}" has the following skill gaps (already prioritised from most critical to least critical by our assessment system):

${topGaps.map((g, i) =>
  `${i + 1}. Skill: "${g.skill}" | Gap Level: ${g.gapLevel} | Required: ${g.isRequired}`
).join('\n')}

For each skill gap listed above (in the SAME ORDER), provide:
- A concise explanation (2-3 sentences) of why this skill matters for a ${role}.
- 2-3 specific, actionable learning resources or steps (books, courses, practice sites, or project ideas).

IMPORTANT: Do not reorder the skills. Return exactly ${topGaps.length} items in the same order as provided.
`;

  const schema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        skill:       { type: 'string' },
        explanation: { type: 'string' },
        resources:   { type: 'array', items: { type: 'string' } },
      },
      required: ['skill', 'explanation', 'resources'],
    },
  };

  let aiResult = null;
  try {
    aiResult = await generateStructuredOutput(prompt, schema);
  } catch (err) {
    // AI call failed — fall through to deterministic fallback
    console.warn('[roadmapService] Gemini call failed, using fallback explanations:', err.message);
  }

  // Build the final roadmap by merging gap data (deterministic) with AI text (generative)
  return topGaps.map((gap, idx) => {
    // Try to find the matching AI result by index (AI was instructed to preserve order)
    const aiItem = Array.isArray(aiResult) ? aiResult[idx] : null;

    return {
      skill:       gap.skill,
      gapLevel:    gap.gapLevel,
      isRequired:  gap.isRequired,
      // Deterministic evidence (what triggered this recommendation)
      evidence: {
        currentConfidence: gap.currentConfidence,
        sources:           gap.evidence.map((e) => e.source),
        triggeredBy:       `Gap level: ${gap.gapLevel}, Role requirement: ${gap.isRequired}`,
      },
      // AI-generated explanation (or deterministic fallback)
      explanation: aiItem?.explanation ?? FALLBACK_EXPLANATION(gap.skill, gap.gapLevel),
      resources:   aiItem?.resources   ?? [`Search for "${gap.skill} tutorial" on freeCodeCamp, Coursera, or YouTube`],
    };
  });
};
