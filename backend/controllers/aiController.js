import Prediction from '../models/Prediction.js';
import User from '../models/User.js';
import * as ollamaService from '../services/ollamaService.js';

// @desc    Check Ollama connection & model status
// @route   GET /api/ai/status
// @access  Public (or Private)
export const getAIStatus = async (req, res, next) => {
  try {
    const status = await ollamaService.checkOllamaStatus();
    res.json(status);
  } catch (error) {
    next(error);
  }
};

// @desc    Chat with AI Career Mentor
// @route   POST /api/ai/chat
// @access  Private
export const chatWithMentor = async (req, res, next) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400);
    return next(new Error('Please provide conversation messages array'));
  }

  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');
    const latestPrediction = await Prediction.findOne({ userId }).sort({ createdAt: -1 });

    const profile = user.profile || {};
    const codingSkills = profile.codingSkills || {};

    // Build personalized context string strictly from database
    const profileSummary = [
      `- Student Name: ${user.name}`,
      `- Academic CGPA: ${profile.cgpa || 'Not specified'} / 10`,
      `- Active Backlogs: ${profile.backlogs ?? 0}`,
      `- College Tier: Tier ${profile.collegeTier || 3}`,
      `- DSA Rating: ${codingSkills.dsa || 0} / 100`,
      `- Communication Rating: ${codingSkills.communication || 0} / 100`,
      `- Aptitude Rating: ${codingSkills.aptitude || 0} / 100`,
      `- Projects Count: ${profile.projects || 0}`,
      `- Internships Count: ${profile.internships || 0}`,
    ];

    if (latestPrediction) {
      profileSummary.push(
        `- Latest ML Placement Probability: ${Math.round(latestPrediction.probability * 100)}% (${latestPrediction.prediction ? 'Likely Placed' : 'Needs Optimization'})`,
        `- Latest Estimated Salary: ₹${latestPrediction.expectedSalary.toFixed(1)} LPA`
      );
    } else {
      profileSummary.push('- Placement Prediction: No prediction run yet by student.');
    }

    const systemPrompt = `You are the PlacementIQ AI Career Mentor, an expert career advisor and interview coach for university engineering students.
You provide encouraging, pragmatic, step-by-step career advice, resume tips, coding interview strategies, and study recommendations.

STUDENT PROFILE CONTEXT (Use this to personalize answers accurately, never invent different background metrics):
${profileSummary.join('\n')}

GUIDELINES:
1. Always address the student constructively and tailor your tips to their current skill levels and metrics.
2. Provide concrete recommendations (e.g., exact DSA topics, project ideas, portfolio tips, mock interview strategies).
3. If the student has backlogs or low CGPA, advise them on clearing backlogs and emphasizing strong skills and open-source projects.
4. Format responses cleanly using GitHub-flavored Markdown with bullet points or numbered lists.
5. Keep your tone professional, empathetic, and motivating.`;

    const result = await ollamaService.generateChatResponse(messages, systemPrompt);

    res.json({
      success: true,
      message: {
        role: 'assistant',
        content: result.content,
      },
      model: result.model,
    });
  } catch (error) {
    if (error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
      return res.status(503).json({
        success: false,
        message: 'Ollama AI engine is offline. Please ensure Ollama is running locally on port 11434.',
        error: error.message,
      });
    }
    next(error);
  }
};

// @desc    Generate personalized AI roadmap recommendations based on actual student gaps
// @route   POST /api/ai/roadmap
// @access  Private
export const generateAIRoadmap = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');
    const latestPrediction = await Prediction.findOne({ userId }).sort({ createdAt: -1 });

    if (!latestPrediction) {
      res.status(400);
      return next(
        new Error('Please run a placement prediction first before generating AI roadmap recommendations')
      );
    }

    // Determine actual skill gaps from the student's metrics
    const skillGaps = [];
    if (latestPrediction.dsa < 75) {
      skillGaps.push(`- DSA Score (${latestPrediction.dsa}/100): Needs targeted practice in recursion, trees, graphs, and dynamic programming.`);
    }
    if (latestPrediction.aptitude < 75) {
      skillGaps.push(`- Aptitude Score (${latestPrediction.aptitude}/100): Needs regular timed quantitative and logical reasoning practice.`);
    }
    if (latestPrediction.communication < 75) {
      skillGaps.push(`- Communication Score (${latestPrediction.communication}/100): Needs behavioral mock interviews and STAR method practice.`);
    }
    if (latestPrediction.projects < 2) {
      skillGaps.push(`- Project Portfolio (${latestPrediction.projects} project): Needs at least 2 full-stack deployed applications.`);
    }
    if (latestPrediction.internships < 1) {
      skillGaps.push(`- Industry Experience (${latestPrediction.internships} internships): Needs internship experience or verified open-source contributions.`);
    }
    if (latestPrediction.backlogs > 0) {
      skillGaps.push(`- Academic Risk (${latestPrediction.backlogs} backlogs): High priority to clear active backlogs to meet company cutoffs.`);
    }

    const studentData = {
      name: user.name,
      cgpa: latestPrediction.cgpa,
      backlogs: latestPrediction.backlogs,
      collegeTier: latestPrediction.collegeTier,
      dsa: latestPrediction.dsa,
      communication: latestPrediction.communication,
      aptitude: latestPrediction.aptitude,
      projects: latestPrediction.projects,
      internships: latestPrediction.internships,
      latestProbability: latestPrediction.probability,
      latestSalary: latestPrediction.expectedSalary,
      skillGaps: skillGaps.length > 0 ? skillGaps : ['Profile meets baseline across all categories. Focus on advanced system design and scalable systems.'],
    };

    const aiRecommendation = await ollamaService.generateRoadmapAdvice(studentData);

    res.json({
      success: true,
      recommendation: aiRecommendation,
      generatedAt: new Date().toISOString(),
      studentGaps: skillGaps,
    });
  } catch (error) {
    if (error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
      return res.status(503).json({
        success: false,
        message: 'Ollama AI engine is offline. Please start Ollama to generate AI recommendations.',
        error: error.message,
      });
    }
    next(error);
  }
};
