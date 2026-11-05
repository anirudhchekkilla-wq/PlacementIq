import axios from 'axios';
import Prediction from '../models/Prediction.js';
import * as ollamaService from '../services/ollamaService.js';

// @desc    Get SHAP explainability and natural language explanation for a prediction
// @route   POST /api/explanation
// @access  Private
export const getPredictionExplanation = async (req, res, next) => {
  const { predictionId, predictionData } = req.body;

  try {
    let targetPrediction = null;

    if (predictionId) {
      targetPrediction = await Prediction.findById(predictionId);
      if (!targetPrediction) {
        res.status(404);
        return next(new Error('Prediction not found'));
      }

      // Security check: ensure the student owns this prediction record (unless admin)
      if (
        targetPrediction.userId.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        res.status(403);
        return next(new Error('Access denied: You cannot view predictions belonging to other students'));
      }
    } else if (predictionData) {
      targetPrediction = predictionData;
    } else {
      // Default to latest prediction of the logged-in user
      targetPrediction = await Prediction.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
      if (!targetPrediction) {
        res.status(404);
        return next(new Error('No prediction found. Please run a placement prediction first.'));
      }
    }

    const mlPayload = {
      cgpa: Number(targetPrediction.cgpa),
      backlogs: Number(targetPrediction.backlogs),
      dsa: Number(targetPrediction.dsa),
      communication: Number(targetPrediction.communication),
      aptitude: Number(targetPrediction.aptitude),
      projects: Number(targetPrediction.projects),
      internships: Number(targetPrediction.internships),
      tier: Number(targetPrediction.collegeTier),
    };

    let shapResponse;
    const mlUrl = `${process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000'}/explain`;

    try {
      const response = await axios.post(mlUrl, mlPayload, { timeout: 6000 });
      shapResponse = response.data;
    } catch (mlErr) {
      console.warn('ML Explain Service unreachable or failed, creating fallback SHAP decomposition:', mlErr.message);

      // Graceful fallback mathematical SHAP estimation based on linear feature attributions
      const baseProb = 0.31;
      const baseSal = 13.3;

      const placementContributions = [
        { feature: 'cgpa', studentValue: mlPayload.cgpa, impact: ((mlPayload.cgpa - 7.0) / 10) * 0.45, direction: mlPayload.cgpa >= 7.0 ? 'positive' : 'negative' },
        { feature: 'dsa', studentValue: mlPayload.dsa, impact: ((mlPayload.dsa - 50) / 100) * 0.35, direction: mlPayload.dsa >= 50 ? 'positive' : 'negative' },
        { feature: 'backlogs', studentValue: mlPayload.backlogs, impact: -mlPayload.backlogs * 0.15, direction: mlPayload.backlogs > 0 ? 'negative' : 'positive' },
        { feature: 'internships', studentValue: mlPayload.internships, impact: mlPayload.internships * 0.08, direction: mlPayload.internships > 0 ? 'positive' : 'negative' },
        { feature: 'communication', studentValue: mlPayload.communication, impact: ((mlPayload.communication - 60) / 100) * 0.12, direction: mlPayload.communication >= 60 ? 'positive' : 'negative' },
        { feature: 'aptitude', studentValue: mlPayload.aptitude, impact: ((mlPayload.aptitude - 60) / 100) * 0.10, direction: mlPayload.aptitude >= 60 ? 'positive' : 'negative' },
        { feature: 'projects', studentValue: mlPayload.projects, impact: mlPayload.projects * 0.05, direction: mlPayload.projects > 0 ? 'positive' : 'negative' },
        { feature: 'tier', studentValue: mlPayload.tier, impact: (2 - mlPayload.tier) * 0.08, direction: mlPayload.tier <= 2 ? 'positive' : 'negative' },
      ].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

      const salaryContributions = [
        { feature: 'cgpa', studentValue: mlPayload.cgpa, impact: (mlPayload.cgpa - 7.0) * 1.5, direction: mlPayload.cgpa >= 7.0 ? 'positive' : 'negative' },
        { feature: 'dsa', studentValue: mlPayload.dsa, impact: ((mlPayload.dsa - 50) / 10) * 0.8, direction: mlPayload.dsa >= 50 ? 'positive' : 'negative' },
        { feature: 'internships', studentValue: mlPayload.internships, impact: mlPayload.internships * 1.8, direction: mlPayload.internships > 0 ? 'positive' : 'negative' },
        { feature: 'tier', studentValue: mlPayload.tier, impact: (2 - mlPayload.tier) * 2.5, direction: mlPayload.tier <= 2 ? 'positive' : 'negative' },
        { feature: 'projects', studentValue: mlPayload.projects, impact: mlPayload.projects * 0.9, direction: mlPayload.projects > 0 ? 'positive' : 'negative' },
        { feature: 'communication', studentValue: mlPayload.communication, impact: ((mlPayload.communication - 60) / 10) * 0.4, direction: mlPayload.communication >= 60 ? 'positive' : 'negative' },
        { feature: 'aptitude', studentValue: mlPayload.aptitude, impact: ((mlPayload.aptitude - 60) / 10) * 0.3, direction: mlPayload.aptitude >= 60 ? 'positive' : 'negative' },
        { feature: 'backlogs', studentValue: mlPayload.backlogs, impact: -mlPayload.backlogs * 1.2, direction: mlPayload.backlogs > 0 ? 'negative' : 'positive' },
      ].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

      shapResponse = {
        probability: targetPrediction.probability,
        prediction: targetPrediction.prediction,
        confidence: targetPrediction.confidence,
        expectedSalary: targetPrediction.expectedSalary,
        baseProbability: baseProb,
        baseSalary: baseSal,
        placementContributions,
        salaryContributions,
      };
    }

    // Generate natural language explanation using Ollama
    let aiExplanation = '';
    let ollamaAvailable = true;

    try {
      aiExplanation = await ollamaService.generatePredictionExplanation(
        targetPrediction,
        shapResponse
      );
    } catch (ollamaErr) {
      console.warn('Ollama explanation skipped (offline or busy):', ollamaErr.message);
      ollamaAvailable = false;
      aiExplanation = `### Summary Explanation
- **Top Positive Factors**: ${shapResponse.placementContributions.filter(c => c.direction === 'positive').map(c => c.feature.toUpperCase()).slice(0, 3).join(', ')} helped boost placement outlook.
- **Top Limiting Factors**: ${shapResponse.placementContributions.filter(c => c.direction === 'negative').map(c => c.feature.toUpperCase()).slice(0, 3).join(', ') || 'None significantly limiting'}.
*(Note: Start local Ollama server with ${process.env.OLLAMA_MODEL || 'qwen2.5:1.5b'} to generate full AI natural-language analysis).*`;
    }

    res.json({
      success: true,
      predictionId: targetPrediction._id,
      shap: shapResponse,
      explanation: aiExplanation,
      ollamaAvailable,
    });
  } catch (error) {
    next(error);
  }
};
