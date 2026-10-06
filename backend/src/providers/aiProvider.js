import { generateStructuredOutput as geminiGenerateStructuredOutput } from '../utils/gemini.js';
import { AIProviderError, AIErrorType } from '../utils/aiErrors.js';

export const generateStructuredOutput = async (prompt, schema) => {
  const provider = process.env.AI_PROVIDER || 'gemini';

  if (provider === 'gemini') {
    return await geminiGenerateStructuredOutput(prompt, schema);
  }

  // Future providers (e.g., grok) would be added here
  
  throw new AIProviderError(
    AIErrorType.UNKNOWN,
    `Unsupported AI_PROVIDER configuration: ${provider}`
  );
};
