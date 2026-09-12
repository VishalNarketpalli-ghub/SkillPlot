import React from 'react';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';
import { RootLayout } from './routes/RootLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';

import { Login } from './routes/Login';
import { Register } from './routes/Register';
import { Dashboard } from './routes/Dashboard';
import { Profile } from './routes/Profile';
import { Resume } from './routes/Resume';
import { JobDescription } from './routes/JobDescription';
import { Analysis } from './routes/Analysis';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'profile', element: <Profile /> },
          { path: 'resume', element: <Resume /> },
          { path: 'job-description', element: <JobDescription /> },
          { path: 'analysis', element: <Analysis /> },
        ]
      }
    ],
  },
]);

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
