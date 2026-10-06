import React, { useState, useEffect } from 'react';

export const Timer = ({ initialSeconds, onExpire }) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      if (onExpire) onExpire();
      return;
    }
    const timerId = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(timerId);
  }, [seconds, onExpire]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div style={{ 
      fontWeight: 'bold', 
      fontSize: '1.2rem',
      color: seconds <= 10 ? 'var(--error-color)' : 'var(--text-primary)',
      background: 'rgba(0,0,0,0.05)',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      display: 'inline-block'
    }}>
      ⏱ {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </div>
  );
};
