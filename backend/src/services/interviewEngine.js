import { generateStructuredOutput } from '../providers/aiProvider.js';
import { generateInterviewQuestionPrompt, generateHRQuestionPrompt, interviewEvaluationSchema, hrEvaluationSchema } from '../prompts/interviewPrompts.js';

export const generateTechnicalQuestion = async (role, skill) => {
  const prompt = generateInterviewQuestionPrompt(role, skill);
  // WHY: We enforce a strictly structural { question: "" } JSON output here 
  // so the frontend client can parse it identically across questions.
  const schema = {
    type: "object",
    properties: {
      question: { type: "string" }
    },
    required: ["question"]
  };
  
  const result = await generateStructuredOutput(prompt, schema);
  return result.question;
};

export const generateHRQuestion = async (role) => {
  const prompt = generateHRQuestionPrompt(role);
  const schema = {
    type: "object",
    properties: {
      question: { type: "string" }
    },
    required: ["question"]
  };
  
  const result = await generateStructuredOutput(prompt, schema);
  return result.question;
};

export const evaluateTechnicalAnswer = async (question, answer) => {
  const prompt = `
${interviewEvaluationSchema}

Question asked: "${question}"
Candidate's answer: "${answer}"

Please evaluate this answer according to the schema.
`;
  
  const schema = {
    type: "object",
    properties: {
      technicalCorrectness: { type: "number" },
      relevance: { type: "number" },
      completeness: { type: "number" },
      communication: { type: "number" },
      overallScore: { type: "number" },
      strengths: { type: "array", items: { type: "string" } },
      weaknesses: { type: "array", items: { type: "string" } },
      feedback: { type: "string" },
      followUpQuestion: { type: "string" }
    },
    required: ["technicalCorrectness", "relevance", "completeness", "communication", "overallScore", "strengths", "weaknesses", "feedback"]
  };
  
  const result = await generateStructuredOutput(prompt, schema);
  return result;
};

export const evaluateHRAnswer = async (question, answer) => {
  const prompt = `
${hrEvaluationSchema}

Question asked: "${question}"
Candidate's answer: "${answer}"

Please evaluate this answer according to the schema.
`;
  
  const schema = {
    type: "object",
    properties: {
      situation: { type: "number" },
      action: { type: "number" },
      result: { type: "number" },
      clarity: { type: "number" },
      professionalism: { type: "number" },
      overallScore: { type: "number" },
      strengths: { type: "array", items: { type: "string" } },
      weaknesses: { type: "array", items: { type: "string" } },
      feedback: { type: "string" },
      followUpQuestion: { type: "string" }
    },
    required: ["situation", "action", "result", "clarity", "professionalism", "overallScore", "strengths", "weaknesses", "feedback"]
  };
  
  const result = await generateStructuredOutput(prompt, schema);
  return result;
};
