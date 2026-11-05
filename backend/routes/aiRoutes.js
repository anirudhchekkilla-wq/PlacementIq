import express from 'express';
import { getAIStatus, chatWithMentor, generateAIRoadmap, analyzeResume } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/status', getAIStatus);
router.post('/chat', protect, chatWithMentor);
router.post('/roadmap', protect, generateAIRoadmap);
router.post('/resume', protect, analyzeResume);

export default router;
