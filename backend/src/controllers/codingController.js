import CodingProblem from '../models/CodingProblem.js';
import Assessment from '../models/Assessment.js';
import { executeCode } from '../services/codeExecutionService.js';

export const getProblem = async (req, res, next) => {
  try {
    const { role } = req.query;
    if (!role) {
      return res.status(400).json({ success: false, message: 'Role is required' });
    }
    
    // Find a random problem for the role (for now just grab first)
    const problem = await CodingProblem.findOne({ role });
    if (!problem) {
      return res.status(404).json({ success: false, message: 'No coding problems found for this role' });
    }
    
    res.status(200).json({ success: true, data: problem });
  } catch (error) {
    next(error);
  }
};

export const submitCode = async (req, res, next) => {
  try {
    const { problemId, code } = req.body;
    if (!problemId || !code) {
      return res.status(400).json({ success: false, message: 'Missing problemId or code' });
    }

    const problem = await CodingProblem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    let passedCount = 0;
    const totalCount = problem.testCases.length;
    const results = [];

    // WHY: Run test cases sequentially to avoid rate limiting on free tiers
    // and correctly handle errors per individual test case
    for (const tc of problem.testCases) {
      const output = await executeCode(code, tc.input, 'javascript');
      
      if (output.providerError) {
        return res.status(503).json({
          success: false,
          message: `Code execution provider unavailable: ${output.providerError.message}`
        });
      }

      const stdout = (output.stdout || '').trim();
      const expected = tc.expectedOutput.trim();
      
      const passed = output.executionSuccess && stdout === expected;
      if (passed) passedCount++;
      
      let errorMsg = output.stderr || output.compileOutput || '';
      if (!passed && !errorMsg && !output.executionSuccess) {
        if (output.timedOut) {
          errorMsg = 'Time Limit Exceeded';
        } else {
          errorMsg = 'Execution Failed';
        }
      }
      
      results.push({
        input: tc.input,
        expected,
        actual: stdout,
        passed,
        error: errorMsg
      });
    }

    // Persist the submission score
    await Assessment.create({
      userId: req.user.id,
      type: 'CODING',
      status: 'COMPLETED',
      score: passedCount,
      details: {
        problemId,
        totalCount,
        results
      }
    });

    res.status(200).json({
      success: true,
      data: {
        score: passedCount,
        total: totalCount,
        results
      }
    });
  } catch (error) {
    next(error);
  }
};
