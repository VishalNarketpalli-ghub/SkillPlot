import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, LogOut } from 'lucide-react';
import { Button } from './Button';

export const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinkStyle = ({ isActive }) => ({
    color: isActive ? 'var(--accent-primary, #6366f1)' : 'var(--text-primary)',
    textDecoration: 'none',
    fontWeight: isActive ? 600 : 500,
    padding: '0.4rem 0.8rem',
    borderRadius: '8px',
    backgroundColor: isActive 
      ? (isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.07)') 
      : 'transparent',
    boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none',
    transition: 'all 0.2s ease-in-out'
  });

  return (
    <header className="glass" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        <Link to={isLoggedIn ? "/dashboard" : "/login"} style={{ color: 'inherit', textDecoration: 'none' }}>CareerReady</Link>
      </h1>
      <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {isLoggedIn ? (
          <>
            <NavLink to="/dashboard" style={getNavLinkStyle}>Dashboard</NavLink>
            <NavLink to="/profile" style={getNavLinkStyle}>Profile</NavLink>
            <Button variant="ghost" onClick={handleLogout} style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: '0.5rem' }}>
              <LogOut size={18} /> Logout
            </Button>
          </>
        ) : (
          <>
            <NavLink to="/login" style={getNavLinkStyle}>Login</NavLink>
            <NavLink to="/register" style={getNavLinkStyle}>Register</NavLink>
          </>
        )}
        <Button variant="ghost" onClick={toggleTheme} style={{ padding: '0.5rem', marginLeft: '0.5rem' }}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </nav>
    </header>
  );
};
