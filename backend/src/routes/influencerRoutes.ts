import express from 'express';
import { protect, checkRole } from '../middleware/authMiddleware';
import { getInfluencerStats, getInfluencerDesigns } from '../controllers/influencerController';

const router = express.Router();

router.get('/dashboard', protect, checkRole(['influencer']), getInfluencerStats);
router.get('/designs', protect, checkRole(['influencer']), getInfluencerDesigns);

export default router;

