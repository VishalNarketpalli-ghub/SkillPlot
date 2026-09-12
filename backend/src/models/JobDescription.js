import mongoose from 'mongoose';

const jobDescriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'Untitled Role' },
    company: { type: String, default: 'Unknown Company' },
    rawText: { type: String, required: true },
    requiredSkills: [{ type: String }],
    preferredSkills: [{ type: String }],
    experienceRequirements: { type: String },
    technicalRequirements: [{ type: String }],
    competencies: [{ type: String }],
    analysis: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

export default mongoose.model('JobDescription', jobDescriptionSchema);
