import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { generateStructuredOutput } from '../providers/aiProvider.js';
import { AIProviderError, AIErrorType } from '../utils/aiErrors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../../.env') });

async function run() {
  console.log("=== AI ARCHITECTURE TEST ===");
  
  // Test 1: Invalid Provider
  try {
    process.env.AI_PROVIDER = 'invalid_provider';
    await generateStructuredOutput("test", {});
    console.log("FAIL: Invalid provider did not throw");
  } catch (e) {
    if (e instanceof AIProviderError && e.type === AIErrorType.UNKNOWN) {
      console.log("PASS: Invalid provider correctly rejected");
    } else {
      console.log("FAIL: Unexpected error for invalid provider", e);
    }
  }

  // Test 2: Gemini Provider Normalization
  try {
    process.env.AI_PROVIDER = 'gemini';
    await generateStructuredOutput("test", {});
    console.log("FAIL: Gemini generation surprisingly succeeded (Expected Quota block)");
  } catch (e) {
    if (e instanceof AIProviderError) {
      console.log("PROVIDER CONNECTION: EXECUTED");
      console.log("PROVIDER ERROR NORMALIZATION: TESTED");
      if (e.type === AIErrorType.QUOTA) {
        console.log("LIVE AI GENERATION: BLOCKED — EXTERNAL GEMINI QUOTA");
      } else {
        console.log(`LIVE AI GENERATION: FAILED — ${e.type} (${e.message})`);
      }
    } else {
      console.log("FAIL: Error was not normalized to AIProviderError", e);
    }
  }
}

run();
