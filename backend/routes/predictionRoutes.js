import express from 'express';
import { predictPlacement, getPredictionHistory } from '../controllers/predictionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, predictPlacement);
router.get('/history', protect, getPredictionHistory);

export default router;
