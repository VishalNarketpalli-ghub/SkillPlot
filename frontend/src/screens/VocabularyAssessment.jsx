import React, { useState, useEffect } from 'react';
import { AssessmentLayout } from '../components/AssessmentLayout';
import { QuestionCard } from '../components/QuestionCard';
import { generateVocabulary, submitAnswer } from '../api/assessment';
import { useNavigate } from 'react-router-dom';
import { Alert, Container, CircularProgress, Typography } from '@mui/material';

export const VocabularyAssessment = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);
  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('targetRole') || 'Software Engineer';
        const data = await generateVocabulary(role, token);
        setQuestions(data.data);
      } catch (err) {
        setError(err.message || 'Assessment temporarily unavailable due to AI service block');
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleSubmit = async () => {
    const finalAnswer = selectedOption || "unanswered";
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const questionId = questions[currentIndex]._id;
      
      const result = await submitAnswer(questionId, finalAnswer, token);
      console.log("Answer Result:", result);

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(c => c + 1);
        setSelectedOption(null);
      } else {
        setCompleted(true);
        navigate('/grammar');
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
      <Typography variant="h6" color="textSecondary">Generating vocabulary questions (this takes a moment)...</Typography>
    </Container>
  );
  if (error) return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Alert severity="error">{error}</Alert>
    </Container>
  );
  if (completed) return <div style={{ textAlign: 'center', padding: '4rem' }}><h2>Vocabulary Assessment Complete!</h2></div>;
  if (questions.length === 0) return <div>No questions loaded.</div>;

  const currentQ = questions[currentIndex];

  return (
    <AssessmentLayout 
      title="Vocabulary Assessment"
      currentStep={currentIndex + 1}
      totalSteps={questions.length}
      timeLimit={60}
      onTimeExpire={handleSubmit}
    >
      <QuestionCard 
        question={currentQ.text}
        options={currentQ.options}
        selectedOption={selectedOption}
        onSelect={setSelectedOption}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </AssessmentLayout>
  );
};
