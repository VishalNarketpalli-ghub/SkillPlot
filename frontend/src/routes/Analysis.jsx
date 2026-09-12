import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

export const Analysis = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/analysis/match', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        
        if (!res.ok) throw new Error(result.message || 'Failed to fetch analysis');
        
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading analysis...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'var(--error-color)' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Resume Match Analysis</h2>
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>

      <Card>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Match Score for {data.jobTitle || 'Target Role'}</h3>
          <div style={{ 
            fontSize: '4rem', 
            fontWeight: 'bold', 
            color: data.score >= 70 ? 'var(--success-color)' : (data.score >= 40 ? '#f59e0b' : 'var(--error-color)')
          }}>
            {data.score}%
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h4 style={{ color: 'var(--success-color)', marginBottom: '1rem' }}>Matched Skills</h4>
            {data.matchedSkills && data.matchedSkills.length > 0 ? (
              <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
                {data.matchedSkills.map((skill, i) => <li key={i}>{skill}</li>)}
              </ul>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No matched skills found.</p>
            )}
          </div>
          <div>
            <h4 style={{ color: 'var(--error-color)', marginBottom: '1rem' }}>Missing Skills</h4>
            {data.missingSkills && data.missingSkills.length > 0 ? (
              <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
                {data.missingSkills.map((skill, i) => <li key={i}>{skill}</li>)}
              </ul>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No missing skills! You're a perfect match.</p>
            )}
          </div>
        </div>
      </Card>
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button onClick={() => navigate('/dashboard')}>View Personalized Workflow</Button>
      </div>
    </div>
  );
};
