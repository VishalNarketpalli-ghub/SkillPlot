import { GoogleGenerativeAI } from '@google/generative-ai';

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
  try {
    const ai = getGenAI();
    const model = ai.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error('Failed to generate structured AI output');
  }
};
