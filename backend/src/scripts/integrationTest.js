import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTests() {
  const baseUrl = 'http://localhost:5000/api';
  console.log('--- Starting Integration Tests ---');
  
  try {
    // 1. Health check
    const health = await fetch(`${baseUrl}/health`).then(r => r.json()).catch(() => null);
    if (!health) {
      console.log('Server is not running. Please start the backend server first.');
      return;
    }
    console.log('✅ Server is running.');

    // 2. Register
    const testEmail = `test${Date.now()}@example.com`;
    console.log(`Registering user ${testEmail}...`);
    let res = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: testEmail, password: 'password123' })
    });
    let data = await res.json();
    if (!data.success) throw new Error(data.message);
    const token = data.data.token;
    console.log('✅ Registered successfully.');

    // 3. Login
    console.log('Logging in...');
    res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'password123' })
    });
    data = await res.json();
    if (!data.success) throw new Error(data.message);
    console.log('✅ Logged in successfully.');

    // 4. Upload Resume
    // We need to create a dummy PDF file first
    const dummyPdfPath = path.join(__dirname, 'dummy.pdf');
    fs.writeFileSync(dummyPdfPath, 'dummy pdf content - pretending to be a real resume');
    
    console.log('Uploading Resume...');
    const formData = new FormData();
    const fileBlob = new Blob([fs.readFileSync(dummyPdfPath)], { type: 'application/pdf' });
    formData.append('resume', fileBlob, 'dummy.pdf');
    
    res = await fetch(`${baseUrl}/resume/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    data = await res.json();
    
    if (!data.success) throw new Error(data.message);
    console.log('✅ Resume uploaded successfully.');

    // 5. Analyze JD
    console.log('Analyzing Job Description...');
    const dummyJD = "We are looking for a software engineer with skills in React, Node.js, and MongoDB.";
    res = await fetch(`${baseUrl}/job-description/analyze`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ jobDescription: dummyJD })
    });
    data = await res.json();
    if (!data.success) throw new Error(data.message);
    console.log('✅ Job description analyzed successfully.');

    // 6. Match Score
    console.log('Getting Match Score...');
    res = await fetch(`${baseUrl}/analysis/match`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    data = await res.json();
    if (!data.success) throw new Error(data.message);
    console.log(`✅ Match Score retrieved: ${data.data.score}%`);

    // Clean up
    if (fs.existsSync(dummyPdfPath)) fs.unlinkSync(dummyPdfPath);
    console.log('--- All Integration Tests Passed! ---');
    
  } catch (err) {
    console.error('❌ Test Failed:', err.message);
  }
}

runTests();
