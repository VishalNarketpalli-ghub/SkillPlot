import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Welcome to CareerReady</h2>
        <Button variant="secondary" onClick={handleLogout}>Logout</Button>
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
                  background: 'var(--primary-color)', 
                  color: 'white', 
                  borderRadius: '20px',
                  fontSize: '0.9rem'
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
