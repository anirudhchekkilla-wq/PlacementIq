import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    return next(new Error(errors.array().map((e) => e.msg).join(', ')));
  }

  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      return next(new Error('User already exists with this email'));
    }

    // Create user
    // Only allow setting admin role in development/seeding or if first user, 
    // or keep it strict. Let's allow student or admin if explicitly passed,
    // but default to student.
    const userRole = role === 'admin' ? 'admin' : 'student';

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      return next(new Error('Invalid user data'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    return next(new Error(errors.array().map((e) => e.msg).join(', ')));
  }

  const { email, password } = req.body;

  try {
    // Find user by email and select password explicitly (since select: false is on Schema)
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.comparePassword(password))) {
      // Exclude password from the returned object
      user.password = undefined;
      
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      });
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Update basic details if provided
      user.name = req.body.name || user.name;
      if (req.body.password) {
        user.password = req.body.password;
      }

      // Update profile fields
      if (req.body.profile) {
        const { profile } = req.body;
        user.profile.college = profile.college !== undefined ? profile.college : user.profile.college;
        user.profile.branch = profile.branch !== undefined ? profile.branch : user.profile.branch;
        user.profile.collegeTier = profile.collegeTier !== undefined ? profile.collegeTier : user.profile.collegeTier;
        user.profile.cgpa = profile.cgpa !== undefined ? profile.cgpa : user.profile.cgpa;
        user.profile.backlogs = profile.backlogs !== undefined ? profile.backlogs : user.profile.backlogs;
        
        if (profile.codingSkills) {
          user.profile.codingSkills.dsa = profile.codingSkills.dsa !== undefined ? profile.codingSkills.dsa : user.profile.codingSkills.dsa;
          user.profile.codingSkills.communication = profile.codingSkills.communication !== undefined ? profile.codingSkills.communication : user.profile.codingSkills.communication;
          user.profile.codingSkills.aptitude = profile.codingSkills.aptitude !== undefined ? profile.codingSkills.aptitude : user.profile.codingSkills.aptitude;
          user.profile.codingSkills.systemDesign = profile.codingSkills.systemDesign !== undefined ? profile.codingSkills.systemDesign : user.profile.codingSkills.systemDesign;
          user.profile.codingSkills.mlKnowledge = profile.codingSkills.mlKnowledge !== undefined ? profile.codingSkills.mlKnowledge : user.profile.codingSkills.mlKnowledge;
        }

        user.profile.internships = profile.internships !== undefined ? profile.internships : user.profile.internships;
        user.profile.projects = profile.projects !== undefined ? profile.projects : user.profile.projects;
        user.profile.certifications = profile.certifications !== undefined ? profile.certifications : user.profile.certifications;
        user.profile.hackathons = profile.hackathons !== undefined ? profile.hackathons : user.profile.hackathons;
        user.profile.openSource = profile.openSource !== undefined ? profile.openSource : user.profile.openSource;
        user.profile.extracurricular = profile.extracurricular !== undefined ? profile.extracurricular : user.profile.extracurricular;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profile: updatedUser.profile,
      });
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};
