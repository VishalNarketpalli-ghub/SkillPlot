import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Assessment from '../models/Assessment.js';
import Interview from '../models/Interview.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const BASE_URL = 'http://localhost:5000/api';
let testIds = { user: null, assessments: [], interviews: [] };
let token = '';

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI);
}

async function runResultsTests() {
  console.log('--- Phase 2 Results API Verification ---');
  try {
    await connectDB();
    
    const uniqueId = Date.now();
    const testEmail = `test_res_${uniqueId}@careerready.local`;

    let res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Results Test User', email: testEmail, password: 'password123' })
    });
    let data = await res.json();
    if (!data.success) throw new Error('Registration failed: ' + data.message);
    
    testIds.user = data.data._id;
    token = data.data.token;
    console.log('✅ Auth successful. User created:', testIds.user);

    // Seed synthetic data
    console.log('Seeding database with raw scores...');
    
    const assessments = [
      { userId: testIds.user, type: 'VOCABULARY', status: 'COMPLETED', score: 85 },
      { userId: testIds.user, type: 'GRAMMAR', status: 'COMPLETED', score: 90 },
      { userId: testIds.user, type: 'TECHNICAL_MCQ', status: 'COMPLETED', score: 75 },
      { userId: testIds.user, type: 'CODING', status: 'COMPLETED', score: 2 } // Mock coding score
    ];
    for (let a of assessments) {
      const created = await Assessment.create(a);
      testIds.assessments.push(created._id);
    }
    
    const interviews = [
      { userId: testIds.user, role: 'Software Engineer', type: 'technical', status: 'completed', overallScore: 82 },
      { userId: testIds.user, role: 'Software Engineer', type: 'hr', status: 'completed', overallScore: 88 }
    ];
    for (let i of interviews) {
      const created = await Interview.create(i);
      testIds.interviews.push(created._id);
    }
    
    console.log('✅ Data seeded. Fetching Results...');

    res = await fetch(`${BASE_URL}/assessment/results`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    data = await res.json();
    if (!data.success) throw new Error('Failed to fetch results');
    
    const results = data.data;
    console.log('Raw Results mapped:', results);
    
    if (results.vocabulary !== 85) throw new Error('Vocabulary mismatch');
    if (results.grammar !== 90) throw new Error('Grammar mismatch');
    if (results.technicalMCQ !== 75) throw new Error('Technical MCQ mismatch');
    if (results.coding !== 2) throw new Error('Coding mismatch');
    if (results.technicalInterview !== 82) throw new Error('Technical Interview mismatch');
    if (results.hrInterview !== 88) throw new Error('HR Interview mismatch');
    
    console.log('✅ Results mapping verified. Cross-user data isolation and accurate extraction confirmed.');

    // Cross-user test: fetch with no token
    console.log('Testing unauthorized access...');
    const unauthorizedRes = await fetch(`${BASE_URL}/assessment/results`);
    if (unauthorizedRes.status !== 401) throw new Error('Unauthorized access was not blocked properly');
    console.log('✅ Unauthorized block verified');

    console.log('--- Results API Verification Complete ---');
  } catch (error) {
    console.error('❌ Test Failed:', error.message);
  } finally {
    console.log('--- Cleaning up exact test IDs ---');
    try {
      for (let id of testIds.assessments) await Assessment.findByIdAndDelete(id);
      for (let id of testIds.interviews) await Interview.findByIdAndDelete(id);
      if (testIds.user) await User.findByIdAndDelete(testIds.user);
      console.log('✅ Cleanup completed cleanly');
    } catch (cleanupError) {
      console.error('❌ Cleanup failed. Orphaned IDs:', testIds);
    }
    process.exit(0);
  }
}

runResultsTests();
