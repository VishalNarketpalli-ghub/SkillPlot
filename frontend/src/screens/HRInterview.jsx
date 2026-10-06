import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatLog } from '../components/ChatLog';
import { MicrophoneButton } from '../components/MicrophoneButton';
import { Alert, Container, CircularProgress } from '@mui/material';

export function HRInterview() {
  const [history, setHistory] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [interviewId, setInterviewId] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const startSession = async () => {
      try {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role') || 'Software Engineer';
        
        const res = await fetch('http://localhost:5000/api/interview/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ role, type: 'hr' })
        });
        
        const data = await res.json();
        if (data.success) {
          setInterviewId(data.data.interviewId);
          setCurrentQuestion(data.data.question.question);
          setHistory([{ role: 'interviewer', content: data.data.question.question }]);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    startSession();
  }, []);

  const handleSubmit = async () => {
    if (!answer.trim() || submitting) return;
    
    const userAnswerText = answer;
    setAnswer('');
    setSubmitting(true);
    
    setHistory(prev => [...prev, { role: 'candidate', content: userAnswerText }]);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/interview/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          interviewId, 
          questionText: currentQuestion, 
          userAnswer: userAnswerText 
        })
      });
      
      const data = await res.json();
      if (data.success) {
        const nextQ = data.data.nextQuestion;
        if (nextQ) {
          setCurrentQuestion(nextQ.question);
          setHistory(prev => [...prev, { role: 'interviewer', content: nextQ.question }]);
        } else {
          setCompleted(true);
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Initializing HR Interviewer...</div>;
  if (error) return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Alert severity="error">{error}</Alert>
    </Container>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 flex flex-col min-h-[80vh]">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">HR / Behavioral Interview</h2>
      
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col mb-6">
        <div className="flex-1 overflow-y-auto bg-gray-50 p-2">
          <ChatLog history={history} />
        </div>
      </div>

      {!completed ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Answer (STAR Method)</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={submitting}
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-4 resize-none"
            placeholder="Type your answer here, or click the microphone to speak..."
          />
          <div className="flex justify-between items-center">
            <MicrophoneButton onRecord={(isRec) => console.log('Recording:', isRec)} />
            <button
              onClick={handleSubmit}
              disabled={submitting || !answer.trim()}
              className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? <><CircularProgress size={20} color="inherit" /> Evaluating...</> : 'Submit Answer'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold text-green-800 mb-2">Interview Complete</h3>
          <p className="text-green-700 mb-4">You have successfully finished the HR behavioral portion.</p>
          <button
            onClick={() => navigate('/results')}
            className="bg-green-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-green-700"
          >
            Continue to Results
          </button>
        </div>
      )}
    </div>
  );
}
