import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Snapshot of parameters used for prediction
    cgpa: { type: Number, required: true },
    backlogs: { type: Number, required: true },
    dsa: { type: Number, required: true },
    communication: { type: Number, required: true },
    aptitude: { type: Number, required: true },
    projects: { type: Number, required: true },
    internships: { type: Number, required: true },
    collegeTier: { type: Number, required: true },
    
    // ML Results
    probability: {
      type: Number,
      required: true,
    },
    prediction: {
      type: Boolean, // true = Placed, false = Not Placed
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
    },
    expectedSalary: {
      type: Number, // in LPA
      required: true,
    },
    skillImportance: {
      type: Map,
      of: Number, // Maps features (cgpa, dsa, etc.) to importance values
    },
  },
  {
    timestamps: true,
  }
);

const Prediction = mongoose.model('Prediction', predictionSchema);
export default Prediction;
