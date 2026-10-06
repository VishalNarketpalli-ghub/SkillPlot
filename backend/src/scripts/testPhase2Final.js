import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../../.env') });

const BASE_URL = 'http://127.0.0.1:5000/api';
let token = '';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTests() {
  console.log('--- STARTING PHASE 2 FINAL INTEGRATION TEST ---');
  
  try {
    // 1. Login to get token
    console.log('\n1. Logging in...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'testuser@careerready.local', password: 'Password123!' })
    });
    const loginData = await loginRes.json();
    if (!loginData.success) {
      console.log('Login failed, attempting to register...');
      const regRes = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test User', email: 'testuser@careerready.local', password: 'Password123!' })
      });
      const regData = await regRes.json();
      if (!regData.success) throw new Error('Registration failed');
      token = regData.data.token;
    } else {
      token = loginData.data.token;
    }
    console.log('Login OK.');

    // 2. Vocab MCQ
    console.log('\n2. Testing Vocabulary MCQ Generation...');
    const vocabRes = await fetch(`${BASE_URL}/assessment/vocabulary/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ role: 'Software Engineer' })
    });
    const vocabData = await vocabRes.json();
    if (!vocabData.success || !Array.isArray(vocabData.data)) {
      console.error(vocabData);
      throw new Error('Vocab generation failed');
    }
    console.log(`Vocab OK. Generated ${vocabData.data.length} questions.`);
    await delay(2000);

    // 3. Grammar MCQ
    console.log('\n3. Testing Grammar MCQ Generation...');
    const gramRes = await fetch(`${BASE_URL}/assessment/grammar/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ role: 'Software Engineer' })
    });
    const gramData = await gramRes.json();
    if (!gramData.success || !Array.isArray(gramData.data)) {
      console.error(gramData);
      throw new Error('Grammar generation failed');
    }
    console.log(`Grammar OK. Generated ${gramData.data.length} questions.`);
    await delay(2000);

    // 4. Technical MCQ
    console.log('\n4. Testing Technical MCQ Generation...');
    const techRes = await fetch(`${BASE_URL}/assessment/mcq/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ role: 'Software Engineer', skill: 'javascript', difficulty: 'easy' })
    });
    const techData = await techRes.json();
    if (!techData.success || !Array.isArray(techData.data)) {
      console.error(techData);
      throw new Error('Technical MCQ failed');
    }
    console.log(`Technical MCQ OK. Generated ${techData.data.length} questions.`);
    await delay(2000);

    // 5. HR Interview Start & Submit
    console.log('\n5. Testing HR Interview Loop...');
    const hrStartRes = await fetch(`${BASE_URL}/interview/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ role: 'Software Engineer', type: 'hr' })
    });
    const hrStartData = await hrStartRes.json();
    if (!hrStartData.success) throw new Error('HR Interview start failed');
    const hrInterviewId = hrStartData.data.interviewId;
    const hrQuestion = hrStartData.data.question.question;
    console.log(`HR Start OK. Question: "${hrQuestion}"`);
    
    await delay(2000);
    const hrSubmitRes = await fetch(`${BASE_URL}/interview/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ 
        interviewId: hrInterviewId, 
        questionText: hrQuestion, 
        userAnswer: "I used the STAR method. Situation: things were bad. Task: fix them. Action: I coded. Result: things were good." 
      })
    });
    const hrSubmitData = await hrSubmitRes.json();
    if (!hrSubmitData.success) throw new Error('HR Interview submit failed');
    console.log(`HR Submit OK. Evaluation Score: ${hrSubmitData.data.evaluation.score}/10`);
    await delay(2000);

    // 6. Coding Problem Fetch & Submit
    console.log('\n6. Testing Code Execution...');
    const codeGetRes = await fetch(`${BASE_URL}/coding/problem?role=Software%20Engineer`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const codeGetData = await codeGetRes.json();
    if (!codeGetData.success) throw new Error('Coding fetch failed');
    const problemId = codeGetData.data._id;
    console.log(`Coding Fetch OK. Problem: "${codeGetData.data.title}"`);

    const cheatCode = `
      const fs = require('fs');
      const input = fs.readFileSync('/dev/stdin', 'utf-8').trim();
      if(input.includes('[2,7,11,15]')) console.log('[0,1]');
      else if(input.includes('[3,2,4]')) console.log('[1,2]');
      else console.log('true');
    `;

    const codeSubRes = await fetch(`${BASE_URL}/coding/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ problemId, code: cheatCode })
    });
    const codeSubData = await codeSubRes.json();
    if (!codeSubData.success) throw new Error('Coding submit failed');
    console.log(`Coding Submit OK. Passed: ${codeSubData.data.score}/${codeSubData.data.total}`);
    
    console.log('\n--- PHASE 2 FINAL INTEGRATION TEST: SUCCESS ---');
  } catch (error) {
    console.error('\n!!! TEST FAILED !!!');
    console.error(error.message);
    process.exit(1);
  }
}

runTests();
