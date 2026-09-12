import React from 'react';
import { Card } from './Card';
import './ScoreCard.css';

export const ScoreCard = ({ title, score, total = 100 }) => {
  const percentage = Math.round((score / total) * 100);
  
  let colorVar = 'var(--accent-primary)';
  if (percentage >= 80) colorVar = 'var(--success-color)';
  else if (percentage < 50) colorVar = 'var(--error-color)';

  return (
    <Card className="score-card">
      <div className="score-header">
        <h3 className="score-title">{title}</h3>
      </div>
      <div className="score-body">
        <div className="score-value" style={{ color: colorVar }}>
          {score} <span className="score-total">/ {total}</span>
        </div>
        <div className="score-percentage">
          {percentage}% Match
        </div>
      </div>
    </Card>
  );
};
