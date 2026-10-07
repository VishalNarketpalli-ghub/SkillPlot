import mongoose from 'mongoose';

// Stores the computed readiness score evidence for a user's simulation run.
// This separates the intelligence layer from raw stage scores stored in Assessment/Interview.
const readinessScoreSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, required: true },

    // Overall weighted readiness score (0–100), deterministically computed
    overallScore: { type: Number, required: true },

    // Breakdown: one entry per stage with raw score, weight, and weighted contribution
    stageBreakdown: [
      {
        stage: { type: String, required: true },      // e.g. 'vocabulary'
        rawScore: { type: Number },                   // raw score from Assessment/Interview
        weight: { type: Number, required: true },     // weight from roleConfig
        weightedScore: { type: Number, required: true }, // rawScore * weight
        maxPossible: { type: Number }                 // 100 * weight
      }
    ],

    // Competency evidence per skill — pulled from all stages
    competencyMap: [
      {
        skill: { type: String },
        evidence: [
          {
            source: { type: String }, // 'resume', 'mcq', 'coding', 'interview'
            score: { type: Number },
            note: { type: String }
          }
        ],
        confidenceLevel: { type: String, enum: ['high', 'medium', 'low'] }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('ReadinessScore', readinessScoreSchema);
