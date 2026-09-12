import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateStructuredOutput } from '../utils/gemini.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const runTest = async () => {
  console.log('Testing Gemini API integration...');
  console.log(`Using API Key: ${process.env.GEMINI_API_KEY ? 'Set' : 'Missing'}`);

  const prompt = `Extract skills from this text: "I have 5 years of experience in JavaScript and Node.js."`;
  const schema = {
    type: "object",
    properties: {
      skills: {
        type: "array",
        items: { type: "string" }
      }
    },
    required: ["skills"]
  };

  try {
    const result = await generateStructuredOutput(prompt, schema);
    console.log('Success! Output:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

runTest();
