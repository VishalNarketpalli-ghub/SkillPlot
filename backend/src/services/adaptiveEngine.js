export const getNextDifficulty = (correctCount, totalAnswered, currentDifficulty) => {
  if (totalAnswered === 0) {
    return currentDifficulty || 'easy';
  }

  const percentage = (correctCount / totalAnswered) * 100;

  if (percentage < 50) {
    return currentDifficulty === 'hard' ? 'medium' : 'easy';
  } else if (percentage >= 50 && percentage < 80) {
    return currentDifficulty;
  } else {
    // >= 80
    return currentDifficulty === 'easy' ? 'medium' : 'hard';
  }
};
