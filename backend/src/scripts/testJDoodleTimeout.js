import { executeCode } from '../services/codeExecutionService.js';
import dotenv from 'dotenv';
dotenv.config();

const testTimeout = async () => {
  console.log('--- TESTING JDOODLE TIMEOUT ---');
  const sourceCode = `
    while(true) {
      // infinite loop
    }
  `;
  const result = await executeCode(sourceCode, '', 'javascript');
  console.log('JDoodle Response:', JSON.stringify(result, null, 2));
};

testTimeout().catch(console.error);
