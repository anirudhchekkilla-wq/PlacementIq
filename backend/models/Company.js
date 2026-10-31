import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      unique: true,
    },
    minCGPA: {
      type: Number,
      required: [true, 'Minimum CGPA is required'],
      min: 0,
      max: 10,
    },
    maxBacklogs: {
      type: Number,
      required: [true, 'Maximum backlog limit is required'],
      default: 0,
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    branches: {
      type: [String], // Eligible branches (e.g. CSE, IT, ECE)
      default: ['All'],
    },
    salary: {
      type: Number, // in LPA
      required: [true, 'Expected package/salary package is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model('Company', companySchema);
export default Company;
