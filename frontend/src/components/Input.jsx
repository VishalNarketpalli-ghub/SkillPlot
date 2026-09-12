import React from 'react';
import './Input.css';

export const Input = ({ 
  label, 
  error, 
  id, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`input-container ${className}`}>
      {label && <label htmlFor={id} className="input-label">{label}</label>}
      <input 
        id={id} 
        className={`input-field ${error ? 'input-error' : ''}`} 
        {...props} 
      />
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
};
