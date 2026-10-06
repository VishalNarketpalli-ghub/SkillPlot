import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../../.env') });

const BASE_URL = 'http://127.0.0.1:5000/api';
let token = '';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTest() {
  console.log('--- STARTING TECHNICAL INTERVIEW TEST ---');
  
  try {
    // 1. Login/Register to get token
    console.log('\n1. Logging in...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'tech_testuser@careerready.local', password: 'Password123!' })
    });
    const loginData = await loginRes.json();
    if (!loginData.success) {
      console.log('Login failed, attempting to register...');
      const regRes = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Tech Test User', email: 'tech_testuser@careerready.local', password: 'Password123!' })
      });
      const regData = await regRes.json();
      if (!regData.success) throw new Error('Registration failed');
      token = regData.data.token;
    } else {
      token = loginData.data.token;
    }
    console.log('Login OK.');

    // 2. Start Technical Interview
    console.log('\n2. Starting Technical Interview...');
    const startRes = await fetch(`${BASE_URL}/interview/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ role: 'Frontend Developer', skill: 'React', type: 'technical' })
    });
    const startData = await startRes.json();
    if (!startData.success) {
      console.error(startData);
      throw new Error('Technical Interview start failed');
    }
    const interviewId = startData.data.interviewId;
    let currentQuestion = startData.data.question;
    console.log(`Start OK. ID: ${interviewId}`);
    console.log(`Q1: "${currentQuestion}"`);

    // 3. Submit Answers
    let followUpCount = 0;
    let questionCount = 1;
    
    while (currentQuestion) {
      await delay(2000);
      console.log(`\nSubmitting Answer to Q${questionCount}...`);
      
      const submitRes = await fetch(`${BASE_URL}/interview/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          interviewId,
          questionText: currentQuestion,
          userAnswer: "I use hooks like useState and useEffect to manage state and lifecycle. It's great."
        })
      });
      
      const submitData = await submitRes.json();
      if (!submitData.success) {
        console.error(submitData);
        throw new Error('Interview submit failed');
      }
      
      const evalScore = submitData.data.response.evaluation.overallScore;
      console.log(`Evaluation Score: ${evalScore}/10`);
      
      currentQuestion = submitData.data.nextQuestion;
      if (currentQuestion) {
        if (currentQuestion.includes("?") && !submitData.data.response.evaluation.followUpQuestion) {
          questionCount++;
        } else if (submitData.data.response.evaluation.followUpQuestion) {
          console.log("-> Follow-up asked!");
          followUpCount++;
        }
        console.log(`Next Q: "${currentQuestion}"`);
      } else {
        console.log("Interview Complete!");
      }
    }
    
    if (followUpCount > 1) {
      throw new Error(`Follow-up limit exceeded: ${followUpCount}`);
    } else {
      console.log(`Follow-up behavior correct. Count: ${followUpCount}`);
    }

    console.log('\n--- TECHNICAL INTERVIEW TEST: SUCCESS ---');
  } catch (error) {
    console.error('\n!!! TEST FAILED !!!');
    console.error(error.message);
    process.exit(1);
  }
}

runTest();
