import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, CircularProgress, Alert, Box,
  Chip, Accordion, AccordionSummary, AccordionDetails, Button, Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import { fetchSkillGap } from '../api/intelligence';

const GAP_CONFIG = {
  high:   { color: '#c62828', bg: '#ffebee', label: 'High Priority' },
  medium: { color: '#e65100', bg: '#fff3e0', label: 'Medium Priority' },
  low:    { color: '#1565c0', bg: '#e3f2fd', label: 'Low Priority' },
};

const GapSection = ({ level, gaps }) => {
  if (!gaps || gaps.length === 0) return null;
  const cfg = GAP_CONFIG[level];

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Chip
          label={cfg.label}
          sx={{ backgroundColor: cfg.color, color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}
        />
        <Typography variant="body2" color="text.secondary">
          {gaps.length} skill{gaps.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {gaps.map((gap) => (
        <Accordion key={gap.skill} elevation={1} sx={{ mb: 1, borderLeft: `4px solid ${cfg.color}` }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
              <Typography fontWeight={600}>{gap.skill}</Typography>
              {gap.isRequired && (
                <Chip label="Required" size="small" sx={{ backgroundColor: '#e3f2fd', color: '#1565c0' }} />
              )}
              <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto', mr: 1 }}>
                Current confidence: {gap.currentConfidence}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {gap.evidence.length > 0 ? (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Evidence from your simulation:
                </Typography>
                {gap.evidence.map((e, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1, mb: 0.5, alignItems: 'center' }}>
                    <Chip label={e.source} size="small" variant="outlined" />
                    <Typography variant="body2">Score: {e.score} — {e.note}</Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No simulation evidence found for this skill. It was not demonstrated during your assessment.
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export const SkillGap = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const navigate              = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        const result = await fetchSkillGap(token);
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

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      {/* Header */}
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Skill Gap Analysis
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Role: <strong>{data.role}</strong> — {data.totalGaps} actionable gap{data.totalGaps !== 1 ? 's' : ''} identified
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Gaps are classified deterministically by comparing your competency evidence against role requirements.
        No AI is used for gap classification.
      </Typography>

      {data.totalGaps === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="success.main" gutterBottom>🎉 No Skill Gaps Detected!</Typography>
          <Typography color="text.secondary">
            Your competency profile matches all requirements for this role.
          </Typography>
        </Paper>
      ) : (
        <>
          <GapSection level="high"   gaps={data.grouped?.high} />
          <GapSection level="medium" gaps={data.grouped?.medium} />
          <GapSection level="low"    gaps={data.grouped?.low} />
        </>
      )}

      <Divider sx={{ mt: 4, mb: 3 }} />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={() => navigate('/roadmap')}>
          Generate Learning Roadmap
        </Button>
        <Button variant="outlined" onClick={() => navigate('/readiness')}>
          Back to Readiness Score
        </Button>
      </Box>
    </Container>
  );
};
