export const generateVocabularyPrompt = (role) => `
You are an expert technical recruiter and assessor. Generate exactly 5 vocabulary and domain-knowledge questions for a ${role}.
You must return the response as a JSON array of objects.
Do NOT wrap the JSON in markdown code blocks.

Use this EXACT JSON schema for each question:
[
  {
    "text": "The question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "difficulty": "medium",
    "explanation": "Why this is the correct choice"
  }
]
`;

export const generateGrammarPrompt = (role) => `
You are an expert technical recruiter and assessor. Generate exactly 5 grammar and sentence-correction questions for a ${role}.
You must return the response as a JSON array of objects.
Do NOT wrap the JSON in markdown code blocks.

Use this EXACT JSON schema for each question:
[
  {
    "text": "The sentence with a grammatical error here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option B",
    "difficulty": "medium",
    "explanation": "Why this is the correct choice"
  }
]
`;

export const generateMCQPrompt = (role, skill, difficulty, count = 5) => `
You are an expert technical recruiter and assessor. Generate exactly ${count} technical multiple-choice questions for a ${role}.
The questions must focus specifically on the skill: ${skill}.
The difficulty level must be strictly: ${difficulty}.

You must return the response as a JSON array of objects.
Do NOT wrap the JSON in markdown code blocks.

Use this EXACT JSON schema for each question:
[
  {
    "text": "The technical question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option B",
    "difficulty": "${difficulty}",
    "explanation": "Why this is the correct choice"
  }
]
`;
