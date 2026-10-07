import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, CircularProgress, Alert, Box,
  LinearProgress, Chip, Grid, Divider, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchReadinessScore } from '../api/intelligence';

// Colour map for readiness band
const scoreBandColor = (score) => {
  if (score >= 75) return '#2e7d32'; // green
  if (score >= 50) return '#f57c00'; // orange
  return '#c62828';                  // red
};

const scoreBandLabel = (score) => {
  if (score >= 75) return 'Strong';
  if (score >= 50) return 'Developing';
  return 'Needs Work';
};

const STAGE_LABELS = {
  vocabulary:         'Vocabulary',
  grammar:            'Grammar',
  technicalMCQ:       'Technical MCQ',
  coding:             'Coding Challenge',
  technicalInterview: 'Technical Interview',
  hrInterview:        'HR Interview',
};

export const ReadinessScore = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const navigate              = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        const result = await fetchReadinessScore(token);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Alert severity="error">{error}</Alert>
    </Container>
  );

  const color = scoreBandColor(data.overallScore);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      {/* Header */}
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Career Readiness Score
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Target Role: <strong>{data.role}</strong>
      </Typography>

      {/* Overall Score Card */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: 'center', borderTop: `6px solid ${color}` }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Overall Readiness
        </Typography>
        <Typography variant="h2" fontWeight={800} sx={{ color }}>
          {data.overallScore}%
        </Typography>
        <Chip
          label={scoreBandLabel(data.overallScore)}
          sx={{ mt: 1, backgroundColor: color, color: '#fff', fontWeight: 600 }}
        />
        <Box sx={{ mt: 3 }}>
          <LinearProgress
            variant="determinate"
            value={data.overallScore}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': { backgroundColor: color, borderRadius: 6 },
            }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Score computed deterministically from weighted stage scores. AI is not used in this calculation.
        </Typography>
      </Paper>

      {/* Stage Breakdown */}
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Stage Breakdown
      </Typography>
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        {(data.stageBreakdown || []).map((stage) => (
          <Box key={stage.stage} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body1">
                {STAGE_LABELS[stage.stage] || stage.stage}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Raw: {stage.rawScore ?? '—'} | Weight: {(stage.weight * 100).toFixed(0)}% |{' '}
                Contribution: <strong>{stage.weightedScore.toFixed(1)}</strong> / {stage.maxPossible.toFixed(1)}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={stage.rawScore ?? 0}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        ))}
      </Paper>

      {/* Competency Map */}
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Competency Profile
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {(data.competencyMap || []).map((item) => (
          <Grid item xs={12} sm={6} key={item.skill}>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                borderLeft: `4px solid ${
                  item.confidenceLevel === 'high'   ? '#2e7d32' :
                  item.confidenceLevel === 'medium' ? '#f57c00' : '#c62828'
                }`,
              }}
            >
              <Typography variant="body1" fontWeight={600}>{item.skill}</Typography>
              <Chip
                label={item.confidenceLevel}
                size="small"
                sx={{
                  mt: 0.5,
                  backgroundColor:
                    item.confidenceLevel === 'high'   ? '#e8f5e9' :
                    item.confidenceLevel === 'medium' ? '#fff3e0' : '#ffebee',
                  color:
                    item.confidenceLevel === 'high'   ? '#2e7d32' :
                    item.confidenceLevel === 'medium' ? '#e65100' : '#b71c1c',
                  fontWeight: 600,
                }}
              />
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                Evidence: {item.evidence.map((e) => e.source).join(', ') || 'None'}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Actions */}
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={() => navigate('/skill-gap')}>
          View Skill Gaps
        </Button>
        <Button variant="outlined" onClick={() => navigate('/roadmap')}>
          Generate Roadmap
        </Button>
        <Button variant="text" onClick={() => navigate('/results')}>
          Back to Raw Results
        </Button>
      </Box>
    </Container>
  );
};
