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
  const ai = getGenAI();
  const model = ai.getGenerativeModel({
    model: "gemini-2.5-pro",
    generationConfig: {
      // WHY: Forcing the responseMimeType to application/json alongside a Strict JSON schema
      // prevents Gemini from wrapping the response in markdown blocks (```json) or adding 
      // conversational text. This guarantees `JSON.parse` works downstream.
      responseMimeType: "application/json",
      responseSchema: schema,
    }
  });

  const maxAttempts = 3;
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      const result = await model.generateContent(prompt);
      
      try {
        return JSON.parse(result.response.text());
      } catch (parseError) {
        if (attempts >= maxAttempts) {
          throw new AIProviderError(AIErrorType.INVALID_RESPONSE, 'Failed to parse structured JSON from provider response after 3 attempts', parseError);
        }
        console.warn(`JSON parse error on attempt ${attempts}. Retrying...`);
        // The while loop will continue to retry model.generateContent
      }
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error;
      }
      
      console.error(`Gemini API Error (Attempt ${attempts}):`, error.message || error);
      
      // Normalize errors - Do not retry these upstream errors
      const errorStr = error.message || error.toString();
      
      if (errorStr.includes("429") && (errorStr.includes("quota exceeded") || errorStr.includes("quota limit"))) {
        throw new AIProviderError(AIErrorType.QUOTA, 'Gemini API free-tier quota exceeded', error);
      } else if (errorStr.includes("429")) {
        throw new AIProviderError(AIErrorType.RATE_LIMIT, 'Gemini API rate limit exceeded', error);
      } else if (errorStr.includes("401") || errorStr.includes("authentication credentials")) {
        throw new AIProviderError(AIErrorType.AUTHENTICATION, 'Gemini API authentication failed', error);
      } else if (errorStr.includes("503") || errorStr.includes("Service Unavailable")) {
        throw new AIProviderError(AIErrorType.PROVIDER_UNAVAILABLE, 'Gemini API is currently experiencing high demand', error);
      } else {
        throw new AIProviderError(AIErrorType.UNKNOWN, 'Failed to generate structured AI output', error);
      }
    }
  }
};
