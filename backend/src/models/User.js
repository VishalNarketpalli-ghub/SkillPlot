import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    education: { type: String },
    degree: { type: String },
    branch: { type: String },
    graduationYear: { type: Number },
    skills: [{ type: String }],
    targetRole: { type: String },
    experienceLevel: { type: String },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
    personalityProfileId: { type: mongoose.Schema.Types.ObjectId }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
