const BASE = 'http://localhost:5000/api/intelligence';

const authHeader = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

/** GET /api/intelligence/readiness — deterministic readiness score + competency map */
export const fetchReadinessScore = async (token) => {
  const res = await fetch(`${BASE}/readiness`, { headers: authHeader(token) });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch readiness score');
  return data.data;
};

/** GET /api/intelligence/skill-gap — skill gaps grouped by level */
export const fetchSkillGap = async (token) => {
  const res = await fetch(`${BASE}/skill-gap`, { headers: authHeader(token) });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch skill gaps');
  return data.data;
};

/** GET /api/intelligence/roadmap — hybrid roadmap with Gemini explanations */
export const fetchRoadmap = async (token) => {
  const res = await fetch(`${BASE}/roadmap`, { headers: authHeader(token) });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch roadmap');
  return data.data;
};
