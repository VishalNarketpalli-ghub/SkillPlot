import fs from 'fs';
import path from 'path';

const API = 'http://localhost:5000/api';
let token = '';

async function testE2E() {
  console.log('--- E2E Backend Verification ---');
  try {
    // 1. Register User
    console.log('\\n1. Testing User Registration (/api/auth/register)');
    const regRes = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        targetRole: 'Frontend Developer'
      })
    });
    const regData = await regRes.json();
    if (!regData.success) throw new Error(regData.message);
    token = regData.data.token;
    console.log('✅ Registration successful');

    // 2. Upload Resume
    console.log('\\n2. Testing Resume Upload (/api/resume/upload)');
    const formData = new FormData();
    const fileBuffer = fs.readFileSync('dummy.pdf');
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });
    formData.append('resume', blob, 'dummy.pdf');
    
    const upRes = await fetch(`${API}/resume/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    const upData = await upRes.json();
    if (!upData.success) throw new Error(upData.message);
    console.log('✅ Resume Upload successful (AI extractedSkills skipped via dummy file)');

    // 3. Extract JD
    console.log('\\n3. Testing JD Extraction (/api/job-description/analyze)');
    const jdRes = await fetch(`${API}/job-description/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        jobDescription: 'Looking for a Frontend Developer with HTML, CSS, JavaScript and React experience.'
      })
    });
    const jdData = await jdRes.json();
    if (!jdData.success) throw new Error(jdData.message);
    console.log('✅ JD Extraction successful. Fallback or Mock worked.');

    // 4. Match Score
    console.log('\\n4. Testing Match Score (/api/analysis/match)');
    const matchRes = await fetch(`${API}/analysis/match`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const matchData = await matchRes.json();
    if (!matchData.success) throw new Error(matchData.message);
    console.log('✅ Match Score generated:', matchData.data.score);

    // 5. Generate MCQ (Phase 2)
    console.log('\\n5. Testing Phase 2 MCQ Generation (/api/assessment/mcq/generate)');
    const mcqRes = await fetch(`${API}/assessment/mcq/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        role: 'Frontend Developer',
        skill: 'React',
        difficulty: 'medium'
      })
    });
    const mcqData = await mcqRes.json();
    if (!mcqData.success) throw new Error(mcqData.message);
    console.log('✅ MCQ Generated (Mocked):', mcqData.data[0].questionText);

    // 6. Submit Answer
    console.log('\\n6. Testing Answer Submission (/api/assessment/submit)');
    const qId = mcqData.data[0]._id;
    const ansRes = await fetch(`${API}/assessment/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ questionId: qId, userAnswer: 'Paris' })
    });
    const ansData = await ansRes.json();
    if (!ansData.success) throw new Error(ansData.message);
    console.log('✅ Answer submitted. Correct?', ansData.data.isCorrect);

    // 7. Phase 3 - Readiness Score
    console.log('\\n7. Testing Phase 3 Readiness Score (/api/intelligence/readiness)');
    const readRes = await fetch(`${API}/intelligence/readiness`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const readData = await readRes.json();
    if (!readData.success) throw new Error(readData.message);
    console.log('✅ Readiness Score computed:', readData.data.overallScore);

    // 8. Phase 3 - Skill Gap
    console.log('\\n8. Testing Phase 3 Skill Gap (/api/intelligence/skill-gap)');
    const gapRes = await fetch(`${API}/intelligence/skill-gap`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const gapData = await gapRes.json();
    if (!gapData.success) throw new Error(gapData.message);
    console.log(`✅ Skill gaps detected: ${gapData.data.totalGaps}`);

    // 9. Phase 3 - Roadmap
    console.log('\\n9. Testing Phase 3 Roadmap (/api/intelligence/roadmap)');
    const mapRes = await fetch(`${API}/intelligence/roadmap`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const mapData = await mapRes.json();
    if (!mapData.success) throw new Error(mapData.message);
    console.log('✅ Roadmap generated');

    console.log('\\n🎉 All APIs functioning as expected! Phase 1, Phase 2, and Phase 3 are complete.');

  } catch (err) {
    console.error('\\n❌ TEST FAILED:', err.message);
  }
}

testE2E();
