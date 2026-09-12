import mongoose from 'mongoose';

// Phase 2 Draft Schema Stub
const assessmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { 
      type: String, 
      enum: ['VOCABULARY', 'GRAMMAR', 'TECHNICAL_MCQ', 'CODING', 'TECHNICAL_INTERVIEW', 'HR_INTERVIEW'],
      required: true 
    },
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
      default: 'PENDING'
    },
    score: { type: Number },
    details: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.model('Assessment', assessmentSchema);
