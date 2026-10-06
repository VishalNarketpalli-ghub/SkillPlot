import Interview from '../models/Interview.js';
import InterviewResponse from '../models/InterviewResponse.js';
import { generateTechnicalQuestion, evaluateTechnicalAnswer, generateHRQuestion, evaluateHRAnswer } from '../services/interviewEngine.js';

export const startInterview = async (req, res, next) => {
  try {
    const { role, skill, type } = req.body;
    if (!role) {
      return res.status(400).json({ success: false, message: 'Role is required' });
    }
    
    const interviewType = type === 'hr' ? 'hr' : 'technical';
    
    if (interviewType === 'technical' && !skill) {
      return res.status(400).json({ success: false, message: 'Skill is required for technical interview' });
    }

    const interview = await Interview.create({
      userId: req.user.id,
      role,
      skill: interviewType === 'technical' ? skill : undefined,
      type: interviewType,
      status: 'in_progress'
    });

    let question;
    if (interviewType === 'hr') {
      question = await generateHRQuestion(role);
    } else {
      question = await generateTechnicalQuestion(role, skill);
    }

    res.status(201).json({
      success: true,
      data: {
        interviewId: interview._id,
        question
      }
    });
  } catch (error) {
    next(error);
  }
};

export const submitInterviewAnswer = async (req, res, next) => {
  try {
    const { interviewId, questionText, userAnswer } = req.body;
    if (!interviewId || !questionText || !userAnswer) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    let evaluation;
    if (interview.type === 'hr') {
      evaluation = await evaluateHRAnswer(questionText, userAnswer);
    } else {
      evaluation = await evaluateTechnicalAnswer(questionText, userAnswer);
    }

    let nextQuestion = evaluation.followUpQuestion;
    
    // Persist response FIRST to ensure aggregation includes it
    const responseRecord = await InterviewResponse.create({
      interviewId,
      questionText,
      userAnswer,
      evaluation: {
        ...evaluation,
        // Only persist the follow-up if we actually allowed it
        followUpQuestion: (nextQuestion && interview.followUpCount < 1) ? nextQuestion : null 
      }
    });

    if (nextQuestion && interview.followUpCount < 1) {
      interview.followUpCount += 1;
      await interview.save();
    } else {
      if (interview.questionCount < 3) {
        interview.questionCount += 1;
        interview.followUpCount = 0; // reset for the new question
        if (interview.type === 'hr') {
          nextQuestion = await generateHRQuestion(interview.role);
        } else {
          nextQuestion = await generateTechnicalQuestion(interview.role, interview.skill);
        }
        await interview.save();
      } else {
        nextQuestion = null; // Interview is over
        
        // Calculate overall score from all persisted responses
        const aggregationResult = await InterviewResponse.aggregate([
          { $match: { interviewId: interview._id } },
          { $group: { _id: null, avgScore: { $avg: '$evaluation.overallScore' } } }
        ]);
        
        let finalScore = 0;
        if (aggregationResult && aggregationResult.length > 0) {
          finalScore = Math.round(aggregationResult[0].avgScore * 10) / 10; // Round to 1 decimal
        }
        
        interview.overallScore = finalScore;
        interview.status = 'completed';
        await interview.save();
      }
    }

    res.status(201).json({
      success: true,
      data: {
        response: responseRecord,
        nextQuestion
      }
    });
  } catch (error) {
    next(error);
  }
};
