import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Exclude password by default in queries
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    // Student Profile Fields
    profile: {
      college: { type: String, default: '' },
      branch: { type: String, default: '' },
      collegeTier: { type: Number, enum: [1, 2, 3], default: 3 },
      cgpa: { type: Number, min: 0, max: 10, default: 0 },
      backlogs: { type: Number, min: 0, default: 0 },
      
      // Coding & Technical Skills (Scores out of 100)
      codingSkills: {
        dsa: { type: Number, min: 0, max: 100, default: 0 },
        communication: { type: Number, min: 0, max: 100, default: 0 },
        aptitude: { type: Number, min: 0, max: 100, default: 0 },
        systemDesign: { type: Number, min: 0, max: 100, default: 0 },
        mlKnowledge: { type: Number, min: 0, max: 100, default: 0 },
      },
      
      internships: { type: Number, min: 0, default: 0 },
      projects: { type: Number, min: 0, default: 0 },
      certifications: { type: Number, min: 0, default: 0 },
      hackathons: { type: Number, min: 0, default: 0 },
      openSource: { type: Number, min: 0, default: 0 }, // Contributions count
      extracurricular: { type: Number, min: 0, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
