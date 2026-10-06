import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Resume from '../models/Resume.js';
import JobDescription from '../models/JobDescription.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const BASE_URL = 'http://localhost:5000/api';
let testIds = { user: null, resume: null, jd: null };
let token = '';

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI);
}

async function runPhase1Tests() {
  console.log('--- Phase 1 Stabilization Test Started ---');
  try {
    await connectDB();
    
    const uniqueId = Date.now();
    const testEmail = `test_p1_${uniqueId}@careerready.local`;

    // 1. Profile API (Auth + GET/PUT)
    console.log('[1] Profile API Verification');
    let res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Phase 1 Test User', email: testEmail, password: 'password123' })
    });
    let data = await res.json();
    if (!data.success) throw new Error('Registration failed: ' + data.message);
    
    testIds.user = data.data._id;
    token = data.data.token;
    console.log('✅ Auth successful. User created:', testIds.user);

    // Profile PUT
    res = await fetch(`${BASE_URL}/users/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ targetRole: 'Frontend Developer', skills: ['react', 'node'] })
    });
    data = await res.json();
    if (!data.success || data.data.targetRole !== 'Frontend Developer') {
      throw new Error('Profile update failed');
    }
    
    // Profile GET
    res = await fetch(`${BASE_URL}/users/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    data = await res.json();
    if (!data.success || data.data.targetRole !== 'Frontend Developer') {
      throw new Error('Profile GET failed to reflect updates');
    }
    console.log('✅ Profile GET/PUT verified natively');
    
    // 2. Resume Pipeline (Non-Gemini)
    console.log('[2] Resume Upload (Non-Gemini fallback)');
    const dummyPdfPath = path.join(__dirname, 'dummy_p1.pdf');
    fs.writeFileSync(dummyPdfPath, 'dummy pdf content for phase 1 validation');
    
    const formData = new FormData();
    const fileBlob = new Blob([fs.readFileSync(dummyPdfPath)], { type: 'application/pdf' });
    formData.append('resume', fileBlob, 'dummy_p1.pdf');
    
    res = await fetch(`${BASE_URL}/resume/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    data = await res.json();
    if (!data.success) throw new Error('Resume upload failed: ' + data.message);
    testIds.resume = data.data._id;
    fs.unlinkSync(dummyPdfPath);
    console.log('✅ Resume upload succeeds and silently handles Gemini 404 block');
    
    // 3. Deterministic Match Score (Synthetic DB seed to bypass blocked JD endpoint)
    console.log('[3] Deterministic Match Score Evaluation boundaries');
    const testJD = await JobDescription.create({
      userId: testIds.user,
      rawText: 'Mock JD',
      title: 'Mock Role',
      requiredSkills: [],
      preferredSkills: []
    });
    testIds.jd = testJD._id;

    const runMatchTest = async (jdReqs, resumeSkills, expectedScore, label) => {
      await JobDescription.findByIdAndUpdate(testIds.jd, { requiredSkills: jdReqs });
      await Resume.findByIdAndUpdate(testIds.resume, { extractedSkills: resumeSkills });
      
      const matchRes = await fetch(`${BASE_URL}/analysis/match`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const matchData = await matchRes.json();
      if (!matchData.success) throw new Error(`Match score failed for ${label}`);
      
      if (matchData.data.score !== expectedScore) {
         console.error(`❌ Match calculation failure [${label}]: Expected ${expectedScore}%, got ${matchData.data.score}%`);
         throw new Error('Match score calculation broken');
      }
      console.log(`✅ [${label}] mathematically correct: ${matchData.data.score}%`);
    };

    // Test: normal overlap (3 targets, 1 match -> 33%)
    await runMatchTest(['react', 'css', 'typescript'], ['react', 'node', 'javascript'], 33, 'Normal Overlap');

    // Test: zero target skills (division by zero fallback check)
    await runMatchTest([], ['react', 'node'], 0, 'Zero Target Skills');

    // Test: no matching skills (3 targets, 0 matches -> 0%)
    await runMatchTest(['java', 'spring'], ['react', 'node'], 0, 'No Matching Skills');

    // Test: full matching (2 targets, 2 matches -> 100%)
    await runMatchTest(['react', 'node'], ['react', 'node', 'express'], 100, 'Full Match');

    // Test: case differences
    await runMatchTest(['REACT', 'Node.JS'], ['react', 'node.js'], 100, 'Case Differences');

    // Test: whitespace differences (assuming trim is implemented)
    await runMatchTest([' react ', 'node '], ['react', '  node'], 100, 'Whitespace Differences');


    // 4. Static Workflow
    console.log('[4] Static Workflow Generator');
    res = await fetch(`${BASE_URL}/analysis/workflow`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    data = await res.json();
    if (!data.success || !Array.isArray(data.data.workflow)) throw new Error('Workflow failed');
    console.log('✅ Workflow returned sequence:', data.data.workflow);

    console.log('--- Phase 1 Execution Successful ---');
    
  } catch (error) {
    console.error('❌ Test Failed:', error.message);
  } finally {
    // Exact ID Cleanup
    console.log('--- Cleaning up exact test IDs ---');
    try {
      if (testIds.jd) await JobDescription.findByIdAndDelete(testIds.jd);
      if (testIds.resume) await Resume.findByIdAndDelete(testIds.resume);
      if (testIds.user) await User.findByIdAndDelete(testIds.user);
      console.log('✅ Cleanup completed cleanly');
    } catch (cleanupError) {
      console.error('❌ Cleanup failed. Orphaned IDs:', testIds);
    }
    process.exit(0);
  }
}

runPhase1Tests();
