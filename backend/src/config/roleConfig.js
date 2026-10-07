/**
 * Role-based configuration for the Phase 3 readiness score engine.
 *
 * WHY DETERMINISTIC CONFIG:
 * Weights are static data, not AI-generated. This ensures every user's
 * readiness score is reproducible and auditable — Gemini never decides
 * how important a stage is. Academic/industry defensibility requires this.
 *
 * Weight values must sum to 1.0 per role.
 * requiredSkills lists the skills a candidate is expected to demonstrate.
 */

export const ROLE_CONFIG = {
  // ── Frontend Developer ─────────────────────────────────────────────────────
  'frontend developer': {
    displayName: 'Frontend Developer',
    weights: {
      vocabulary:          0.05,
      grammar:             0.05,
      technicalMCQ:        0.25,
      coding:              0.30,
      technicalInterview:  0.25,
      hrInterview:         0.10,
    },
    requiredSkills: ['html', 'css', 'javascript', 'react', 'responsive design', 'git'],
    preferredSkills: ['typescript', 'tailwind', 'vite', 'testing', 'webpack'],
  },

  // ── Backend Developer ──────────────────────────────────────────────────────
  'backend developer': {
    displayName: 'Backend Developer',
    weights: {
      vocabulary:          0.05,
      grammar:             0.05,
      technicalMCQ:        0.25,
      coding:              0.35,
      technicalInterview:  0.20,
      hrInterview:         0.10,
    },
    requiredSkills: ['node.js', 'express', 'mongodb', 'rest api', 'sql', 'git'],
    preferredSkills: ['docker', 'redis', 'microservices', 'jwt', 'testing'],
  },

  // ── Data Analyst ───────────────────────────────────────────────────────────
  'data analyst': {
    displayName: 'Data Analyst',
    weights: {
      vocabulary:          0.08,
      grammar:             0.07,
      technicalMCQ:        0.30,
      coding:              0.20,
      technicalInterview:  0.20,
      hrInterview:         0.15,
    },
    requiredSkills: ['python', 'sql', 'excel', 'data visualization', 'statistics'],
    preferredSkills: ['pandas', 'numpy', 'tableau', 'power bi', 'machine learning'],
  },

  // ── Software Engineer (default / fallback) ─────────────────────────────────
  'software engineer': {
    displayName: 'Software Engineer',
    weights: {
      vocabulary:          0.05,
      grammar:             0.05,
      technicalMCQ:        0.25,
      coding:              0.30,
      technicalInterview:  0.25,
      hrInterview:         0.10,
    },
    requiredSkills: ['data structures', 'algorithms', 'oop', 'git', 'problem solving'],
    preferredSkills: ['system design', 'testing', 'agile', 'cloud basics'],
  },
};

/**
 * Returns the role config for a given targetRole string.
 * Falls back to 'software engineer' if the role isn't found.
 */
export const getRoleConfig = (targetRole) => {
  if (!targetRole) return ROLE_CONFIG['software engineer'];
  const key = targetRole.toLowerCase().trim();

  // Direct match
  if (ROLE_CONFIG[key]) return ROLE_CONFIG[key];

  // Partial match (e.g. "Senior Frontend Developer" → 'frontend developer')
  for (const roleKey of Object.keys(ROLE_CONFIG)) {
    if (key.includes(roleKey) || roleKey.includes(key)) {
      return ROLE_CONFIG[roleKey];
    }
  }

  return ROLE_CONFIG['software engineer'];
};
