import Question from '../models/Question.js';
import { generateStructuredOutput } from '../providers/aiProvider.js';
import { getNextDifficulty } from '../services/adaptiveEngine.js';
import { generateVocabularyPrompt, generateGrammarPrompt, generateMCQPrompt } from '../prompts/assessmentPrompts.js';

export const generateVocabulary = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ success: false, message: 'Role is required' });
    }

    const prompt = generateVocabularyPrompt(role);
    const questionsData = await generateStructuredOutput(prompt);

    if (!Array.isArray(questionsData)) {
      return res.status(500).json({ success: false, message: 'Invalid AI output format' });
    }

    const questionsToSave = questionsData.map(q => ({
      ...q,
      type: 'vocabulary',
      role,
      skill: 'vocabulary'
    }));
    
    const savedQuestions = await Question.insertMany(questionsToSave);
    res.status(201).json({ success: true, data: savedQuestions });
  } catch (error) {
    next(error);
  }
};

export const generateGrammar = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role) return res.status(400).json({ success: false, message: 'Role is required' });

    const prompt = generateGrammarPrompt(role);
    const questionsData = await generateStructuredOutput(prompt);

    if (!Array.isArray(questionsData)) {
      return res.status(500).json({ success: false, message: 'Invalid AI output format' });
    }

    const questionsToSave = questionsData.map(q => ({
      ...q,
      type: 'grammar',
      role,
      skill: 'grammar'
    }));
    
    const savedQuestions = await Question.insertMany(questionsToSave);
    res.status(201).json({ success: true, data: savedQuestions });
  } catch (error) {
    next(error);
  }
};

export const submitAnswer = async (req, res, next) => {
  try {
    const { questionId, userAnswer } = req.body;
    
    if (!questionId || userAnswer === undefined) {
      return res.status(400).json({ success: false, message: 'Missing questionId or userAnswer' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    // WHY: Deterministic scoring prevents AI hallucination. We rely on strict
    // case-insensitive string equality to match the answer.
    const isCorrect = userAnswer === "unanswered" ? false : question.correctAnswer.toLowerCase().trim() === userAnswer.toLowerCase().trim();

    res.status(200).json({
      success: true,
      data: {
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation
      }
    });
  } catch (error) {
    next(error);
  }
};

export const generateMCQ = async (req, res, next) => {
  try {
    const { role, skill, difficulty } = req.body;
    if (!role || !skill || !difficulty) {
      return res.status(400).json({ success: false, message: 'Role, skill, and difficulty are required' });
    }

    const prompt = generateMCQPrompt(role, skill, difficulty);
    const questionsData = await generateStructuredOutput(prompt);

    if (!Array.isArray(questionsData)) {
      return res.status(500).json({ success: false, message: 'Invalid AI output format' });
    }

    const questionsToSave = questionsData.map(q => ({
      ...q,
      type: 'mcq',
      role,
      skill,
      difficulty
    }));
    
    const savedQuestions = await Question.insertMany(questionsToSave);
    res.status(201).json({ success: true, data: savedQuestions });
  } catch (error) {
    next(error);
  }
};

export const generateNextMCQ = async (req, res, next) => {
  try {
    const { role, skill, currentDifficulty, correctCount, totalAnswered } = req.body;
    
    if (!role || !skill || !currentDifficulty || correctCount === undefined || totalAnswered === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    if (typeof correctCount !== 'number' || typeof totalAnswered !== 'number' || correctCount < 0 || totalAnswered < 0 || correctCount > totalAnswered) {
      return res.status(400).json({ success: false, message: 'Invalid adaptive metrics' });
    }

    const nextDifficulty = getNextDifficulty(correctCount, totalAnswered, currentDifficulty);
    const prompt = generateMCQPrompt(role, skill, nextDifficulty, 1);
    const questionsData = await generateStructuredOutput(prompt);

    if (!Array.isArray(questionsData) || questionsData.length === 0) {
      return res.status(500).json({ success: false, message: 'Invalid AI output format' });
    }

    const questionToSave = {
      ...questionsData[0],
      type: 'mcq',
      role,
      skill,
      difficulty: nextDifficulty
    };
    
    const savedQuestion = await Question.create(questionToSave);
    res.status(201).json({ success: true, data: savedQuestion });
  } catch (error) {
    next(error);
  }
};

import Assessment from '../models/Assessment.js';
import Interview from '../models/Interview.js';

export const getResults = async (req, res, next) => {
  try {
    const assessments = await Assessment.find({ userId: req.user.id });
    const interviews = await Interview.find({ userId: req.user.id });
    
    // Process raw scores
    const results = {
      vocabulary: null,
      grammar: null,
      technicalMCQ: null,
      coding: null,
      technicalInterview: null,
      hrInterview: null
    };

    assessments.forEach(a => {
      if (a.type === 'VOCABULARY') results.vocabulary = a.score;
      if (a.type === 'GRAMMAR') results.grammar = a.score;
      if (a.type === 'TECHNICAL_MCQ') results.technicalMCQ = a.score;
      if (a.type === 'CODING') results.coding = a.score;
    });

    interviews.forEach(i => {
      if (i.type === 'technical' && i.status === 'completed') {
        results.technicalInterview = i.overallScore !== undefined ? i.overallScore : null;
      }
      if (i.type === 'hr' && i.status === 'completed') {
        results.hrInterview = i.overallScore !== undefined ? i.overallScore : null;
      }
    });

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};
