import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Company from '../models/Company.js';
import Skill from '../models/Skill.js';
import Prediction from '../models/Prediction.js';
import Roadmap from '../models/Roadmap.js';
import Notification from '../models/Notification.js';

dotenv.config({ path: '../.env' }); // Look in backend directory (running from utils)
// Or fallback to process.env.MONGO_URI if running from backend root
if (!process.env.MONGO_URI) {
  dotenv.config();
}

const seedData = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placementiq');
    console.log('MongoDB Connected for Seeding');

    // Clean current database collections
    console.log('Cleaning collections...');
    await User.deleteMany();
    await Company.deleteMany();
    await Skill.deleteMany();
    await Prediction.deleteMany();
    await Roadmap.deleteMany();
    await Notification.deleteMany();
    console.log('Database cleaned');

    // 1. Seed Skills with Resources
    console.log('Seeding skills...');
    const seededSkills = await Skill.insertMany([
      {
        name: 'Data Structures & Algorithms',
        category: 'DSA',
        description: 'Core programming concepts, complexity analysis, trees, graphs, and dynamic programming.',
        resources: [
          { title: 'LeetCode Top Interview 150', url: 'https://leetcode.com/studyplan/top-interview-150/' },
          { title: 'GeeksforGeeks DSA Self Paced', url: 'https://www.geeksforgeeks.org/data-structures/' }
        ]
      },
      {
        name: 'React',
        category: 'Development',
        description: 'Modern front-end web development with React 19, hooks, state management, and Tailwind CSS.',
        resources: [
          { title: 'React.dev Official Documentation', url: 'https://react.dev' },
          { title: 'Vite Guide', url: 'https://vite.dev' }
        ]
      },
      {
        name: 'Node.js',
        category: 'Development',
        description: 'Backend web development with Express, REST APIs, middleware, and Mongoose.',
        resources: [
          { title: 'Node.js Docs', url: 'https://nodejs.org' },
          { title: 'MDN Web Docs: Express Node.js', url: 'https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs' }
        ]
      },
      {
        name: 'System Design',
        category: 'System Design',
        description: 'Scalability, microservices, load balancing, caching, databases (SQL/NoSQL), and message queues.',
        resources: [
          { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
          { title: 'ByteByteGo System Design', url: 'https://bytebytego.com' }
        ]
      },
      {
        name: 'Aptitude & Reasoning',
        category: 'Aptitude',
        description: 'Quantitative aptitude, logical reasoning, and verbal ability for placement screening tests.',
        resources: [
          { title: 'IndiaBIX Aptitude Questions', url: 'https://www.indiabix.com' }
        ]
      },
      {
        name: 'Machine Learning',
        category: 'ML',
        description: 'Supervised/Unsupervised learning, Python, Scikit-Learn, data preprocessing, and model evaluation.',
        resources: [
          { title: 'Scikit-Learn Getting Started', url: 'https://scikit-learn.org/stable/getting_started.html' }
        ]
      }
    ]);
    console.log(`Seeded ${seededSkills.length} skills`);

    // 2. Seed Companies
    console.log('Seeding companies...');
    const seededCompanies = await Company.insertMany([
      {
        name: 'Google',
        minCGPA: 8.5,
        maxBacklogs: 0,
        requiredSkills: ['Data Structures & Algorithms', 'System Design'],
        branches: ['CSE', 'IT', 'ECE'],
        salary: 35.0,
      },
      {
        name: 'Stripe',
        minCGPA: 8.0,
        maxBacklogs: 0,
        requiredSkills: ['React', 'Node.js'],
        branches: ['CSE', 'IT'],
        salary: 28.0,
      },
      {
        name: 'Vercel',
        minCGPA: 7.5,
        maxBacklogs: 0,
        requiredSkills: ['React', 'Node.js'],
        branches: ['All'],
        salary: 22.5,
      },
      {
        name: 'Infosys',
        minCGPA: 6.0,
        maxBacklogs: 2,
        requiredSkills: ['Aptitude & Reasoning'],
        branches: ['All'],
        salary: 4.5,
      },
      {
        name: 'TCS',
        minCGPA: 6.5,
        maxBacklogs: 2,
        requiredSkills: ['Aptitude & Reasoning'],
        branches: ['All'],
        salary: 4.0,
      }
    ]);
    console.log(`Seeded ${seededCompanies.length} companies`);

    // 3. Seed Users (Admin & Student)
    console.log('Seeding users...');
    
    // Hash password helper
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@placementiq.com',
      password: hashedPassword, // Handled manually since pre-save would double hash if we passed plain password directly (wait, pre-save checks for isModified. We can pass plain password or hashed password, let's pass plain password and let the mongoose pre-save hook hash it! Yes, pre-save will automatically run when User.create() is called. That is cleaner! Let's pass plain text.)
    });
    // Wait, let's rewrite User.create() with plain text so it hashes correctly.
    // Yes! Let's delete the manually hashed password logic to prevent double hashing, and just use the plain text password. Mongoose's create will trigger pre-save.
    await User.deleteMany(); // clean again to be safe
    
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@placementiq.com',
      password: 'password123',
      role: 'admin',
    });

    const student = await User.create({
      name: 'John Doe',
      email: 'student@placementiq.com',
      password: 'password123',
      role: 'student',
      profile: {
        college: 'Apex Engineering College',
        branch: 'CSE',
        collegeTier: 2,
        cgpa: 8.4,
        backlogs: 0,
        codingSkills: {
          dsa: 78,
          communication: 82,
          aptitude: 75,
          systemDesign: 65,
          mlKnowledge: 55,
        },
        internships: 1,
        projects: 2,
        certifications: 3,
        hackathons: 1,
        openSource: 5,
        extracurricular: 2,
      },
    });

    console.log(`Seeded Users: Admin (${admin.email}), Student (${student.email})`);

    // 4. Seed a Sample Prediction for Student
    console.log('Seeding sample prediction...');
    const prediction = await Prediction.create({
      userId: student._id,
      cgpa: student.profile.cgpa,
      backlogs: student.profile.backlogs,
      dsa: student.profile.codingSkills.dsa,
      communication: student.profile.codingSkills.communication,
      aptitude: student.profile.codingSkills.aptitude,
      projects: student.profile.projects,
      internships: student.profile.internships,
      collegeTier: student.profile.collegeTier,
      probability: 0.84,
      prediction: true,
      confidence: 0.89,
      expectedSalary: 8.5,
      skillImportance: {
        cgpa: 0.35,
        dsa: 0.25,
        internships: 0.15,
        communication: 0.10,
        aptitude: 0.10,
        projects: 0.05
      }
    });

    // 5. Seed Roadmap based on student profile (e.g. system design is lower than average)
    console.log('Seeding sample roadmap...');
    await Roadmap.create({
      userId: student._id,
      predictionId: prediction._id,
      steps: [
        {
          title: 'Master System Design Basics',
          description: 'Study caching, load balancing, CDNs, and database scaling. Refer to ByteByteGo.',
          category: 'System Design',
          estimatedWeeks: 3,
          status: 'in_progress',
        },
        {
          title: 'Solve 50 Medium LeetCode Questions',
          description: 'Focus on Trees, Graphs, and Dynamic Programming algorithms.',
          category: 'DSA',
          estimatedWeeks: 4,
          status: 'pending',
        },
        {
          title: 'Complete full-stack Node/Express project',
          description: 'Build a production grade backend with authentication, validation, and testing.',
          category: 'Development',
          estimatedWeeks: 3,
          status: 'completed',
        }
      ]
    });

    // 6. Seed Notifications
    console.log('Seeding sample notifications...');
    await Notification.insertMany([
      {
        userId: student._id,
        title: 'New Placement Prediction Ready',
        message: 'Your placement probability has been calculated. Review your detailed skill gap analysis.',
        type: 'prediction',
        read: false,
      },
      {
        userId: student._id,
        title: 'Roadmap Generated',
        message: 'A personalized career roadmap has been created based on your profile weaknesses.',
        type: 'roadmap',
        read: true,
      }
    ]);

    console.log('Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
