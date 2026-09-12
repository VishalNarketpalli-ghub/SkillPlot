import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    education: '',
    degree: '',
    branch: '',
    graduationYear: '',
    skills: '',
    targetRole: '',
    experienceLevel: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok) {
        setFormData({
          name: data.data.name || '',
          education: data.data.education || '',
          degree: data.data.degree || '',
          branch: data.data.branch || '',
          graduationYear: data.data.graduationYear || '',
          skills: data.data.skills ? data.data.skills.join(', ') : '',
          targetRole: data.data.targetRole || '',
          experienceLevel: data.data.experienceLevel || ''
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/users/me', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to update profile');
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Card>
        <h2 style={{ marginBottom: '1.5rem' }}>Your Profile</h2>
        {message.text && (
          <div style={{ 
            color: message.type === 'success' ? 'var(--success-color)' : 'var(--error-color)',
            marginBottom: '1rem', padding: '0.75rem', background: 'rgba(0,0,0,0.05)', borderRadius: '6px'
          }}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input id="name" label="Full Name" value={formData.name} onChange={handleChange} required />
          <Input id="education" label="University/College" value={formData.education} onChange={handleChange} />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Input id="degree" label="Degree (e.g., B.Tech)" value={formData.degree} onChange={handleChange} className="flex-1" />
            <Input id="branch" label="Branch (e.g., CSE)" value={formData.branch} onChange={handleChange} className="flex-1" />
          </div>
          <Input id="graduationYear" label="Graduation Year" type="number" value={formData.graduationYear} onChange={handleChange} />
          <Input id="skills" label="Skills (comma separated)" value={formData.skills} onChange={handleChange} />
          <Input id="targetRole" label="Target Role (e.g., Frontend Developer)" value={formData.targetRole} onChange={handleChange} />
          <Input id="experienceLevel" label="Experience Level (Fresher / 1-3 Yrs / 3+ Yrs)" value={formData.experienceLevel} onChange={handleChange} />
          
          <Button type="submit" isLoading={saving} style={{ marginTop: '1rem' }}>Save Profile</Button>
        </form>
      </Card>
    </div>
  );
};
