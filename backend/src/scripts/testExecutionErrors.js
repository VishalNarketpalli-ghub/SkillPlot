import 'dotenv/config';
import { executeCode } from '../services/codeExecutionService.js';
import { getJDoodleConfig } from '../config/jdoodle.js';

async function testExecutionErrors() {
  console.log('--- Testing Execution Error Responses ---');
  const config = getJDoodleConfig();
  if (!config.clientId || !config.clientSecret) {
    console.log('No JDoodle Client ID/Secret found. Skipping live test.');
    return;
  }

  const runSubmission = async (name, source) => {
    try {
      console.log(`\nRunning ${name}...`);
      const output = await executeCode(source, "", 'javascript');
      console.log(`${name} Status:`, output);
    } catch (err) {
      console.error(`${name} failed:`, err.message);
    }
  };

  await runSubmission('Syntax Error', 'console.log("missing parenthesis');
  await runSubmission('Runtime Error', 'throw new Error("Kaboom");');
  await runSubmission('Wrong Answer (Logic Error)', 'console.log("not the expected output");');
}

testExecutionErrors();
