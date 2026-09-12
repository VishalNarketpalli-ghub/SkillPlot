import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

export const JobDescription = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setMessage({ type: 'error', text: 'Please paste a job description.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/job-description/analyze', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ jobDescription })
      });
      
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Analysis request failed');

      setMessage({ type: 'success', text: 'Job description saved successfully! Proceeding to Analysis...' });
      setTimeout(() => navigate('/analysis'), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <h2 style={{ marginBottom: '1.5rem' }}>Analyze Job Description</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Paste the target job description here. We will analyze the gap between your parsed resume and this role.
        </p>

        {message.text && (
          <div style={{ 
            color: message.type === 'success' ? 'var(--success-color)' : 'var(--error-color)',
            marginBottom: '1rem', padding: '0.75rem', background: 'rgba(0,0,0,0.05)', borderRadius: '6px'
          }}>
            {message.text}
          </div>
        )}

        <textarea 
          style={{
            width: '100%',
            minHeight: '300px',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            resize: 'vertical',
            marginBottom: '1.5rem',
            fontFamily: 'inherit'
          }}
          placeholder="Paste Job Description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleAnalyze} isLoading={loading}>
            Save & Analyze
          </Button>
        </div>
      </Card>
    </div>
  );
};
