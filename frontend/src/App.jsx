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
import { VocabularyAssessment } from './screens/VocabularyAssessment';
import { GrammarAssessment } from './screens/GrammarAssessment';
import { TechnicalMCQ } from './screens/TechnicalMCQ';
import { CodingAssessment } from './screens/CodingAssessment';
import { TechnicalInterview } from './screens/TechnicalInterview';
import { HRInterview } from './screens/HRInterview';
import { Results } from './screens/Results';

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
          { path: 'vocabulary', element: <VocabularyAssessment /> },
          { path: 'grammar', element: <GrammarAssessment /> },
          { path: 'mcq', element: <TechnicalMCQ /> },
          { path: 'coding', element: <CodingAssessment /> },
          { path: 'interview/technical', element: <TechnicalInterview /> },
          { path: 'interview/hr', element: <HRInterview /> },
          { path: 'results', element: <Results /> },
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
