import axios from 'axios';
import { getJDoodleConfig } from '../../config/jdoodle.js';

export const jdoodleProvider = {
  execute: async (sourceCode, stdin, language = 'javascript') => {
    const config = getJDoodleConfig();

    if (!config.clientId || !config.clientSecret) {
      return {
        executionSuccess: false,
        compileError: false,
        runtimeError: false,
        timedOut: false,
        stdout: '',
        stderr: '',
        compileOutput: '',
        providerError: {
          type: 'CONFIG_ERROR',
          message: 'JDoodle credentials are not configured.'
        }
      };
    }

    // Map application language to JDoodle format
    let jdoodleLang = 'nodejs';
    let jdoodleVersion = '4'; // A known safe version index for Node in JDoodle

    if (language.toLowerCase() !== 'javascript') {
      return {
        executionSuccess: false,
        compileError: false,
        runtimeError: false,
        timedOut: false,
        stdout: '',
        stderr: '',
        compileOutput: '',
        providerError: {
          type: 'UNSUPPORTED_LANGUAGE',
          message: `Language ${language} is not currently supported.`
        }
      };
    }

    try {
      const response = await axios.post(config.baseURL, {
        script: sourceCode,
        language: jdoodleLang,
        versionIndex: jdoodleVersion,
        stdin: stdin,
        clientId: config.clientId,
        clientSecret: config.clientSecret
      });

      const data = response.data;

      // JDoodle standard response includes: output, statusCode, memory, cpuTime
      // Status code mapping typically: 
      // 200 = Success (execution finished, though might have logical/runtime errors internally depending on output)
      // 401 = Unauthorized
      // 429 = Daily limit reached

      // Normalize into standard execution contract
      // JDoodle captures both stdout and stderr in the `output` field. We don't get distinct stderr from the API directly for Node.js in all cases.
      const rawOutput = data.output || '';
      
      // We can do a basic check. If there's an error message that looks like a runtime error.
      const isRuntimeError = rawOutput.includes('ReferenceError:') || rawOutput.includes('SyntaxError:') || rawOutput.includes('TypeError:');
      const isTimeout = rawOutput.includes('JDoodle - Timeout');

      return {
        executionSuccess: !isRuntimeError && !isTimeout && data.statusCode === 200,
        compileError: false, // Node.js typically throws SyntaxError at runtime for our purposes
        runtimeError: isRuntimeError,
        timedOut: isTimeout,
        stdout: (isRuntimeError || isTimeout) ? '' : rawOutput,
        stderr: isRuntimeError ? rawOutput : (isTimeout ? 'Time Limit Exceeded' : ''),
        compileOutput: '',
        providerError: null
      };
    } catch (error) {
      // Handle HTTP errors or network issues
      const status = error.response?.status;
      
      let type = 'API_ERROR';
      if (status === 401) type = 'AUTH_ERROR';
      else if (status === 429) type = 'QUOTA_EXCEEDED';

      return {
        executionSuccess: false,
        compileError: false,
        runtimeError: false,
        timedOut: false,
        stdout: '',
        stderr: '',
        compileOutput: '',
        providerError: {
          type: type,
          message: error.response?.data?.error || error.message
        }
      };
    }
  }
};
