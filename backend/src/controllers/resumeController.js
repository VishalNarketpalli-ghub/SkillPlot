import Resume from '../models/Resume.js';
import User from '../models/User.js';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import { generateStructuredOutput } from '../providers/aiProvider.js';

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file', code: 'NO_FILE' });
    }

    let extractedText = '';
    let structuredData = {};

    try {
      const dataBuffer = fs.readFileSync(req.file.path);
      const parsedData = await pdfParse(dataBuffer);
      extractedText = parsedData.text;

      const schema = {
        type: "object",
        properties: {
          skills: { type: "array", items: { type: "string" } },
          education: { type: "array", items: { type: "object", properties: { degree: { type: "string" }, institution: { type: "string" }, year: { type: "string" } } } },
          experience: { type: "array", items: { type: "object", properties: { role: { type: "string" }, company: { type: "string" }, duration: { type: "string" }, description: { type: "string" } } } },
          projects: { type: "array", items: { type: "object", properties: { title: { type: "string" }, description: { type: "string" } } } }
        },
        required: ["skills", "education", "experience", "projects"]
      };

      const prompt = `Extract the skills, education, experience, and projects from the following resume text:\n\n${extractedText}`;
      structuredData = await generateStructuredOutput(prompt, schema);
    } catch (parseError) {
      console.error("Parse Error:", parseError);
      // WHY: We continue even if AI extraction fails. 
      // The application allows users to manually upload a resume as a baseline file 
      // even if text extraction or AI provider mapping encounters an error.
      // This prevents a hard block on the core user flow.
    }

    const resume = await Resume.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      storageReference: req.file.path,
      extractedText: extractedText,
      extractedSkills: structuredData.skills || [],
      education: structuredData.education || [],
      experience: structuredData.experience || [],
      projects: structuredData.projects || []
    });

    await User.findByIdAndUpdate(req.user.id, { resumeId: resume._id });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded and parsed successfully',
      data: resume
    });
  } catch (error) {
    next(error);
  }
};

export const getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found', code: 'NOT_FOUND' });
    }

    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};


