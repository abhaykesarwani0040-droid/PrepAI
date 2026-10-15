const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  type: { type: String, enum: ['Technical', 'HR'], required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  status: { type: String, enum: ['In-Progress', 'Completed'], default: 'In-Progress' },
  questions: [{
    questionText: { type: String, required: true },
    userAnswer: { type: String },
    evaluation: {
      score: { type: Number, min: 0, max: 100 },
      correctness: { type: String },
      strengths: { type: String },
      missingPoints: { type: String },
      improvementSuggestions: { type: String },
      sampleAnswer: { type: String }
    }
  }],
  overallScore: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
