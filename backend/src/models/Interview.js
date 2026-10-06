import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  skill: { type: String },
  type: { type: String, enum: ['technical', 'hr'], required: true },
  status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
  overallScore: { type: Number },
  followUpCount: { type: Number, default: 0 },
  questionCount: { type: Number, default: 1 }
}, { timestamps: true });

export default mongoose.model('Interview', interviewSchema);
