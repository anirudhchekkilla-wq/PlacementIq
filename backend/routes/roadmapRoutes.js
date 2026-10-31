import express from 'express';
import { generateRoadmap, getRoadmap, updateRoadmapStep } from '../controllers/roadmapController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, generateRoadmap)
  .get(protect, getRoadmap);
router.put('/step', protect, updateRoadmapStep);

export default router;
