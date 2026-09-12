import JobDescription from '../models/JobDescription.js';
import User from '../models/User.js';
import { generateStructuredOutput } from '../utils/gemini.js';

export const analyzeJD = async (req, res, next) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ success: false, message: 'Please provide a job description', code: 'VALIDATION_ERROR' });
    }

    const user = await User.findById(req.user.id);
    if (!user.resumeId) {
      return res.status(400).json({ success: false, message: 'Please upload a resume first', code: 'NO_RESUME' });
    }

    const schema = {
      type: "object",
      properties: {
        title: { type: "string" },
        company: { type: "string" },
        requiredSkills: { type: "array", items: { type: "string" } },
        preferredSkills: { type: "array", items: { type: "string" } },
        experienceRequirements: { type: "string" },
        technicalRequirements: { type: "array", items: { type: "string" } },
        competencies: { type: "array", items: { type: "string" } }
      },
      required: ["requiredSkills", "preferredSkills"]
    };

    const prompt = `Extract the title, company, required skills, preferred skills, experience requirements, technical requirements, and competencies from the following job description:\n\n${jobDescription}`;
    
    let structuredData = {};
    try {
      structuredData = await generateStructuredOutput(prompt, schema);
    } catch (parseError) {
      console.error("Gemini JD Parse Error:", parseError);
      return res.status(500).json({ success: false, message: 'Failed to analyze job description with AI', code: 'AI_ERROR' });
    }

    const jd = await JobDescription.create({
      userId: req.user.id,
      rawText: jobDescription,
      title: structuredData.title || 'Untitled Role',
      company: structuredData.company || 'Unknown Company',
      requiredSkills: structuredData.requiredSkills || [],
      preferredSkills: structuredData.preferredSkills || [],
      experienceRequirements: structuredData.experienceRequirements || '',
      technicalRequirements: structuredData.technicalRequirements || [],
      competencies: structuredData.competencies || []
    });

    res.status(201).json({
      success: true,
      message: 'Job description analyzed and saved successfully',
      data: jd
    });
  } catch (error) {
    next(error);
  }
};
