import React, { useState, useEffect } from 'react';
import { AssessmentLayout } from '../components/AssessmentLayout';
import { QuestionCard } from '../components/QuestionCard';
import { fetchNextMCQ, submitAnswer } from '../api/assessment';
import { useNavigate } from 'react-router-dom';
import { Alert, Container, CircularProgress, Typography } from '@mui/material';

export const TechnicalMCQ = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);
  
  const TOTAL_QUESTIONS = 5;

  const getNextQuestion = async (difficulty, currentCorrectCount, totalAnswered) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('targetRole') || 'Software Engineer';
      const data = await fetchNextMCQ(role, 'System Design', difficulty, currentCorrectCount, totalAnswered, token);
      setCurrentQuestion(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Start session without history (defaults to 'easy')
    getNextQuestion('easy', 0, 0);
  }, []);

  const handleSubmit = async () => {
    const finalAnswer = selectedOption || "unanswered";
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const questionId = currentQuestion._id;
      
      const result = await submitAnswer(questionId, finalAnswer, token);
      console.log("MCQ Answer Result:", result);

      const newCorrectCount = result.data.isCorrect ? correctCount + 1 : correctCount;
      setCorrectCount(newCorrectCount);

      if (currentIndex < TOTAL_QUESTIONS - 1) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setSelectedOption(null);
        // Fetch the NEXT question based on adaptive logic
        await getNextQuestion(currentQuestion.difficulty, newCorrectCount, nextIndex);
      } else {
        setCompleted(true);
        navigate('/coding');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to submit answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return (
    <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
      <CircularProgress size={60} sx={{ mb: 4 }} />
      <Typography variant="h6" color="textSecondary">
        {currentIndex === 0 ? 'Generating your first technical question...' : 'Adapting difficulty... generating next question...'}
      </Typography>
    </Container>
  );
  if (error) return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Alert severity="error">{error}</Alert>
    </Container>
  );
  if (completed) return <div style={{ textAlign: 'center', padding: '4rem' }}><h2>Technical Assessment Complete!</h2></div>;
  if (!currentQuestion) return <div>No question loaded.</div>;

  return (
    <AssessmentLayout 
      title="Technical Multiple Choice"
      currentStep={currentIndex + 1}
      totalSteps={TOTAL_QUESTIONS}
      timeLimit={90} // Technical MCQs get more time
      onTimeExpire={handleSubmit}
    >
      <div style={{ marginBottom: '1rem', fontSize: '0.8rem', color: '#666' }}>
        Current Difficulty: <strong>{currentQuestion.difficulty}</strong>
      </div>
      <QuestionCard 
        question={currentQuestion.text}
        options={currentQuestion.options}
        selectedOption={selectedOption}
        onSelect={setSelectedOption}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </AssessmentLayout>
  );
};
