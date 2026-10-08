import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState([]);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/analysis/workflow', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        
        if (res.ok) {
          setWorkflow(result.data.workflow);
          setRole(result.data.role);
        }
      } catch (err) {
        console.error("Failed to fetch workflow:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkflow();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2>Welcome to CareerReady</h2>
      </div>
      
      <Card>
        <h3>Your Personalized Workflow {role ? `for ${role}` : ''}</h3>
        {loading ? (
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading workflow...</p>
        ) : workflow.length > 0 ? (
          <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            {workflow.map((step, idx) => (
              <React.Fragment key={idx}>
                <div style={{ 
                  padding: '0.5rem 1rem', 
                  background: 'var(--accent-bg, rgba(99, 102, 241, 0.15))', 
                  color: 'var(--accent-primary, #4f46e5)', 
                  border: '1px solid var(--accent-hover, #6366f1)',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}>
                  {step}
                </div>
                {idx < workflow.length - 1 && <span style={{ color: 'var(--text-secondary)' }}>→</span>}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
            Upload your resume and a job description to generate your personalized readiness workflow.
          </p>
        )}
        
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <Button onClick={() => navigate('/resume')}>Update Resume</Button>
          <Button variant="secondary" onClick={() => navigate('/job-description')}>New Job Description</Button>
          <Button variant="secondary" onClick={() => navigate('/analysis')}>View Analysis Score</Button>
        </div>
      </Card>
    </div>
  );
};
