import Roadmap from '../models/Roadmap.js';
import Prediction from '../models/Prediction.js';
import Notification from '../models/Notification.js';

// @desc    Generate personalized roadmap based on weaknesses
// @route   POST /api/roadmap
// @access  Private
export const generateRoadmap = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Retrieve latest prediction
    const latestPrediction = await Prediction.findOne({ userId }).sort({ createdAt: -1 });

    if (!latestPrediction) {
      res.status(400);
      return next(new Error('Please run a placement prediction first to analyze weaknesses'));
    }

    // Check if roadmap already exists for this prediction, or recreate
    let roadmap = await Roadmap.findOne({ userId });
    
    // Define steps array based on weaknesses
    const steps = [];

    // 1. DSA Weakness
    if (latestPrediction.dsa < 75) {
      steps.push({
        title: 'Master Data Structures & Algorithms',
        description: 'Focus on recursion, binary trees, graph theory, and dynamic programming. Solve 100+ LeetCode problems.',
        category: 'DSA',
        estimatedWeeks: 4,
        status: 'pending',
      });
    }

    // 2. Aptitude Weakness
    if (latestPrediction.aptitude < 75) {
      steps.push({
        title: 'Improve Quantitative & Logical Aptitude',
        description: 'Practice time & work, probability, percentages, and blood relations. Work through worksheets on IndiaBIX.',
        category: 'Aptitude',
        estimatedWeeks: 3,
        status: 'pending',
      });
    }

    // 3. Communication/Soft Skills Weakness
    if (latestPrediction.communication < 75) {
      steps.push({
        title: 'Advance English & Technical Communication',
        description: 'Practice describing your projects clearly. Complete 10 mock interviews focusing on behavioral responses.',
        category: 'Communication',
        estimatedWeeks: 2,
        status: 'pending',
      });
    }

    // 4. Project Experience Weakness
    if (latestPrediction.projects < 2) {
      steps.push({
        title: 'Build a Full-Stack MERN Portfolio Project',
        description: 'Create a complete web application with React, Node/Express, and MongoDB. Implement user auth and clean styling.',
        category: 'Development',
        estimatedWeeks: 4,
        status: 'pending',
      });
    }

    // 5. Work Experience Weakness
    if (latestPrediction.internships < 1) {
      steps.push({
        title: 'Apply for Internships & Open Source',
        description: 'Apply for front-end or back-end internship roles. Contribute to 3 open-source repositories on GitHub.',
        category: 'Development',
        estimatedWeeks: 3,
        status: 'pending',
      });
    }

    // 6. If they have solid core metrics, give them System Design or ML specialization
    if (steps.length === 0) {
      steps.push({
        title: 'Learn Distributed System Design Concepts',
        description: 'Study microservices, horizontal scaling, caching, message queues, and load balancing patterns.',
        category: 'System Design',
        estimatedWeeks: 3,
        status: 'pending',
      });
      steps.push({
        title: 'Advanced Machine Learning Specialization',
        description: 'Learn deep learning, model deployment pipelines, and custom neural network architectures.',
        category: 'ML',
        estimatedWeeks: 4,
        status: 'pending',
      });
    }

    // Create or update roadmap
    if (roadmap) {
      roadmap.predictionId = latestPrediction._id;
      roadmap.steps = steps;
      await roadmap.save();
    } else {
      roadmap = await Roadmap.create({
        userId,
        predictionId: latestPrediction._id,
        steps,
      });
    }

    // Add Notification
    await Notification.create({
      userId,
      title: 'Career Roadmap Generated',
      message: `A personalized learning path containing ${steps.length} tasks has been mapped to your profile.`,
      type: 'roadmap',
    });

    res.status(201).json(roadmap);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in student roadmap
// @route   GET /api/roadmap
// @access  Private
export const getRoadmap = async (req, res, next) => {
  try {
    const roadmap = await Roadmap.findOne({ userId: req.user._id });
    if (!roadmap) {
      return res.status(200).json(null);
    }
    res.json(roadmap);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a roadmap step status
// @route   PUT /api/roadmap/step
// @access  Private
export const updateRoadmapStep = async (req, res, next) => {
  const { stepId, status } = req.body;

  if (!stepId || !status) {
    res.status(400);
    return next(new Error('Please provide stepId and status (\'pending\', \'in_progress\', \'completed\')'));
  }

  try {
    const roadmap = await Roadmap.findOne({ userId: req.user._id });

    if (!roadmap) {
      res.status(404);
      return next(new Error('Roadmap not found'));
    }

    // Find the step and update
    const step = roadmap.steps.id(stepId);
    if (!step) {
      res.status(404);
      return next(new Error('Roadmap step not found'));
    }

    step.status = status;
    await roadmap.save(); // pre-save will automatically update the overall progress

    res.json(roadmap);
  } catch (error) {
    next(error);
  }
};
