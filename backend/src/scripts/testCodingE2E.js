import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import Assessment from '../models/Assessment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../../.env') });

const BASE_URL = 'http://127.0.0.1:5000/api';
let token = '';

async function runTests() {
  console.log('--- STARTING CODING E2E VERIFICATION ---');
  
  try {
    // Connect to DB for verification
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Login to get token
    console.log('\n1. Logging in...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'testuser@careerready.local', password: 'Password123!' })
    });
    const loginData = await loginRes.json();
    if (!loginData.success) {
      throw new Error('Login failed');
    }
    token = loginData.data.token;
    console.log('Login OK.');

    // Fetch problem
    console.log('\n2. Fetching problem...');
    const codeGetRes = await fetch(`${BASE_URL}/coding/problem?role=Software%20Engineer`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const codeGetData = await codeGetRes.json();
    if (!codeGetData.success) throw new Error('Coding fetch failed');
    const problemId = codeGetData.data._id;

    // Submit correct code
    console.log('\n3. Submitting valid code...');
    const validCode = `
      const fs = require('fs');
      const input = fs.readFileSync(0, 'utf-8').trim(); // Ensure stdin works
      
      function twoSum(nums, target) {
        const map = {};
        for (let i = 0; i < nums.length; i++) {
          const complement = target - nums[i];
          if (map.hasOwnProperty(complement)) {
            return [map[complement], i];
          }
          map[nums[i]] = i;
        }
        return [];
      }
      
      const parsed = JSON.parse(input); // format: {"nums": [2,7,11,15], "target": 9}
      console.log(JSON.stringify(twoSum(parsed.nums, parsed.target)));
    `;

    const codeSubRes = await fetch(`${BASE_URL}/coding/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ problemId, code: validCode })
    });
    const codeSubData = await codeSubRes.json();
    
    if (!codeSubData.success) {
      console.error(codeSubData);
      throw new Error('Coding submit failed');
    }
    
    console.log(`Coding Submit OK. Score: ${codeSubData.data.score}/${codeSubData.data.total}`);

    // Verify response format
    const expectedResponseFields = ['score', 'total', 'results'];
    for (const field of expectedResponseFields) {
      if (!(field in codeSubData.data)) {
         throw new Error(`Missing field ${field} in response data`);
      }
    }
    const firstResult = codeSubData.data.results[0];
    const expectedResultFields = ['passed', 'input', 'expected', 'actual', 'error'];
    for (const field of expectedResultFields) {
       if (!(field in firstResult)) {
          throw new Error(`Missing field ${field} in result object`);
       }
    }
    
    console.log('Response format OK.');

    // Verify Persistence
    console.log('\n4. Verifying MongoDB Persistence...');
    const tokenParts = token.split('.');
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
    const userId = payload.id;
    
    const dbAssessment = await Assessment.find({ userId: userId, type: 'CODING', 'details.problemId': problemId })
      .sort({ createdAt: -1 })
      .limit(1);

    if (dbAssessment.length === 0) throw new Error('Coding submission was not found in database');
    const record = dbAssessment[0];
    if (record.score !== codeSubData.data.score) {
      throw new Error(`Persisted score ${record.score} does not match response score ${codeSubData.data.score}`);
    }
    console.log('MongoDB Persistence Verified: Record found with matching score.');

    // 5. Test Error Handling
    console.log('\n5. Submitting erroneous code...');
    const invalidCode = 'const fs = require("fs"; console.log(fs); // Syntax error';
    const errSubRes = await fetch(`${BASE_URL}/coding/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ problemId, code: invalidCode })
    });
    
    const errSubData = await errSubRes.json();
    if (!errSubData.success) {
       throw new Error('Endpoint threw 500 on validly handled syntax error!');
    }
    
    console.log(`Error Submit OK. Score: ${errSubData.data.score}/${errSubData.data.total}`);
    if (errSubData.data.score > 0) {
       throw new Error('Score was > 0 despite syntax error');
    }

    console.log('\n--- CODING E2E VERIFICATION: SUCCESS ---');
    process.exit(0);
  } catch (error) {
    console.error('\n!!! TEST FAILED !!!');
    console.error(error);
    process.exit(1);
  }
}

runTests();
