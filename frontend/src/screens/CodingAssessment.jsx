import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

export function CodingAssessment() {
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role') || 'Software Engineer'; // fallback
        
        const res = await fetch(`http://localhost:5000/api/coding/problem?role=${encodeURIComponent(role)}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await res.json();
        if (data.success) {
          setProblem(data.data);
          setCode(data.data.starterCode);
        } else {
          setError(data.message || 'Failed to fetch problem');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProblem();
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/coding/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          problemId: problem._id,
          code
        })
      });

      const data = await res.json();
      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.message || 'Submission failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
      <CircularProgress size={60} className="mb-4" />
      <h2 className="text-xl text-gray-500 font-medium">Loading coding problem...</h2>
    </div>
  );
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!problem) return <div className="p-8 text-center text-gray-500">No problem found for this role.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8 min-h-screen">
      {/* Left Pane: Problem Description */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{problem.title}</h2>
        <div className="text-sm text-gray-500 mb-6 flex gap-2">
          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded capitalize">{problem.difficulty}</span>
          <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded">{problem.skill}</span>
        </div>
        
        <div className="prose text-gray-700 mb-8 whitespace-pre-wrap">
          {problem.problemStatement}
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-semibold text-gray-700 mb-2">Sample Test Cases</h3>
          {problem.testCases.map((tc, idx) => (
            <div key={idx} className="mb-4 last:mb-0">
              <div className="text-sm font-mono bg-white border border-gray-200 p-2 rounded mb-1 whitespace-pre">
                <span className="text-gray-500">Input:</span> {tc.input}
              </div>
              <div className="text-sm font-mono bg-white border border-gray-200 p-2 rounded whitespace-pre">
                <span className="text-gray-500">Expected:</span> {tc.expectedOutput}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Pane: Code Editor or Results */}
      <div className="flex-1 flex flex-col gap-4">
        {!results ? (
          <>
            <div className="bg-gray-900 rounded-lg flex-1 shadow-lg flex flex-col">
              <div className="bg-gray-800 px-4 py-2 text-gray-300 text-sm font-mono border-b border-gray-700 flex justify-between items-center">
                <span>Editor (JavaScript)</span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={submitting}
                className="w-full h-full min-h-[400px] p-4 bg-gray-900 text-green-400 font-mono text-sm focus:outline-none resize-none disabled:opacity-50"
                spellCheck="false"
              />
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={submitting || !code.trim()}
              className="bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors self-end disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Executing...
                </>
              ) : 'Submit Code'}
            </button>
          </>
        ) : (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex-1 overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Execution Results</h3>
            <div className={`p-4 rounded-lg mb-6 ${results.score === results.total ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-yellow-50 text-yellow-800 border border-yellow-200'}`}>
              <span className="font-semibold text-lg">Passed {results.score} / {results.total} Test Cases</span>
            </div>
            
            <div className="space-y-4">
              {results.results.map((tc, idx) => (
                <div key={idx} className={`p-4 rounded border ${tc.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="font-semibold mb-2 flex justify-between">
                    <span>Test Case {idx + 1}</span>
                    <span className={tc.passed ? 'text-green-600' : 'text-red-600'}>{tc.passed ? 'PASS' : 'FAIL'}</span>
                  </div>
                  <div className="text-sm font-mono mb-1"><span className="text-gray-500">Input:</span> {tc.input}</div>
                  <div className="text-sm font-mono mb-1"><span className="text-gray-500">Expected:</span> {tc.expected}</div>
                  {!tc.passed && (
                    <div className="text-sm font-mono mt-2 pt-2 border-t border-red-100">
                      <span className="text-red-500">Actual/Error:</span> <br/>
                      <pre className="whitespace-pre-wrap mt-1 text-red-700">{tc.actual || tc.error}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <button
              onClick={() => navigate('/interview/technical')}
              className="mt-8 bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 w-full"
            >
              Continue to Technical Interview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
