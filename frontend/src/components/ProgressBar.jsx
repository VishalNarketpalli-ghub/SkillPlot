import React from 'react';
import './ProgressBar.css';

export const ProgressBar = ({ progress, color = 'var(--accent-primary)', height = '8px' }) => {
  return (
    <div className="progress-container" style={{ height }}>
      <div 
        className="progress-fill" 
        style={{ width: `${Math.min(Math.max(progress, 0), 100)}%`, backgroundColor: color }}
      />
    </div>
  );
};
