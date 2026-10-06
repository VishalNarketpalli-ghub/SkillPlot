import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import resumeRoutes from './routes/resume.js';
import jobDescriptionRoutes from './routes/jobDescription.js';
import analysisRoutes from './routes/analysis.js';
import assessmentRoutes from './routes/assessment.js';
import interviewRoutes from './routes/interview.js';
import codingRoutes from './routes/coding.js';
import { errorHandler } from './middleware/error.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/job-description', jobDescriptionRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/coding', codingRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
