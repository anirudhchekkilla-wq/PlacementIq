import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    predictionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prediction',
      required: false,
    },
    steps: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: {
          type: String,
          enum: ['DSA', 'Development', 'Aptitude', 'Communication', 'System Design', 'ML'],
          required: true,
        },
        estimatedWeeks: { type: Number, default: 2 },
        status: {
          type: String,
          enum: ['pending', 'in_progress', 'completed'],
          default: 'pending',
        },
      },
    ],
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to automatically calculate progress percentage
roadmapSchema.pre('save', function (next) {
  if (this.steps.length === 0) {
    this.progress = 0;
  } else {
    const completedCount = this.steps.filter((step) => step.status === 'completed').length;
    this.progress = Math.round((completedCount / this.steps.length) * 100);
  }
  next();
});

const Roadmap = mongoose.model('Roadmap', roadmapSchema);
export default Roadmap;
