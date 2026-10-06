import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, CircularProgress, Alert, Box, Grid } from '@mui/material';

export const Results = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/assessment/results', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch results');
        }
        
        setResults(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <CircularProgress style={{ margin: '2rem' }} />;
  if (error) return <Alert severity="error" style={{ margin: '2rem' }}>{error}</Alert>;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Phase 2 Raw Assessment Results
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="textSecondary">
        Raw per-stage scores from individual assessments (Phase 3 aggregates not included).
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Vocabulary</Typography>
            <Typography variant="h4" color="primary">
              {results.vocabulary !== null ? results.vocabulary : 'N/A'}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Grammar</Typography>
            <Typography variant="h4" color="primary">
              {results.grammar !== null ? results.grammar : 'N/A'}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Technical MCQ</Typography>
            <Typography variant="h4" color="primary">
              {results.technicalMCQ !== null ? results.technicalMCQ : 'N/A'}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Coding Challenge</Typography>
            <Typography variant="h4" color="primary">
              {results.coding !== null ? results.coding : 'N/A'}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Technical Interview</Typography>
            <Typography variant="h5" color="secondary">
              {results.technicalInterview !== null ? results.technicalInterview : 'Pending/Blocked'}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">HR Interview</Typography>
            <Typography variant="h5" color="secondary">
              {results.hrInterview !== null ? results.hrInterview : 'Pending/Blocked'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
