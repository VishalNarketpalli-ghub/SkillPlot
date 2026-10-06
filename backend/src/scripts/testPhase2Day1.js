import 'dotenv/config';
import { executeCode } from '../services/codeExecutionService.js';
import { getJDoodleConfig } from '../config/jdoodle.js';

async function testJDoodle() {
  console.log('--- Testing JDoodle Sandbox ---');
  const config = getJDoodleConfig();
  if (!config.clientId || !config.clientSecret) {
    console.log('No JDoodle Client ID/Secret found. Skipping live test.');
    return;
  }

  try {
    const sourceCode = "console.log('hello world');";
    const stdin = "";
    
    // Submit the code via the service
    const output = await executeCode(sourceCode, stdin, 'javascript');
    
    console.log('JDoodle Response (Normalized):', output);
    if (output.executionSuccess && output.stdout.includes('hello world')) {
      console.log('✅ JDoodle test passed!');
    } else {
      console.log('❌ JDoodle test failed:', output);
    }
  } catch (err) {
    console.error('JDoodle test error:', err.message);
  }
}

testJDoodle();
