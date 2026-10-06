import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ['vocabulary', 'grammar', 'mcq'], required: true },
  role: { type: String, required: true },
  skill: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String }
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);
