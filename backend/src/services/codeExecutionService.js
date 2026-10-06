import { jdoodleProvider } from './providers/jdoodleProvider.js';

const getExecutionProvider = () => {
  const providerName = process.env.CODE_EXECUTION_PROVIDER || 'jdoodle';
  
  if (providerName === 'jdoodle') {
    return jdoodleProvider;
  }
  
  // Future provider integration would go here:
  // if (providerName === 'judge0') { return judge0Provider; }

  throw new Error(`Execution provider '${providerName}' is not supported.`);
};

export const executeCode = async (sourceCode, stdin, language = 'javascript') => {
  const provider = getExecutionProvider();
  return await provider.execute(sourceCode, stdin, language);
};
