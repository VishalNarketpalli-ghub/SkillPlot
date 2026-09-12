import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const Resume = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [resumeData, setResumeData] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage({ type: '', text: '' });
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first.' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/resume/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Upload failed');

      setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
      setResumeData(data.data);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Card>
        <h2 style={{ marginBottom: '1.5rem' }}>Upload Resume</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Upload your resume (PDF or DOCX format) to start generating your personalized assessment workflow.
        </p>

        {message.text && (
          <div style={{ 
            color: message.type === 'success' ? 'var(--success-color)' : 'var(--error-color)',
            marginBottom: '1rem', padding: '0.75rem', background: 'rgba(0,0,0,0.05)', borderRadius: '6px'
          }}>
            {message.text}
          </div>
        )}

        <div style={{ border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <input 
            type="file" 
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            id="resume-upload"
            style={{ display: 'none' }}
          />
          <label htmlFor="resume-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: '50%' }}>
              📁
            </div>
            <span style={{ color: 'var(--accent-primary)', fontWeight: '500' }}>
              {file ? file.name : 'Click to select or drag and drop'}
            </span>
          </label>
        </div>

        <Button onClick={handleUpload} isLoading={uploading} disabled={!file} style={{ width: '100%' }}>
          Upload & Parse Resume
        </Button>

        {resumeData && (
          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
            <h3>Extracted Information</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              We used AI to structure your resume. Please review the extracted data below.
            </p>
            
            {resumeData.extractedSkills && resumeData.extractedSkills.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Skills</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {resumeData.extractedSkills.map((skill, i) => (
                    <span key={i} style={{ background: 'var(--bg-secondary)', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.875rem' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {resumeData.experience && resumeData.experience.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Experience</h4>
                <ul style={{ paddingLeft: '1.5rem', margin: 0, fontSize: '0.875rem' }}>
                  {resumeData.experience.map((exp, i) => (
                    <li key={i} style={{ marginBottom: '0.5rem' }}>
                      <strong>{exp.role}</strong> at {exp.company} ({exp.duration})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
