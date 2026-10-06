import React from 'react';
import { Card } from './Card';
import { Button } from './Button';

export const QuestionCard = ({ question, options, selectedOption, onSelect, onSubmit, isSubmitting }) => {
  return (
    <Card>
      <h3 style={{ marginBottom: '1.5rem', lineHeight: '1.5' }}>{question}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {options.map((opt, i) => (
          <div 
            key={i} 
            onClick={() => onSelect(opt)}
            style={{
              padding: '1rem',
              border: `2px solid ${selectedOption === opt ? 'var(--primary-color)' : 'var(--border-color)'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              background: selectedOption === opt ? 'rgba(0,0,0,0.05)' : 'var(--bg-primary)',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {opt}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onSubmit} disabled={!selectedOption || isSubmitting} isLoading={isSubmitting}>
          Next Question
        </Button>
      </div>
    </Card>
  );
};
