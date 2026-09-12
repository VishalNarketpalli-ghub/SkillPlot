import React from 'react';
import './Button.css';

export const Button = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  disabled, 
  className = '', 
  ...props 
}) => {
  return (
    <button 
      className={`btn btn-${variant} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? <span className="loader">...</span> : children}
    </button>
  );
};
