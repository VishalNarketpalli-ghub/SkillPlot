import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, CircularProgress, Alert, Box,
  Chip, Button, Divider, Card, CardContent, List, ListItem, ListItemText
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { useNavigate } from 'react-router-dom';
import { fetchRoadmap } from '../api/intelligence';

const GAP_COLORS = {
  high:   { border: '#c62828', chip_bg: '#ffebee', chip_text: '#c62828' },
  medium: { border: '#e65100', chip_bg: '#fff3e0', chip_text: '#e65100' },
  low:    { border: '#1565c0', chip_bg: '#e3f2fd', chip_text: '#1565c0' },
};

export const Roadmap = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const navigate              = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        const result = await fetchRoadmap(token);
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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8, gap: 2 }}>
      <CircularProgress />
      <Typography color="text.secondary">
        Generating your personalised roadmap… this may take a moment.
      </Typography>
    </Box>
  );

  if (error) return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Alert severity="error">{error}</Alert>
    </Container>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      {/* Header */}
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Personalised Learning Roadmap
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="subtitle1" color="text.secondary">
          Role: <strong>{data.role}</strong>
        </Typography>
        <Chip label={`Readiness: ${data.overallScore}%`} color="primary" size="small" />
      </Box>

      {/* Explainability notice */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f3f8ff', border: '1px solid #bbdefb' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <LightbulbIcon sx={{ color: '#1565c0', mt: 0.2 }} fontSize="small" />
          <Box>
            <Typography variant="body2" fontWeight={600} color="#1565c0">
              How this roadmap was generated
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Skill priorities are determined <strong>deterministically</strong> from your assessment scores and role requirements — not by AI.
              Google Gemini then generates explanations and learning resources for each prioritised skill.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {data.roadmap.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="success.main">🎉 No gaps to address!</Typography>
          <Typography color="text.secondary">Your profile meets all requirements for this role.</Typography>
        </Paper>
      ) : (
        data.roadmap.map((item, idx) => {
          const cfg = GAP_COLORS[item.gapLevel] || GAP_COLORS.low;
          return (
            <Card key={item.skill} elevation={2} sx={{ mb: 3, borderLeft: `5px solid ${cfg.border}` }}>
              <CardContent>
                {/* Skill header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Typography variant="h6" fontWeight={700}>
                    {idx + 1}. {item.skill}
                  </Typography>
                  <Chip
                    label={item.gapLevel + ' priority'}
                    size="small"
                    sx={{ backgroundColor: cfg.chip_bg, color: cfg.chip_text, fontWeight: 600 }}
                  />
                  {item.isRequired && (
                    <Chip label="Required skill" size="small" variant="outlined" />
                  )}
                </Box>

                {/* AI explanation */}
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {item.explanation}
                </Typography>

                {/* Evidence badge */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Evidence sources: {item.evidence?.sources?.join(', ') || 'none'} — {item.evidence?.triggeredBy}
                  </Typography>
                </Box>

                {/* Resources */}
                <Box sx={{ backgroundColor: '#f5f5f5', borderRadius: 2, p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <SchoolIcon fontSize="small" color="action" />
                    <Typography variant="body2" fontWeight={600}>
                      Recommended Learning Resources
                    </Typography>
                  </Box>
                  <List dense disablePadding>
                    {(item.resources || []).map((resource, i) => (
                      <ListItem key={i} disablePadding sx={{ pl: 1 }}>
                        <ListItemText
                          primary={`• ${resource}`}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </CardContent>
            </Card>
          );
        })
      )}

      <Divider sx={{ mt: 4, mb: 3 }} />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="outlined" onClick={() => navigate('/skill-gap')}>
          Back to Skill Gaps
        </Button>
        <Button variant="text" onClick={() => navigate('/readiness')}>
          View Readiness Score
        </Button>
        <Button variant="text" onClick={() => navigate('/dashboard')}>
          Dashboard
        </Button>
      </Box>
    </Container>
  );
};
