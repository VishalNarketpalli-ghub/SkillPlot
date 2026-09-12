import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider';
import { Sun, Moon } from 'lucide-react';
import { Button } from './Button';

export const Header = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="glass" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>CareerReady</h1>
      <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/dashboard" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>Dashboard</Link>
        <Link to="/profile" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>Profile</Link>
        <Link to="/login" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>Login</Link>
        <Link to="/register" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>Register</Link>
        <Button variant="ghost" onClick={toggleTheme} style={{ padding: '0.5rem' }}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </nav>
    </header>
  );
};
