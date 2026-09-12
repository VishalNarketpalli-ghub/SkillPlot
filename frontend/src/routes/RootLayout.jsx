import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';

export const RootLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className="container" style={{ flex: 1, padding: '2rem 1rem' }}>
        <Outlet />
      </main>
    </div>
  );
};
