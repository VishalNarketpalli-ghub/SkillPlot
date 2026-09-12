import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    storageReference: { type: String, required: true },
    extractedText: { type: String },
    extractedSkills: [{ type: String }],
    education: [{ type: mongoose.Schema.Types.Mixed }],
    projects: [{ type: mongoose.Schema.Types.Mixed }],
    experience: [{ type: mongoose.Schema.Types.Mixed }],
    certifications: [{ type: mongoose.Schema.Types.Mixed }],
    analysis: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

export default mongoose.model('Resume', resumeSchema);
