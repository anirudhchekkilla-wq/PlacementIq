import express from 'express';
import { getPredictionExplanation } from '../controllers/explanationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, getPredictionExplanation);

export default router;
