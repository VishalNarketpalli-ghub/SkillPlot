import mongoose from 'mongoose';

const codingProblemSchema = new mongoose.Schema({
  role: { type: String, required: true },
  skill: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  title: { type: String, required: true },
  problemStatement: { type: String, required: true },
  starterCode: { type: String, required: true },
  testCases: [{
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true }
  }]
}, { timestamps: true });

export default mongoose.model('CodingProblem', codingProblemSchema);
