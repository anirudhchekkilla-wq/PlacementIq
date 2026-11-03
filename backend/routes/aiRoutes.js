import express from 'express';
import { getAIStatus, chatWithMentor, generateAIRoadmap } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/status', getAIStatus);
router.post('/chat', protect, chatWithMentor);
router.post('/roadmap', protect, generateAIRoadmap);

export default router;
