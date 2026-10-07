import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProviderError, AIErrorType } from './aiErrors.js';

let genAI = null;

const getGenAI = () => {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not defined in environment variables.');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');
  }
  return genAI;
};

/**
 * Utility to generate structured JSON output from Gemini using Schema definition.
 * 
 * @param {string} prompt - The text prompt
 * @param {object} schema - The expected JSON schema
 * @returns {Promise<object>} The parsed JSON output
 */
export const generateStructuredOutput = async (prompt, schema) => {
  console.log('[MOCK GEMINI] Generating for prompt:', prompt.substring(0, 50) + '...');
  
  if (prompt.includes('MCQ') || prompt.includes('vocabulary') || prompt.includes('grammar') || prompt.toLowerCase().includes('multiple-choice')) {
    return [
      {
        text: "What is the capital of France? (MOCK)",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: "Paris",
        explanation: "Paris is the capital of France."
      }
    ];
  }

  if (prompt.includes('job description')) {
    return {
      title: 'Frontend Developer',
      company: 'Mock Inc',
      requiredSkills: ['HTML', 'CSS', 'React'],
      preferredSkills: ['TypeScript']
    };
  }

  // Fallback for roadmap or others: throw an error to test the deterministic fallback
  throw new AIProviderError(AIErrorType.INVALID_RESPONSE, 'Mock Gemini Error to trigger fallback');
};
