import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
  interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview', required: true },
  questionText: { type: String, required: true },
  userAnswer: { type: String, required: true },
  evaluation: {
    technicalCorrectness: Number,
    relevance: Number,
    completeness: Number,
    communication: Number,
    overallScore: Number,
    strengths: [String],
    weaknesses: [String],
    feedback: String,
    followUpQuestion: String
  }
}, { timestamps: true });

export default mongoose.model('InterviewResponse', responseSchema);
