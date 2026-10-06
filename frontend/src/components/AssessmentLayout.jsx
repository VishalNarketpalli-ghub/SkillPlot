import React from 'react';
import { Timer } from './Timer';
import { ProgressBar } from './ProgressBar';

export const AssessmentLayout = ({ title, currentStep, totalSteps, timeLimit, onTimeExpire, children }) => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{title}</h2>
        {timeLimit && <Timer key={currentStep} initialSeconds={timeLimit} onExpire={onTimeExpire} />}
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <span>Question {currentStep} of {totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <ProgressBar progress={(currentStep / totalSteps) * 100} />
      </div>

      {children}
    </div>
  );
};
