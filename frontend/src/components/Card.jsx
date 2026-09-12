import React from 'react';
import './Card.css';

export const Card = ({ children, className = '', glass = true, ...props }) => {
  return (
    <div className={`card ${glass ? 'glass' : 'solid'} ${className}`} {...props}>
      {children}
    </div>
  );
};
