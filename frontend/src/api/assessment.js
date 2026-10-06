export const generateVocabulary = async (role, token) => {
  const res = await fetch('http://localhost:5000/api/assessment/vocabulary/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ role })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to generate vocabulary');
  return data;
};

export const generateGrammar = async (role, token) => {
  const res = await fetch('http://localhost:5000/api/assessment/grammar/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ role })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to generate grammar');
  return data;
};

export const fetchNextMCQ = async (role, skill, currentDifficulty, correctCount, totalAnswered, token) => {
  const res = await fetch('http://localhost:5000/api/assessment/mcq/next', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ role, skill, currentDifficulty, correctCount, totalAnswered })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch next MCQ');
  return data;
};

export const submitAnswer = async (questionId, userAnswer, token) => {
  const res = await fetch('http://localhost:5000/api/assessment/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ questionId, userAnswer })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to submit answer');
  return data;
};
