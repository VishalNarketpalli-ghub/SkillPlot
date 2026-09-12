import User from '../models/User.js';
import Resume from '../models/Resume.js';
import JobDescription from '../models/JobDescription.js';

export const getMatchScore = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.resumeId) {
      return res.status(400).json({ success: false, message: 'No resume found', code: 'NO_RESUME' });
    }

    const resume = await Resume.findById(user.resumeId);
    // Find the latest JD for this user
    const jd = await JobDescription.findOne({ userId: req.user.id }).sort({ createdAt: -1 });

    if (!jd) {
      return res.status(400).json({ success: false, message: 'No job description found', code: 'NO_JD' });
    }

    const resumeSkills = (resume.extractedSkills || []).map(s => s.toLowerCase().trim());
    const requiredSkills = (jd.requiredSkills || []).map(s => s.toLowerCase().trim());
    const preferredSkills = (jd.preferredSkills || []).map(s => s.toLowerCase().trim());
    
    // Deterministic match: keyword overlap
    const targetSkills = [...new Set([...requiredSkills, ...preferredSkills])];
    
    let matchedSkills = [];
    let missingSkills = [];

    targetSkills.forEach(target => {
      // Basic overlap check
      const isMatched = resumeSkills.some(rs => rs.includes(target) || target.includes(rs));
      if (isMatched) {
        matchedSkills.push(target);
      } else {
        missingSkills.push(target);
      }
    });

    const score = targetSkills.length > 0 
      ? Math.round((matchedSkills.length / targetSkills.length) * 100) 
      : 0;

    res.status(200).json({
      success: true,
      data: {
        score,
        matchedSkills,
        missingSkills,
        jobTitle: jd.title
      }
    });

  } catch (error) {
    next(error);
  }
};

export const getWorkflow = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const role = (user.targetRole || 'Software Engineer').toLowerCase();
    
    let workflow = [];
    if (role.includes('frontend') || role.includes('ui')) {
      workflow = ['Resume Review', 'CSS/HTML Quiz', 'React Technical MCQ', 'Frontend Coding Challenge', 'System Design', 'HR Interview'];
    } else if (role.includes('backend') || role.includes('server')) {
      workflow = ['Resume Review', 'Database Query Quiz', 'Node.js Technical MCQ', 'Algorithm Challenge', 'System Design', 'HR Interview'];
    } else {
      workflow = ['Resume Review', 'Vocabulary', 'Grammar', 'Technical MCQ', 'Coding Challenge', 'Technical Interview', 'HR Interview'];
    }

    res.status(200).json({
      success: true,
      data: { workflow, role: user.targetRole }
    });
  } catch (error) {
    next(error);
  }
};
